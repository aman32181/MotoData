import Link from "next/link";
import { ChevronRight, Calendar } from "lucide-react";
import { Badge } from "../../components/ui";
import type { Brand } from "../../lib/type";

type Model = Brand["models"][number];

const TYPE_VARIANT: Record<string, "orange" | "blue" | "green" | "gray"> = {
  sedan: "gray",
  suv: "orange",
  truck: "orange",
  coupe: "orange",
  motorcycle: "blue",
  hatchback: "gray",
  van: "gray",
};

export function ModelCard({
  brand,
  model,
}: {
  brand: Brand;
  model: Model;
}) {
  const latestYear = Math.max(...model.years);
  const oldestYear = Math.min(...model.years);

  return (
    <Link
      href={`/brands/${brand.slug}/models/${model.slug}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-surface-2 p-5 transition-all hover:border-orange-500/40 hover:bg-surface-3"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-3 group-hover:bg-orange-500/10 transition-colors">
          <span className="font-display text-sm tracking-widest text-orange-500">
            {model.name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-text-primary group-hover:text-orange-300 transition-colors">
            {model.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-3 w-3 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted tracking-wider">
              {oldestYear} – {latestYear}
            </span>
            <span className="text-border">·</span>
            <span className="font-mono text-[10px] text-text-muted">
              {model.years.length} years
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={TYPE_VARIANT[model.type] ?? "gray"}>{model.type}</Badge>
        <ChevronRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
      </div>
    </Link>
  );
}