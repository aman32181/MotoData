import Link from "next/link";
import { ChevronRight, Car, Bike } from "lucide-react";
import { Badge } from "../../components/ui";
import type { Brand } from "../../lib/type";
import { clsx } from "clsx";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-surface-2 p-5 transition-all duration-200 hover:border-orange-500/40 hover:bg-surface-3 hover:shadow-lg hover:shadow-orange-500/5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-lg text-orange-500",
            "bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors"
          )}
        >
          {brand.type === "bike" ? (
            <Bike className="h-5 w-5" />
          ) : (
            <Car className="h-5 w-5" />
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-text-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </div>

      {/* Brand name */}
      <h3 className="font-display text-xl tracking-widest text-text-primary uppercase mb-1">
        {brand.name}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] text-text-muted tracking-wider">
          {brand.country}
        </span>
        <span className="text-border">·</span>
        <span className="font-mono text-[10px] text-text-muted tracking-wider">
          Est. {brand.founded}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
        {brand.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Badge variant={brand.type === "bike" ? "blue" : brand.type === "both" ? "orange" : "gray"}>
          {brand.type === "both" ? "Cars & Bikes" : brand.type === "bike" ? "Motorcycles" : "Cars"}
        </Badge>
        <span className="font-mono text-[10px] text-text-muted">
          {brand.models.length} models
        </span>
      </div>
    </Link>
  );
}