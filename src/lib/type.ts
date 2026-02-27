/* ================================================================
   types.ts — Shared TypeScript types for the entire app
   ================================================================ */

/* ── API Response Wrapper ── */
export type ApiResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error: string; data: null };

/* ── API Source identifier (used in UI badges) ── */
export type ApiSource =
  | "api-ninjas-specs"
  | "carapi-trims"
  | "mock-recalls"
  | "mock-pricing"
  | "mock-reviews";

/* ── Per-API fetch result shown on page ── */
export interface ApiFetchResult<T> {
  source: ApiSource;
  status: "ok" | "error" | "timeout";
  data: T | null;
  latencyMs?: number;
}

/* ─────────────────────────────────────────────
   BRAND
───────────────────────────────────────────── */
export interface Brand {
  slug: string;           // e.g. "toyota"
  name: string;           // e.g. "Toyota"
  type: "car" | "bike" | "both";
  country: string;
  founded: number;
  description: string;
  models: Model[];
}

/* ─────────────────────────────────────────────
   MODEL
───────────────────────────────────────────── */
export interface Model {
  slug: string;           // e.g. "camry"
  name: string;           // e.g. "Camry"
  brandSlug: string;
  type: "sedan" | "suv" | "truck" | "coupe" | "motorcycle" | "hatchback" | "van";
  years: number[];        // available years
}

/* ─────────────────────────────────────────────
   VEHICLE SPECS  (API Ninjas /v1/cardetails)
───────────────────────────────────────────── */
export interface VehicleSpecs {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  cylinders?: number;
  displacement?: number;
  horsepower?: number;
  torque?: number;
  transmission?: string;
  drive?: string;
  fuel_type?: string;
  mpg_city?: number;
  mpg_highway?: number;
  doors?: number;
  body_style?: string;
}

/* ─────────────────────────────────────────────
   TRIMS  (CarAPI.app /api/trims)
───────────────────────────────────────────── */
export interface VehicleTrim {
  id: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  description?: string;
  msrp?: number;
  invoice?: number;
}

export interface CarApiTrimsResponse {
  collection: {
    url: string;
    count: number;
    pages: number;
    total: number;
  };
  data: VehicleTrim[];
}

/* ─────────────────────────────────────────────
   RECALLS  (Mock API 3)
───────────────────────────────────────────── */
export interface Recall {
  id: string;
  date: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  affectedUnits: number;
}

/* ─────────────────────────────────────────────
   PRICING  (Mock API 4)
───────────────────────────────────────────── */
export interface PricingData {
  msrp: number;
  averageMarketPrice: number;
  priceRange: { min: number; max: number };
  depreciation1Year: number;   // % lost after 1 year
  depreciation3Year: number;
  history: { year: number; avgPrice: number }[];
}

/* ─────────────────────────────────────────────
   REVIEWS  (Mock API 5)
───────────────────────────────────────────── */
export interface Review {
  id: string;
  author: string;
  rating: number;           // 1-5
  title: string;
  body: string;
  date: string;
  pros: string[];
  cons: string[];
  verified: boolean;
}

export interface ReviewsSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: Review[];
}

/* ─────────────────────────────────────────────
   AGGREGATED PAGE DATA
   (what each page receives after all 5 APIs)
───────────────────────────────────────────── */
export interface YearPageData {
  brand: Brand;
  model: Model;
  year: number;
  specs: ApiFetchResult<VehicleSpecs>;
  trims: ApiFetchResult<VehicleTrim[]>;
  recalls: ApiFetchResult<Recall[]>;
  pricing: ApiFetchResult<PricingData>;
  reviews: ApiFetchResult<ReviewsSummary>;
}

/* ─────────────────────────────────────────────
   SITEMAP
───────────────────────────────────────────── */
export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}