"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Gauge, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { label: "Brands", href: "/brands" },
  { label: "Cars", href: "/brands?type=car" },
  { label: "Bikes", href: "/brands?type=bike" },
  // { label: "Sitemap", href: "/sitemap.xml" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface-0/90 backdrop-blur-md">
      {/* ── Top accent line ── */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-60" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500 shadow-lg shadow-orange-500/30">
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

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-md",
                  isActive
                    ? "text-orange-400 bg-orange-500/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/brands"
            className="group flex items-center gap-1.5 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-95"
          >
            Explore All
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface-1 px-4 py-3 animate-[fade-in_0.15s_ease]">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-text-secondary hover:bg-surface-3 hover:text-text-primary"
                  )}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-orange-500" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 pt-3 border-t border-border">
            <Link
              href="/brands"
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Explore All Brands
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}