import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { getAllYearParams, getModelBySlug } from "../../../../../../../lib/data/dataset";
import {
  fetchVehicleSpecs,
  fetchVehicleTrims,
  fetchVehicleRecalls,
  fetchVehiclePricing,
  fetchVehicleReviews,
} from "../../../../../../../lib/api";
import { Breadcrumb, Badge, ApiStatusBar } from "../../../../../../../components/ui";
import { SpecsSection } from "../../../../../../../components/sections/SpecsSection";
import { TrimsSection } from "../../../../../../../components/sections/TrimsSection";
import { RecallsSection } from "../../../../../../../components/sections/RecallsSection";
import { PricingSection } from "../../../../../../../components/sections/PricingSection";
import { ReviewsSection } from "../../../../../../../components/sections/ReviewsSection";
import { Calendar, Shield } from "lucide-react";

type Props = {
  params: Promise<{ brandSlug: string; modelSlug: string; year: string }>;
};

/* ─────────────────────────────────────────────
   generateStaticParams
   Pre-builds every year page from the dataset.
   For 1M pages, return only top N here — the rest
   are generated on-demand and cached after first visit.
───────────────────────────────────────────── */
export function generateStaticParams() {
  // Pre-build ALL pages in this demo dataset (small).
  // For 1M pages, you'd do: return getAllYearParams().slice(0, 200)
  return getAllYearParams();
}

/* ─────────────────────────────────────────────
   Core data fetcher — ALL 5 APIs fired in parallel
   Uses `use cache` + cacheTag for targeted revalidation
───────────────────────────────────────────── */
async function getYearPageData(
  brandSlug: string,
  modelSlug: string,
  year: number
) {
  "use cache";
  cacheLife({ revalidate: 3600, expire: 86400 }); // fresh for 1h, expires in 24h
  cacheTag(
    `year-${brandSlug}-${modelSlug}-${year}`,
    `brand-${brandSlug}`,
    `model-${brandSlug}-${modelSlug}`
  );

  const lookup = getModelBySlug(brandSlug, modelSlug);
  if (!lookup) return null;

  const { brand, model } = lookup;
  const make = brand.name;
  const modelName = model.name;

  // Fire all 5 APIs in parallel — Promise.allSettled means 
  // page always renders even if all 5 fail
  const [specs, trims, recalls, pricing, reviews] = await Promise.allSettled([
    fetchVehicleSpecs(make, modelName, year),
    fetchVehicleTrims(make, modelName, year),
    fetchVehicleRecalls(make, modelName, year),
    fetchVehiclePricing(modelName, year),
    fetchVehicleReviews(make, modelName, year),
  ]);

  return {
    brand,
    model,
    year,
    specs: specs.status === "fulfilled" ? specs.value : { source: "api-ninjas-specs" as const, status: "error" as const, data: null, latencyMs: 0 },
    trims: trims.status === "fulfilled" ? trims.value : { source: "carapi-trims" as const, status: "error" as const, data: null, latencyMs: 0 },
    recalls: recalls.status === "fulfilled" ? recalls.value : { source: "mock-recalls" as const, status: "error" as const, data: null, latencyMs: 0 },
    pricing: pricing.status === "fulfilled" ? pricing.value : { source: "mock-pricing" as const, status: "error" as const, data: null, latencyMs: 0 },
    reviews: reviews.status === "fulfilled" ? reviews.value : { source: "mock-reviews" as const, status: "error" as const, data: null, latencyMs: 0 },
  };
}

