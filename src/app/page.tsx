import Link from "next/link";
import { ChevronRight, Zap, Shield, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Grid background ── */}
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Badge */}


        <h1 className="font-display text-6xl sm:text-7xl lg:text-9xl tracking-widest text-text-primary leading-none mb-6">
          BUILD CAR
          <br />
          <span className="text-gradient">&amp; BIKE</span>
          <br />
          HISTORY
        </h1>

        <p className="max-w-xl text-text-secondary text-base sm:text-lg leading-relaxed mb-10">
          Comprehensive specs, recalls, pricing, and reviews for every vehicle —
          engineered for SEO scale with near real-time updates.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/brands"
            className="group flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95"
          >
            Explore All Brands
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {/* <Link
            href="/sitemap.xml"
            className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-orange-500/30 hover:text-text-primary"
          >
            View Sitemap
          </Link> */}
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-16">
          {[
            { label: "Brands", value: "1,000+" },
            { label: "Models", value: "50,000+" },
            { label: "Pages", value: "1M+" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl tracking-widest text-orange-400">
                {value}
              </div>
              <div className="mt-1 font-mono text-xs tracking-widest text-text-muted uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: "Near Real-Time",
              desc: "Pages revalidate in the background using Next.js 16 Cache Components.",
            },
            {
              icon: Shield,
              title: "SEO Resilient",
              desc: "Metadata and content gracefully degrade — API failures never break crawlability.",
            },
            {
              icon: BarChart3,
              title: "1M Page Ready",
              desc: "ISR + on-demand generation means you never pre-build pages you don't need.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface-2 p-6 hover:border-orange-500/30 transition-colors group"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <Icon className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}