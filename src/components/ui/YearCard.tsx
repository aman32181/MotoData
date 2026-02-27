import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui";
import type { Brand } from "../../lib/type";

type Model = Brand["models"][number];

export function YearCard({
  brand,
  model,
  year,
  isLatest,
}: {
  brand: Brand;
  model: Model;
  year: number;
  isLatest: boolean;
}) {
  return (
    <Link
      href={`/brands/${brand.slug}/models/${model.slug}/years/${year}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-surface-2 p-5 transition-all hover:border-orange-500/40 hover:bg-surface-3"
    >
      <div className="flex items-center gap-4">
        {/* Year display */}
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface-3 group-hover:border-orange-500/30 group-hover:bg-orange-500/5 transition-all">
          <span className="font-display text-xl tracking-wider text-text-primary">
            {year}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">
              {brand.name} {model.name} {year}
            </h3>
            {isLatest && <Badge variant="orange">Latest</Badge>}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Specs · Trims · Recalls · Pricing · Reviews
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-text-muted group-hover:text-orange-400 transition-colors">
        <span className="hidden sm:block font-mono text-xs tracking-wider">View details</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}