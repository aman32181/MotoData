import { SectionHeader, Badge } from "../../components/ui";
import type { ApiFetchResult, Recall } from "../../lib/type";
import { AlertTriangle } from "lucide-react";

export function RecallsSection({
  result,
}: {
  result: ApiFetchResult<Recall[]>;
}) {
  const recalls = result.data ?? [];

  return (
    <div>
      <SectionHeader
        title="Recall History"
        subtitle="NHTSA safety recalls for this vehicle"
        badge={recalls.length > 0 ? `${recalls.length} Recalls` : "No Recalls"}
      />
      {result.status !== "ok" && (
        <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 font-mono text-xs text-yellow-400">
          ⚠ Recall data unavailable ({result.status})
        </div>
      )}
      {recalls.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <AlertTriangle className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-green-400">No recalls found</p>
            <p className="text-sm text-text-secondary">
              No safety recalls have been recorded for this vehicle.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recalls.map((recall) => (
            <div
              key={recall.id}
              className="rounded-xl border border-red-500/15 bg-surface-2 p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                  <span className="font-medium text-text-primary">
                    {recall.component}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="gray">{recall.date}</Badge>
                  <Badge variant="red">
                    {recall.affectedUnits.toLocaleString()} units
                  </Badge>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {recall.summary}
              </p>

              {/* Consequence + Remedy */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-3 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-red-400 mb-1">
                    Consequence
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {recall.consequence}
                  </p>
                </div>
                <div className="rounded-lg bg-surface-3 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-green-400 mb-1">
                    Remedy
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {recall.remedy}
                  </p>
                </div>
              </div>

              <p className="font-mono text-[10px] text-text-muted">
                ID: {recall.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}