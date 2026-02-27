import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { BRANDS, getBrandBySlug } from "../../../lib/data/dataset";
import { ModelCard } from "../../../components/ui/ModelCard";
import { Breadcrumb, Badge } from "../../../components/ui";
import { MapPin, Calendar, Layers } from "lucide-react";

/* ── Next.js 16: params is async ── */
type Props = { params: Promise<{ brandSlug: string }> };

/* ── generateStaticParams: pre-build all brand pages ── */
export function generateStaticParams() {
  return BRANDS.map((b) => ({ brandSlug: b.slug }));
}

/* ── Cached data fetcher ── */
async function getBrandData(brandSlug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`brand-${brandSlug}`);
  return getBrandBySlug(brandSlug) ?? null;
}

/* ── generateMetadata — always returns something even if brand not found ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandData(brandSlug);

  if (!brand) {
    return {
      title: "Brand Not Found",
      description: "This vehicle brand could not be found.",
    };
  }

  return {
    title: brand.name,
    description: `Explore all ${brand.name} models — specs, recalls, pricing, and ownership history. ${brand.models.length} models available.`,
    openGraph: {
      title: `${brand.name} — CarBike History`,
      description: brand.description,
    },
    alternates: {
      canonical: `/brands/${brand.slug}`,
    },
  };
}

/* ── Page ── */
export default async function BrandPage({ params }: Props) {
  const { brandSlug } = await params;
  const brand = await getBrandData(brandSlug);

  if (!brand) notFound();

  const totalYears = brand.models.reduce((t, m) => t + m.years.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />

      {/* ── Hero ── */}
      <div className="mb-12 pb-10 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Brand monogram */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 glow-orange">
            <span className="font-display text-3xl tracking-widest text-orange-400">
              {brand.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="font-display text-5xl sm:text-6xl tracking-widest text-text-primary uppercase">
                {brand.name}
              </h1>
              <Badge variant={brand.type === "bike" ? "blue" : brand.type === "both" ? "orange" : "gray"}>
                {brand.type === "both" ? "Cars & Bikes" : brand.type === "bike" ? "Motorcycles" : "Cars"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <MapPin className="h-3 w-3" /> {brand.country}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <Calendar className="h-3 w-3" /> Founded {brand.founded}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                <Layers className="h-3 w-3" /> {brand.models.length} Models · {totalYears} Pages
              </span>
            </div>

            <p className="text-text-secondary leading-relaxed max-w-2xl">
              {brand.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Models ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl tracking-widest text-text-primary uppercase">
            Models
          </h2>
          <Badge variant="gray">{brand.models.length}</Badge>
          <div className="flex-1 h-[1px] bg-border ml-2" />
        </div>
        <div className="space-y-3">
          {brand.models.map((model) => (
            <ModelCard key={model.slug} brand={brand} model={model} />
          ))}
        </div>
      </div>
    </div>
  );
}