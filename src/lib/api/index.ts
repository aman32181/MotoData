/* ================================================================
   index.ts — Single import point for all API fetchers
   Usage: import { fetchVehicleSpecs, fetchVehicleTrims } from "@/lib/api"
   ================================================================ */

export { fetchVehicleSpecs, buildSpecsFallback } from "./carsApi";
export { fetchVehicleTrims, buildTrimsFallback } from "./carApiApp";
export { fetchVehicleRecalls } from "./mockRecallApi";
export { fetchVehiclePricing, buildPricingFallback } from "./mockPriceApi";
export { fetchVehicleReviews, buildReviewsFallback } from "./mockReviewApi";
export { fetchWithFallback, fetchAllApis } from "./fetchWithFallback";