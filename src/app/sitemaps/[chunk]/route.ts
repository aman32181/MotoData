import { NextResponse } from "next/server";
import {
  getSitemapChunks,
  buildSitemapChunkXml,
} from "../../../lib/sitemap/sitemapHelpers";

/* ================================================================
   /sitemaps/[chunk].xml — Chunked Sitemap Route Handler
   ─────────────────────────────────────────────────────────────────
   Each chunk contains up to CHUNK_SIZE URLs (default: 5,000).
   Google's hard limit per sitemap file is 50,000 URLs.

   URL pattern:
     /sitemaps/0.xml   → first 5,000 URLs
     /sitemaps/1.xml   → next 5,000 URLs
     /sitemaps/N.xml   → …

   SCALE NOTE:
   For 1M pages, you'd generate chunk IDs dynamically from a DB:
     SELECT COUNT(*) FROM pages → totalPages
     chunkCount = Math.ceil(totalPages / 5000)
   ================================================================ */

type Params = { params: Promise<{ chunk: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { chunk: chunkParam } = await params;

  // Strip .xml suffix if present: "0.xml" → "0"
  const chunkIndex = parseInt(chunkParam.replace(/\.xml$/, ""), 10);

  if (isNaN(chunkIndex) || chunkIndex < 0) {
    return new NextResponse("Invalid sitemap chunk", { status: 400 });
  }

  const { totalChunks, getChunk } = getSitemapChunks();

  if (chunkIndex >= totalChunks) {
    return new NextResponse("Sitemap chunk not found", { status: 404 });
  }

  const urls = getChunk(chunkIndex);
  const xml = buildSitemapChunkXml(urls);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cache chunks longer — content changes less frequently
      "Cache-Control": "public, max-age=7200, stale-while-revalidate=86400",
      "X-Chunk-Index": String(chunkIndex),
      "X-Chunk-Url-Count": String(urls.length),
      "X-Total-Chunks": String(totalChunks),
    },
  });
}