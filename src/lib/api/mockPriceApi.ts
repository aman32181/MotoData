import { fetchWithFallback } from "./fetchWithFallback";
import type { PricingData, ApiFetchResult } from "../../lib/type";

/* ================================================================
   mockPriceApi.ts — Simulates a vehicle pricing / market-value API
   In production: replace with e.g. Black Book, Edmunds, or KBB API
   ================================================================ */

// Base MSRP ranges by vehicle type keyword in model name
const BASE_MSRP_MAP: Record<string, number> = {
  "f-150":       45_000,
  "silverado":   40_000,
  "corvette":    70_000,
  "911":         110_000,
  "s1000rr":     20_000,
  "panigale":    25_000,
  "model s":     90_000,
  "model 3":     45_000,
  "model y":     52_000,
  "5 series":    60_000,
  "3 series":    48_000,
  "e-class":     62_000,
  "c-class":     45_000,
  "default":     35_000,
};

function getBaseMsrp(model: string): number {
  const lower = model.toLowerCase();
  for (const [key, price] of Object.entries(BASE_MSRP_MAP)) {
    if (lower.includes(key)) return price;
  }
  return BASE_MSRP_MAP["default"];
}

function seedRandom(seed: number): number {
  const x = Math.sin(seed + 42) * 10000;
  return x - Math.floor(x);
}

function generatePricing(model: string, year: number): PricingData {
  const currentYear = 2025;
  const age = currentYear - year;
  const baseMsrp = getBaseMsrp(model);
  const seed = model.charCodeAt(0) + year;

  // Depreciation: ~15% first year, ~10%/year after
  const depRate1 = 0.13 + seedRandom(seed) * 0.04; // 13-17%
  const depRate3 = 0.35 + seedRandom(seed + 1) * 0.1; // 35-45%

  const depreciatedValue =
    age === 0
      ? baseMsrp
      : age === 1
      ? baseMsrp * (1 - depRate1)
      : baseMsrp * Math.pow(0.88, age); // ~12%/yr compounding

  const avgMarket = Math.round(depreciatedValue * (0.92 + seedRandom(seed + 2) * 0.1));
  const variance = avgMarket * 0.15;

  // Build price history (one entry per year from vehicle year to now)
  const history = Array.from({ length: Math.min(age + 1, 6) }, (_, i) => ({
    year: year + i,
    avgPrice: Math.round(baseMsrp * Math.pow(0.88, i)),
  }));

  return {
    msrp: baseMsrp,
    averageMarketPrice: avgMarket,
    priceRange: {
      min: Math.round(avgMarket - variance),
      max: Math.round(avgMarket + variance),
    },
    depreciation1Year: Math.round(depRate1 * 100),
    depreciation3Year: Math.round(depRate3 * 100),
    history,
  };
}

async function fetchPricing(model: string, year: number): Promise<PricingData> {
  const seed = model.charCodeAt(0) + year;
  const delay = 80 + Math.floor(seedRandom(seed + 5) * 200);
  await new Promise((r) => setTimeout(r, delay));
  return generatePricing(model, year);
}

export function buildPricingFallback(model: string, year: number): PricingData {
  return {
    msrp: 0,
    averageMarketPrice: 0,
    priceRange: { min: 0, max: 0 },
    depreciation1Year: 0,
    depreciation3Year: 0,
    history: [],
  };
}

export function fetchVehiclePricing(
  model: string,
  year: number
): Promise<ApiFetchResult<PricingData>> {
  return fetchWithFallback(
    "mock-pricing",
    () => fetchPricing(model, year),
    buildPricingFallback(model, year),
    { timeoutMs: 4000 }
  );
}