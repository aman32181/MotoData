import { SectionHeader, Badge } from "../../components/ui";
import type { ApiFetchResult, VehicleTrim } from "../../lib/type";

function formatCurrency(val: number | undefined) {
  if (!val) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
}

export function TrimsSection({
  result,
}: {
  result: ApiFetchResult<VehicleTrim[]>;
}) {
  const trims = result.data ?? [];

  return (
    <div>
      <SectionHeader
        title="Available Trims"
        subtitle="Trim levels and MSRP pricing"
        badge="CarAPI"
      />
      {result.status !== "ok" && (
        <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 font-mono text-xs text-yellow-400">
          ⚠ Trim data unavailable ({result.status}) — showing fallback
        </div>
      )}
      {trims.length === 0 ? (
        <p className="text-sm text-text-muted">No trim data available.</p>
      ) : (
        <div className="space-y-3">
          {trims.map((trim, i) => (
            <div
              key={trim.id || i}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-5 py-4 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-3 font-mono text-xs text-text-muted">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-text-primary">{trim.trim}</p>
                  {trim.description && (
                    <p className="text-xs text-text-secondary mt-0.5">
                      {trim.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                {trim.msrp && (
                  <div>
                    <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
                      MSRP
                    </p>
                    <p className="font-semibold text-text-primary">
                      {formatCurrency(trim.msrp)}
                    </p>
                  </div>
                )}
                {trim.invoice && (
                  <div className="hidden sm:block">
                    <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
                      Invoice
                    </p>
                    <p className="font-semibold text-text-primary">
                      {formatCurrency(trim.invoice)}
                    </p>
                  </div>
                )}
                <Badge variant="gray">Trim {i + 1}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}