import { fetchWithFallback } from "../../lib/api/fetchWithFallback";
import type { VehicleTrim, ApiFetchResult } from "../../lib/type";

/* ================================================================
   carApiApp.ts — carapi.app /api/trims
   Docs: https://carapi.app/docs/
   
   FREE TIER (no account needed):
   - NO Authorization header — omit it entirely (sending a bad/empty
     bearer causes HTTP 400 "token is invalid")
   - Dataset is strictly limited to: make=Ford OR Toyota, year=2020
   - All other makes/years return empty data[] on free tier
   
   PAID TIER (subscription required):
   - POST /api/auth/login with api_token + api_secret → get JWT
   - Send JWT as Authorization: Bearer <token>
   - Unlocks all 66,000+ vehicles from 1990 to present
   - JWT expires every 7 days — we auto-refresh it
   
   .env.local variables:
   CARAPI_API_TOKEN=your_token    ← from carapi.app dashboard
   CARAPI_API_SECRET=your_secret  ← from carapi.app dashboard
   (leave blank to use free-tier demo data: Ford/Toyota 2020 only)
   ================================================================ */

const BASE_URL = "https://carapi.app/api";

/* ── In-memory JWT cache ── */
let cachedJwt: string | null = null;
let jwtExpiresAt = 0;

function getCredentials() {
  const token = process.env.CARAPI_API_TOKEN;
  const secret = process.env.CARAPI_API_SECRET;
  if (
    !token || !secret ||
    token === "your_carapi_api_token_here" ||
    secret === "your_carapi_api_secret_here"
  ) return null;
  return { token, secret };
}

async function fetchFreshJwt(token: string, secret: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify({ api_token: token, api_secret: secret }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CarAPI login failed ${res.status}: ${body}`);
  }
  return (await res.text()).trim();
}

async function getJwt(): Promise<string | null> {
  const creds = getCredentials();
  if (!creds) return null;

  const now = Math.floor(Date.now() / 1000);
  if (!cachedJwt || now >= jwtExpiresAt - 60) {
    const jwt = await fetchFreshJwt(creds.token, creds.secret);
    cachedJwt = jwt;
    try {
      const payload = JSON.parse(
        Buffer.from(jwt.split(".")[1], "base64").toString("utf8")
      );
      jwtExpiresAt = payload.exp ?? now + 7 * 24 * 3600;
    } catch {
      jwtExpiresAt = now + 7 * 24 * 3600;
    }
    console.log("[carApiApp] JWT refreshed, expires:", new Date(jwtExpiresAt * 1000).toISOString());
  }
  return cachedJwt;
}

export function buildTrimsFallback(make: string, model: string, year: number): VehicleTrim[] {
  const creds = getCredentials();
  const reason = creds
    ? "No trims found in CarAPI for this make/model/year"
    : "Free tier limited to Ford & Toyota 2020 — add CARAPI_API_TOKEN + CARAPI_API_SECRET for full access";
  return [{ id: 0, make, model, year, trim: "Standard", description: reason, msrp: undefined, invoice: undefined }];
}

async function fetchTrims(make: string, model: string, year: number): Promise<VehicleTrim[]> {
  const jwt = await getJwt();

  const params = new URLSearchParams({ year: String(year), make, model });

  const headers: Record<string, string> = { Accept: "application/json" };

  // KEY: only add Authorization when we have a valid JWT
  // Omitting it entirely = anonymous free-tier access (Ford/Toyota 2020 only)
  // Sending an invalid/empty bearer = HTTP 400 error
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }

  const res = await fetch(`${BASE_URL}/trims?${params}`, {
    headers,
    next: { tags: [`trims-${make}-${model}-${year}`], revalidate: 86400 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CarAPI /api/trims → ${res.status}: ${body}`);
  }

  const json = await res.json();

  if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
    return json.data.map((t: {
      id: number; make?: string; model?: string; year?: number;
      trim?: string; submodel?: string; description?: string;
      msrp?: number; invoice?: number;
    }) => ({
      id: t.id,
      make: t.make ?? make,
      model: t.model ?? model,
      year: t.year ?? year,
      trim: t.trim ?? t.submodel ?? "Standard",
      description: t.description,
      msrp: t.msrp,
      invoice: t.invoice,
    }));
  }

  return buildTrimsFallback(make, model, year);
}

export function fetchVehicleTrims(
  make: string,
  model: string,
  year: number
): Promise<ApiFetchResult<VehicleTrim[]>> {
  return fetchWithFallback(
    "carapi-trims",
    () => fetchTrims(make, model, year),
    buildTrimsFallback(make, model, year),
    { timeoutMs: 6000 }
  );
}

/* ================================================================
   DEV NOTE — Free Tier Test URLs (no account needed):
   
   These will return REAL trim data without any API credentials:
   → /brands/ford/models/f-150/years/2020
   → /brands/toyota/models/camry/years/2020
   → /brands/toyota/models/corolla/years/2020
   
   All other makes/years will show the fallback message until you
   add CARAPI_API_TOKEN + CARAPI_API_SECRET to .env.local
   ================================================================ */