/* ─────────────────────────────────────────────
   generateMetadata
   Uses only local dataset data — NEVER depends on
   upstream APIs, so SEO metadata NEVER breaks.
───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug, modelSlug, year } = await params;
  const lookup = getModelBySlug(brandSlug, modelSlug);

  // Pure local fallback — works even if all APIs are down
  if (!lookup) {
    return {
      title: `${brandSlug} ${modelSlug} ${year}`,
      description: `Vehicle history and specifications for ${brandSlug} ${modelSlug} ${year}.`,
    };
  }

  const { brand, model } = lookup;
  const yearNum = parseInt(year);

  return {
    title: `${yearNum} ${brand.name} ${model.name}`,
    description: `${yearNum} ${brand.name} ${model.name} — complete specs, trim levels, recall history, pricing, and owner reviews. Full vehicle data in one page.`,
    keywords: [
      `${yearNum} ${brand.name} ${model.name}`,
      `${brand.name} ${model.name} specs`,
      `${brand.name} ${model.name} recall`,
      `${brand.name} ${model.name} price`,
      `${brand.name} ${model.name} review`,
    ],
    openGraph: {
      title: `${yearNum} ${brand.name} ${model.name} — Full History`,
      description: `Specs, trims, recalls, pricing and reviews for the ${yearNum} ${brand.name} ${model.name}.`,
      type: "article",
    },
    alternates: {
      canonical: `/brands/${brandSlug}/models/${modelSlug}/years/${year}`,
    },
  };
}

/* ─────────────────────────────────────────────
   Page Component
───────────────────────────────────────────── */
export default async function YearPage({ params }: Props) {
  const { brandSlug, modelSlug, year: yearStr } = await params;
  const yearNum = parseInt(yearStr);

  if (isNaN(yearNum)) notFound();

  const data = await getYearPageData(brandSlug, modelSlug, yearNum);
  if (!data) notFound();

  const { brand, model, specs, trims, recalls, pricing, reviews } = data;
  const allResults = [specs, trims, recalls, pricing, reviews];
  const okCount = allResults.filter((r) => r.status === "ok").length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Breadcrumb ── */}
      <Breadcrumb items={[
        { label: "Brands", href: "/brands" },
        { label: brand.name, href: `/brands/${brand.slug}` },
        { label: model.name, href: `/brands/${brand.slug}/models/${model.slug}` },
        { label: String(yearNum) },
      ]} />

      {/* ── Hero ── */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Badge variant="gray">{brand.name}</Badge>
          <Badge variant={model.type === "motorcycle" ? "blue" : "orange"}>{model.type}</Badge>
          <Badge variant="gray">{yearNum}</Badge>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl tracking-widest text-text-primary uppercase leading-none mb-4">
          {yearNum} {brand.name}
          <br />
          <span className="text-gradient">{model.name}</span>
        </h1>

        {/* API status row */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-text-muted" />
            <span className="font-mono text-xs text-text-muted">
              {okCount}/5 data sources loaded
              {okCount < 5 && " — page displays available data only"}
            </span>
          </div>
          <ApiStatusBar results={allResults} />
        </div>
      </div>

      {/* ── 5 Content Sections ── */}
      <div className="space-y-16">
        {/* Section 1: Specs — API Ninjas */}
        <section id="specs">
          <SpecsSection result={specs} />
        </section>

        <div className="h-[1px] bg-border" />

        {/* Section 2: Trims — CarAPI */}
        <section id="trims">
          <TrimsSection result={trims} />
        </section>

        <div className="h-[1px] bg-border" />

        {/* Section 3: Recalls — Mock NHTSA */}
        <section id="recalls">
          <RecallsSection result={recalls} />
        </section>

        <div className="h-[1px] bg-border" />

        {/* Section 4: Pricing */}
        <section id="pricing">
          <PricingSection result={pricing} />
        </section>

        <div className="h-[1px] bg-border" />

        {/* Section 5: Reviews */}
        <section id="reviews">
          <ReviewsSection result={reviews} />
        </section>
      </div>

      {/* ── JSON-LD Structured Data (SEO) ── */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${yearNum} ${brand.name} ${model.name}`,
            brand: { "@type": "Brand", name: brand.name },
            description: `${yearNum} ${brand.name} ${model.name} vehicle history and specifications`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/brands/${brand.slug}/models/${model.slug}/years/${yearNum}`,
          }),
        }}
      />
    </div>
  );
}