import type { ApiFetchResult, ApiSource } from "../../lib/type";

/* ================================================================
   fetchWithFallback.ts
   ─────────────────────────────────────────────────────────────────
   The core resilience layer. Wraps ANY async data-fetch with:
     • Per-call timeout (default 4s)
     • try/catch isolation — one failure never affects others
     • Returns a typed ApiFetchResult<T> with status + latency
     • Caller provides a fallback value returned on error/timeout

   Usage:
     const result = await fetchWithFallback(
       "api-ninjas-specs",
       () => fetchFromApiNinjas(make, model, year),
       fallbackSpecs,
       { timeoutMs: 5000 }
     );
   ================================================================ */

export interface FetchOptions {
  /** Abort after this many ms. Default: 4000 */
  timeoutMs?: number;
}

export async function fetchWithFallback<T>(
  source: ApiSource,
  fetcher: () => Promise<T>,
  fallback: T,
  options: FetchOptions = {}
): Promise<ApiFetchResult<T>> {
  const { timeoutMs = 4000 } = options;
  const start = Date.now();

  // Build an AbortController for timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Race the fetcher against the timeout signal
    const data = await Promise.race([
      fetcher(),
      new Promise<never>((_, reject) =>
        controller.signal.addEventListener("abort", () =>
          reject(new Error(`Timeout after ${timeoutMs}ms`))
        )
      ),
    ]);

    clearTimeout(timer);
    return {
      source,
      status: "ok",
      data,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    clearTimeout(timer);

    const isTimeout =
      err instanceof Error && err.message.startsWith("Timeout");

    // Log server-side — never crashes the page
    console.warn(
      `[fetchWithFallback] ${source} ${isTimeout ? "timed out" : "failed"}:`,
      err instanceof Error ? err.message : err
    );

    return {
      source,
      status: isTimeout ? "timeout" : "error",
      data: fallback,
      latencyMs: Date.now() - start,
    };
  }
}

/* ─────────────────────────────────────────────
   fetchAllApis
   Fires all 5 API calls in parallel with Promise.allSettled.
   Returns all 5 results regardless of failures.
───────────────────────────────────────────── */
export async function fetchAllApis<
  T1, T2, T3, T4, T5
>(fetchers: [
  () => Promise<ApiFetchResult<T1>>,
  () => Promise<ApiFetchResult<T2>>,
  () => Promise<ApiFetchResult<T3>>,
  () => Promise<ApiFetchResult<T4>>,
  () => Promise<ApiFetchResult<T5>>,
]): Promise<[
  ApiFetchResult<T1>,
  ApiFetchResult<T2>,
  ApiFetchResult<T3>,
  ApiFetchResult<T4>,
  ApiFetchResult<T5>,
]> {
  // Promise.allSettled — NEVER throws even if all 5 reject
  const results = await Promise.allSettled(fetchers.map((f) => f()));

  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    // This path is extremely rare since fetchWithFallback itself never throws
    console.error(`[fetchAllApis] fetcher[${i}] unexpectedly threw:`, r.reason);
    return {
      source: "api-ninjas-specs" as ApiSource,
      status: "error" as const,
      data: null,
      latencyMs: 0,
    };
  }) as [
    ApiFetchResult<T1>,
    ApiFetchResult<T2>,
    ApiFetchResult<T3>,
    ApiFetchResult<T4>,
    ApiFetchResult<T5>,
  ];
}