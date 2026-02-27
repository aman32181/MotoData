import { fetchWithFallback } from "../api/fetchWithFallback";
import type { Recall, ApiFetchResult } from "../../lib/type";

/* ================================================================
   mockRecallApi.ts — Simulates a NHTSA-style recall database
   In production: replace fetcher() with real NHTSA API call:
     https://api.nhtsa.gov/recalls/recallsByVehicle?make=...
   ================================================================ */

const RECALL_TEMPLATES: Omit<Recall, "id" | "date">[] = [
  {
    component: "Air Bag",
    summary: "The driver-side air bag inflator may rupture due to moisture intrusion.",
    consequence: "Inflator rupture can cause metal fragments to be propelled, injuring or killing occupants.",
    remedy: "Dealers will replace the driver-side air bag inflator free of charge.",
    affectedUnits: 45_200,
  },
  {
    component: "Fuel System",
    summary: "Fuel pump may fail causing the engine to stall without warning.",
    consequence: "Engine stall increases the risk of a crash.",
    remedy: "Dealers will replace the fuel pump module at no cost.",
    affectedUnits: 12_800,
  },
  {
    component: "Brakes",
    summary: "Brake vacuum pump may develop a crack leading to reduced braking performance.",
    consequence: "Reduced braking ability increases risk of collision.",
    remedy: "Dealers will inspect and replace the brake vacuum pump.",
    affectedUnits: 8_500,
  },
  {
    component: "Steering",
    summary: "A bolt in the steering intermediate shaft may loosen over time.",
    consequence: "Loosened bolt may cause loss of steering control.",
    remedy: "Dealers will inspect and tighten or replace the bolt.",
    affectedUnits: 33_100,
  },
  {
    component: "Electrical System",
    summary: "Software error may cause instrument cluster to go blank momentarily.",
    consequence: "Loss of instrument data may distract the driver.",
    remedy: "Dealers will update the instrument cluster software.",
    affectedUnits: 21_700,
  },
];

function seedRandom(seed: number) {
  // Simple deterministic pseudo-random based on seed
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function generateRecalls(make: string, model: string, year: number): Recall[] {
  // Deterministic seed so the same vehicle always returns the same recalls
  const seed = make.charCodeAt(0) + model.charCodeAt(0) + year;
  const count = Math.floor(seedRandom(seed) * 3); // 0–2 recalls per vehicle

  return Array.from({ length: count }, (_, i) => {
    const templateIndex = Math.floor(
      seedRandom(seed + i) * RECALL_TEMPLATES.length
    );
    const template = RECALL_TEMPLATES[templateIndex];
    const recallYear = year - Math.floor(seedRandom(seed + i * 2) * 2);
    const month = String(
      Math.floor(seedRandom(seed + i * 3) * 12) + 1
    ).padStart(2, "0");

    return {
      ...template,
      id: `NHTSA-${year}-${String(templateIndex + 1).padStart(4, "0")}-${i}`,
      date: `${recallYear}-${month}-01`,
    };
  });
}

async function fetchRecalls(
  make: string,
  model: string,
  year: number
): Promise<Recall[]> {
  // Simulate realistic API latency (50–300ms)
  const seed = make.charCodeAt(0) + year;
  const delay = 50 + Math.floor(seedRandom(seed) * 250);
  await new Promise((r) => setTimeout(r, delay));

  return generateRecalls(make, model, year);
}

export function fetchVehicleRecalls(
  make: string,
  model: string,
  year: number
): Promise<ApiFetchResult<Recall[]>> {
  return fetchWithFallback(
    "mock-recalls",
    () => fetchRecalls(make, model, year),
    [], // empty recalls array as fallback
    { timeoutMs: 4000 }
  );
}