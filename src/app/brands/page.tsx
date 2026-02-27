import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { BRANDS } from "../../lib/data/dataset";
import { BrandCard } from "../../components/ui/BrandCard";
import { Badge } from "../../components/ui";
import { Car, Bike, Layers } from "lucide-react";

/* ── Metadata ── */
export const metadata: Metadata = {
  title: "All Brands",
  description:
    "Browse all car and motorcycle brands. Explore detailed history, specs, recalls, and pricing for every model and year.",
  openGraph: {
    title: "All Brands — CarBike History",
    description: "Browse all car and motorcycle brands with detailed specs and history.",
  },
};

/* ── Cached data fetcher ── */
async function getBrandsData() {
  "use cache";
  cacheLife("hours");
  return BRANDS;
}

/* ── Page ── */
export default async function BrandsPage() {
  const brands = await getBrandsData();

  const cars = brands.filter((b) => b.type === "car" || b.type === "both");
  const bikes = brands.filter((b) => b.type === "bike" || b.type === "both");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="orange">{brands.length} Brands</Badge>
        </div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-widest text-text-primary uppercase mb-4">
          All Brands
        </h1>
        <p className="text-text-secondary max-w-xl">
          Explore detailed history, specs, recalls, and pricing for every car
          and motorcycle brand in our database.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {[
            { icon: Car, label: "Car Brands", count: cars.length },
            { icon: Bike, label: "Bike Brands", count: bikes.length },
            { icon: Layers, label: "Total Models", count: brands.reduce((t, b) => t + b.models.length, 0) },
          ].map(({ icon: Icon, label, count }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-4 py-2.5">
              <Icon className="h-4 w-4 text-orange-500" />
              <span className="font-mono text-xs text-text-muted tracking-wider uppercase">{label}:</span>
              <span className="font-semibold text-text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <Car className="h-5 w-5 text-orange-500" />
          <h2 className="font-display text-2xl tracking-widest text-text-primary uppercase">Car Brands</h2>
          <div className="flex-1 h-[1px] bg-border ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <Bike className="h-5 w-5 text-orange-500" />
          <h2 className="font-display text-2xl tracking-widest text-text-primary uppercase">Motorcycle Brands</h2>
          <div className="flex-1 h-[1px] bg-border ml-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bikes.map((brand) => (
            <BrandCard key={brand.slug} brand={brand} />
          ))}
        </div>
      </section>
    </div>
  );
}