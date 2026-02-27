/**
 * __tests__/fetchWithFallback.test.ts
 * Tests the core resilience layer — the most important file in the project.
 * Run with: npm test
 */

import { fetchWithFallback } from "../src/lib/api/fetchWithFallback";
import type { ApiSource } from "../src/lib/type";

const SOURCE: ApiSource = "api-ninjas-specs";

describe("fetchWithFallback", () => {
  /* ── 1. Returns data on success ── */
  it("returns status=ok and correct data on success", async () => {
    const result = await fetchWithFallback(
      SOURCE,
      async () => ({ make: "Toyota", model: "Camry", year: 2022 }),
      null,
      { timeoutMs: 2000 }
    );

    expect(result.status).toBe("ok");
    expect(result.data).toEqual({ make: "Toyota", model: "Camry", year: 2022 });
    expect(result.source).toBe(SOURCE);
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  /* ── 2. Returns fallback on throw ── */
  it("returns status=error and fallback data when fetcher throws", async () => {
    const fallback = { make: "Unknown", model: "Unknown", year: 0 };

    const result = await fetchWithFallback(
      SOURCE,
      async () => {
        throw new Error("Network error");
      },
      fallback,
      { timeoutMs: 2000 }
    );

    expect(result.status).toBe("error");
    expect(result.data).toEqual(fallback);
  });

  /* ── 3. Handles timeout ── */
  it("returns status=timeout when fetcher exceeds timeoutMs", async () => {
    const fallback = { make: "Timeout", model: "Fallback", year: 0 };

    const result = await fetchWithFallback(
      SOURCE,
      () => new Promise((resolve) => setTimeout(resolve, 500)), // takes 500ms
      fallback,
      { timeoutMs: 100 } // but timeout is only 100ms
    );

    expect(result.status).toBe("timeout");
    expect(result.data).toEqual(fallback);
  }, 3000);

  /* ── 4. Never throws — always returns ApiFetchResult ── */
  it("never throws even if fetcher rejects with non-Error value", async () => {
    const result = await fetchWithFallback(
      SOURCE,
      async () => {
        // eslint-disable-next-line no-throw-literal
        throw "string error";
      },
      "fallback-string",
      { timeoutMs: 2000 }
    );

    expect(result.status).toBe("error");
    expect(result.data).toBe("fallback-string");
  });

  /* ── 5. Records latency ── */
  it("records latency in milliseconds", async () => {
    const result = await fetchWithFallback(
      SOURCE,
      async () => {
        await new Promise((r) => setTimeout(r, 50));
        return "data";
      },
      "fallback",
      { timeoutMs: 2000 }
    );

    expect(result.latencyMs).toBeGreaterThanOrEqual(50);
  }, 3000);

  /* ── 6. Uses correct source label ── */
  it("preserves source label in result", async () => {
    const sources: ApiSource[] = [
      "api-ninjas-specs",
      "carapi-trims",
      "mock-recalls",
      "mock-pricing",
      "mock-reviews",
    ];

    for (const source of sources) {
      const result = await fetchWithFallback(source, async () => true, false);
      expect(result.source).toBe(source);
    }
  });

  /* ── 7. Null fallback is valid ── */
  it("accepts null as a valid fallback", async () => {
    const result = await fetchWithFallback(
      SOURCE,
      async () => {
        throw new Error("fail");
      },
      null
    );

    expect(result.data).toBeNull();
    expect(result.status).toBe("error");
  });
});