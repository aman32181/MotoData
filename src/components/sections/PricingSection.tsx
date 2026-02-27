import { SectionHeader, StatCard } from "../../components/ui";
import type { ApiFetchResult, PricingData } from "../../lib/type";
import { TrendingDown } from "lucide-react";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

export function PricingSection({
  result,
}: {
  result: ApiFetchResult<PricingData>;
}) {
  const pricing = result.data;

  return (
    <div>
      <SectionHeader
        title="Pricing & Market Value"
        subtitle="MSRP, market trends, and depreciation data"
        badge="Market Data"
      />
      {result.status !== "ok" && (
        <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 font-mono text-xs text-yellow-400">
          ⚠ Pricing data unavailable ({result.status})
        </div>
      )}

      {pricing && pricing.msrp > 0 ? (
        <div className="space-y-6">
          {/* Key stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Original MSRP" value={formatCurrency(pricing.msrp)} />
            <StatCard label="Avg Market Price" value={formatCurrency(pricing.averageMarketPrice)} />
            <StatCard label="Price Range Min" value={formatCurrency(pricing.priceRange.min)} />
            <StatCard label="Price Range Max" value={formatCurrency(pricing.priceRange.max)} />
          </div>

          {/* Depreciation */}
          <div className="rounded-xl border border-border bg-surface-2 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-4 w-4 text-orange-400" />
              <h3 className="font-semibold text-text-primary">Depreciation</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  1-Year Loss
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-surface-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${pricing.depreciation1Year}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-orange-400 w-10 text-right">
                    {pricing.depreciation1Year}%
                  </span>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-1">
                  3-Year Loss
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-surface-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${pricing.depreciation3Year}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-red-400 w-10 text-right">
                    {pricing.depreciation3Year}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price History Bar Chart */}
          {pricing.history.length > 0 && (
            <div className="rounded-xl border border-border bg-surface-2 p-5">
              <h3 className="font-semibold text-text-primary mb-4">
                Price History
              </h3>
              <div className="flex items-end gap-3 h-32">
                {pricing.history.map((entry) => {
                  const maxPrice = Math.max(...pricing.history.map((e) => e.avgPrice));
                  const heightPct = (entry.avgPrice / maxPrice) * 100;
                  return (
                    <div
                      key={entry.year}
                      className="flex flex-col items-center gap-1 flex-1"
                    >
                      <span className="font-mono text-[9px] text-text-muted">
                        {formatCurrency(entry.avgPrice)}
                      </span>
                      <div className="w-full rounded-t-sm bg-orange-500/30 hover:bg-orange-500/50 transition-colors relative overflow-hidden"
                        style={{ height: `${heightPct}%` }}
                      >
                        <div
                          className="absolute inset-x-0 bottom-0 rounded-t-sm bg-orange-500"
                          style={{ height: "3px" }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-text-muted">
                        {entry.year}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-muted">No pricing data available.</p>
      )}
    </div>
  );
}