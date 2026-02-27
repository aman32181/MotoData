import { fetchWithFallback } from "../../lib/api/fetchWithFallback";
import type { VehicleSpecs, ApiFetchResult } from "../../lib/type";

/* ================================================================
   carsApi.ts — API Ninjas /v1/cars
   Docs: https://api-ninjas.com/api/cars
   Auth: X-Api-Key header (free tier)

   FREE TIER RESTRICTIONS (confirmed from error responses):
   - `limit` param is PREMIUM only — do NOT send it
   - `make` and `model` must be lowercase
   - Returns an array of matching vehicles
   ================================================================ */

const BASE_URL = "https://api.api-ninjas.com/v1";

function getApiKey(): string {
  const key = process.env.API_NINJAS_KEY;
  if (!key || key === "your_api_ninjas_key_here") {
    throw new Error("API_NINJAS_KEY is not configured in .env.local");
  }
  return key;
}

export function buildSpecsFallback(
  make: string,
  model: string,
  year: number
): VehicleSpecs {
  return {
    make, model, year,
    trim: undefined,
    engine: undefined,
    cylinders: undefined,
    displacement: undefined,
    horsepower: undefined,
    torque: undefined,
    transmission: undefined,
    drive: undefined,
    fuel_type: undefined,
    mpg_city: undefined,
    mpg_highway: undefined,
    doors: undefined,
    body_style: undefined,
  };
}

async function fetchSpecs(make: string, model: string, year: number): Promise<VehicleSpecs> {
  const params = new URLSearchParams({
    make: make.toLowerCase(),   // must be lowercase
    model: model.toLowerCase(), // must be lowercase
    year: String(year),
    // DO NOT include `limit` — premium only, causes 400 on free tier
  });

  const res = await fetch(`${BASE_URL}/cars?${params}`, {
    headers: { "X-Api-Key": getApiKey() },
    next: { tags: [`specs-${make}-${model}-${year}`], revalidate: 86400 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API Ninjas /v1/cars → ${res.status}: ${body}`);
  }

  const json = await res.json();

  if (Array.isArray(json) && json.length > 0) {
    const raw = json[0];
    return {
      make: raw.make ?? make,
      model: raw.model ?? model,
      year: raw.year ?? year,
      trim: raw.trim,
      engine: undefined,          // not in /v1/cars response
      cylinders: raw.cylinders,
      displacement: raw.displacement,
      horsepower: raw.horsepower,
      torque: raw.torque,
      transmission: raw.transmission,
      drive: raw.drive,
      fuel_type: raw.fuel_type,
      mpg_city: raw.city_mpg,
      mpg_highway: raw.highway_mpg,
      doors: raw.doors,
      body_style: raw.class,
    };
  }

  return buildSpecsFallback(make, model, year);
}

export function fetchVehicleSpecs(
  make: string,
  model: string,
  year: number
): Promise<ApiFetchResult<VehicleSpecs>> {
  return fetchWithFallback(
    "api-ninjas-specs",
    () => fetchSpecs(make, model, year),
    buildSpecsFallback(make, model, year),
    { timeoutMs: 6000 }
  );
}