import { SectionHeader, StarRating, Badge } from "../../components/ui";
import type { ApiFetchResult, ReviewsSummary } from "../../lib/type";

export function ReviewsSection({
  result,
}: {
  result: ApiFetchResult<ReviewsSummary>;
}) {
  const data = result.data;

  return (
    <div>
      <SectionHeader
        title="Owner Reviews"
        subtitle="Real owner ratings and experiences"
        badge={data ? `${data.totalReviews} Reviews` : "Reviews"}
      />
      {result.status !== "ok" && (
        <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 font-mono text-xs text-yellow-400">
          ⚠ Review data unavailable ({result.status})
        </div>
      )}

      {data && data.totalReviews > 0 ? (
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-xl border border-border bg-surface-2 p-5">
            {/* Average */}
            <div className="text-center sm:border-r sm:border-border sm:pr-6">
              <p className="font-display text-5xl tracking-widest text-orange-400">
                {data.averageRating.toFixed(1)}
              </p>
              <StarRating rating={data.averageRating} />
              <p className="mt-1 font-mono text-xs text-text-muted">
                {data.totalReviews.toLocaleString()} reviews
              </p>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-1.5 w-full">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = data.distribution[star];
                const pct = data.totalReviews > 0
                  ? Math.round((count / data.reviews.length) * 100)
                  : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-muted w-4">{star}</span>
                    <div className="flex-1 h-2 rounded-full bg-surface-4 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500/70"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-muted w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-surface-2 p-5 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">
                        {review.title}
                      </span>
                      {review.verified && (
                        <Badge variant="green">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="font-mono text-xs text-text-muted">
                        {review.author} · {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <p className="text-sm text-text-secondary leading-relaxed">
                  {review.body}
                </p>

                {/* Pros / Cons */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-surface-3 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-green-400 mb-2">
                      Pros
                    </p>
                    <ul className="space-y-1">
  {review.pros.map((pro, i) => (
    <li
      key={`${pro}-${i}`}
      className="flex items-center gap-2 text-xs text-text-secondary"
    >
      <span className="text-green-400">+</span> {pro}
    </li>
  ))}
</ul>
                  </div>
                  <div className="rounded-lg bg-surface-3 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-red-400 mb-2">
                      Cons
                    </p>
                    <ul className="space-y-1">
                      {review.cons.map((con) => (
                        <li key={con} className="flex items-center gap-2 text-xs text-text-secondary">
                          <span className="text-red-400">−</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-muted">No reviews available.</p>
      )}
    </div>
  );
}