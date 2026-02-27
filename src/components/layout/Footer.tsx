"use client"

import Link from "next/link";
import { Gauge, Github, Twitter, Globe } from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { label: "All Brands", href: "/brands" },
    { label: "Cars", href: "/brands?type=car" },
    { label: "Motorcycles", href: "/brands?type=bike" },
  ],
  Data: [
    { label: "API Status", href: "#" },
    { label: "Sitemap Index", href: "/sitemap.xml" },
    { label: "Data Sources", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Disclaimer", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface-0 mt-auto">
      {/* ── Top accent ── */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* ── Brand column ── */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/90 shadow-lg shadow-orange-500/20">
                <Gauge className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl tracking-widest text-text-primary">
                  CARBIKE
                </span>
                <span className="font-mono text-[9px] tracking-[0.25em] text-orange-500 uppercase">
                  History
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Comprehensive vehicle history, specs, recalls, and pricing data
              for every car and bike brand, model, and year — built to scale to
              1 million pages.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 pt-1">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Globe, href: "#", label: "Website" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2 text-text-muted transition-colors hover:border-orange-500/40 hover:text-orange-400"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-mono text-xs tracking-[0.2em] text-orange-500 uppercase">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © CarBike History. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Built with</span>
            <div className="flex items-center gap-1.5">
              {["Next.js 16", "shadcn/ui", "Tailwind CSS v4"].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] text-orange-400 border border-orange-500/20 bg-orange-500/5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}