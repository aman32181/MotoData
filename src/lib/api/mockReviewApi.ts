import { fetchWithFallback } from "../api/fetchWithFallback";
import type { Review, ReviewsSummary, ApiFetchResult } from "../../lib/type";

/* ================================================================
   mockReviewApi.ts — Simulates a user review aggregation API
   In production: replace with e.g. Edmunds Reviews, J.D. Power API
   ================================================================ */

const REVIEWER_NAMES = [
  "Alex M.", "Sam R.", "Jordan K.", "Casey T.", "Riley B.",
  "Morgan L.", "Taylor S.", "Quinn P.", "Drew H.", "Blake W.",
];

const PROS_POOL = [
  "Excellent fuel economy",
  "Smooth ride quality",
  "Spacious interior",
  "Responsive handling",
  "Reliable engine",
  "Great resale value",
  "Advanced safety features",
  "User-friendly infotainment",
  "Powerful performance",
  "Low maintenance costs",
];

const CONS_POOL = [
  "Firm suspension on rough roads",
  "Limited cargo space",
  "Basic interior materials",
  "Slow infotainment response",
  "High insurance premiums",
  "Cramped rear seating",
  "Limited color options",
  "Road noise at highway speeds",
  "Average braking distances",
  "Pricey optional packages",
];

const TITLES = [
  "Solid daily driver, very happy with my purchase",
  "Exceeded all my expectations after 2 years",
  "Great value for the money",
  "Performance is outstanding in its class",
  "Reliable and comfortable — highly recommend",
  "Good car but has minor quirks",
  "Best vehicle I have owned in a decade",
  "Handles daily commute and weekend trips equally well",
];

function seedRandom(seed: number): number {
  const x = Math.sin(seed + 17) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seedRandom(seed) * arr.length)];
}

function generateReviews(
  make: string,
  model: string,
  year: number
): ReviewsSummary {
  const baseSeed = make.charCodeAt(0) * 100 + model.charCodeAt(0) + year;
  const count = 3 + Math.floor(seedRandom(baseSeed) * 5); // 3-7 reviews

  const reviews: Review[] = Array.from({ length: count }, (_, i) => {
    const seed = baseSeed + i * 13;
    const rating = Math.max(
      3,
      Math.min(5, Math.round(3.5 + seedRandom(seed) * 1.5))
    ) as 1 | 2 | 3 | 4 | 5;

    const reviewYear = year + Math.floor(seedRandom(seed + 1) * 2);
    const month = String(Math.floor(seedRandom(seed + 2) * 12) + 1).padStart(2, "0");

    return {
      id: `rev-${make.slice(0, 3)}-${year}-${i}`,
      author: pick(REVIEWER_NAMES, seed + 3),
      rating,
      title: pick(TITLES, seed + 4),
      body: `I have been driving this ${year} ${make} ${model} for about ${
        1 + Math.floor(seedRandom(seed + 5) * 3)
      } year(s) and overall I'm very satisfied. The build quality is impressive and it handles daily commuting with ease.`,
      date: `${reviewYear}-${month}-${String(Math.floor(seedRandom(seed + 6) * 28) + 1).padStart(2, "0")}`,
      pros: [
        pick(PROS_POOL, seed + 7),
        pick(PROS_POOL, seed + 8),
      ],
      cons: [
        pick(CONS_POOL, seed + 9),
      ],
      verified: seedRandom(seed + 10) > 0.3,
    };
  });

  // Calculate distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1|2|3|4|5, number>;
  reviews.forEach((r) => distribution[r.rating as 1|2|3|4|5]++);

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length + Math.floor(seedRandom(baseSeed + 99) * 200),
    distribution,
    reviews,
  };
}

async function fetchReviews(
  make: string,
  model: string,
  year: number
): Promise<ReviewsSummary> {
  const seed = make.charCodeAt(0) + year;
  const delay = 60 + Math.floor(seedRandom(seed + 7) * 180);
  await new Promise((r) => setTimeout(r, delay));
  return generateReviews(make, model, year);
}

export function buildReviewsFallback(): ReviewsSummary {
  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: [],
  };
}

export function fetchVehicleReviews(
  make: string,
  model: string,
  year: number
): Promise<ApiFetchResult<ReviewsSummary>> {
  return fetchWithFallback(
    "mock-reviews",
    () => fetchReviews(make, model, year),
    buildReviewsFallback(),
    { timeoutMs: 4000 }
  );
}