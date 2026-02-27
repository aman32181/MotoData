import { NextResponse } from "next/server";
import {
  getSitemapChunks,
  buildSitemapIndexXml,
} from "../../lib/sitemap/sitemapHelpers";

/* ================================================================
   /sitemap.xml — Route Handler
   ─────────────────────────────────────────────────────────────────
   Returns a sitemap INDEX that points to all chunked sitemaps.

   This is the URL you submit to Google Search Console.
   Google will then crawl each chunk automatically.

   SCALE NOTE:
   For 1,000,000 pages with CHUNK_SIZE=5000:
     → 200 chunk sitemaps (/sitemaps/0.xml … /sitemaps/199.xml)
     → This index lists all 200

   In production, the chunk count comes from your DB count query.
   ================================================================ */
export async function GET() {
  const { totalChunks, totalUrls } = getSitemapChunks();
  const xml = buildSitemapIndexXml(totalChunks);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache for 1 hour at the CDN edge, stale-while-revalidate for 24h
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Sitemap-Total-Urls": String(totalUrls),
      "X-Sitemap-Chunks": String(totalChunks),
    },
  });
}