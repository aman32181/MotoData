import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import { BRANDS, getModelBySlug } from "../../../../../lib/data/dataset";
import { YearCard } from "../../../../../components/ui/YearCard";
import { Breadcrumb, Badge } from "../../../../../components/ui";
import { Calendar } from "lucide-react";

type Props = { params: Promise<{ brandSlug: string; modelSlug: string }> };

/* ── generateStaticParams ── */
export function generateStaticParams() {
  return BRANDS.flatMap((b) =>
    b.models.map((m) => ({ brandSlug: b.slug, modelSlug: m.slug }))
  );
}

/* ── Cached data fetcher ── */
async function getModelData(brandSlug: string, modelSlug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(`model-${brandSlug}-${modelSlug}`);
  return getModelBySlug(brandSlug, modelSlug) ?? null;
}

/* ── generateMetadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug, modelSlug } = await params;
  const result = await getModelData(brandSlug, modelSlug);

  if (!result) {
    return { title: "Model Not Found", description: "This vehicle model could not be found." };
  }

  const { brand, model } = result;
  const yearRange = `${Math.min(...model.years)}–${Math.max(...model.years)}`;

  return {
    title: `${brand.name} ${model.name}`,
    description: `Complete ${brand.name} ${model.name} history — specs, recalls, pricing, and reviews for model years ${yearRange}.`,
    openGraph: {
      title: `${brand.name} ${model.name} — CarBike History`,
      description: `All ${brand.name} ${model.name} model years with detailed specs and data.`,
    },
    alternates: { canonical: `/brands/${brand.slug}/models/${model.slug}` },
  };
}

/* ── Page ── */
export default async function ModelPage({ params }: Props) {
  const { brandSlug, modelSlug } = await params;
  const result = await getModelData(brandSlug, modelSlug);

  if (!result) notFound();

  const { brand, model } = result;
  const sortedYears = [...model.years].sort((a, b) => b - a);
  const latestYear = sortedYears[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[
        { label: "Brands", href: "/brands" },
        { label: brand.name, href: `/brands/${brand.slug}` },
        { label: model.name },
      ]} />

      {/* ── Hero ── */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="gray">{brand.name}</Badge>
          <Badge variant={model.type === "motorcycle" ? "blue" : "orange"}>{model.type}</Badge>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl tracking-widest text-text-primary uppercase mb-4">
          {model.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
            <Calendar className="h-3 w-3" />
            {Math.min(...model.years)} – {Math.max(...model.years)}
          </span>
          <span className="font-mono text-xs text-text-muted">
            {model.years.length} model years available
          </span>
        </div>
      </div>

      {/* ── Years ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-2xl tracking-widest text-text-primary uppercase">
            Select Year
          </h2>
          <Badge variant="gray">{model.years.length} years</Badge>
          <div className="flex-1 h-[1px] bg-border ml-2" />
        </div>

        <div className="space-y-3">
          {sortedYears.map((year) => (
            <YearCard
              key={year}
              brand={brand}
              model={model}
              year={year}
              isLatest={year === latestYear}
            />
          ))}
        </div>
      </div>
    </div>
  );
}