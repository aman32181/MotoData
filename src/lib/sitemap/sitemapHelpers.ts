import { getAllYearParams, BRANDS } from "../../lib/data/dataset";

/* ================================================================
   sitemapHelpers.ts
   ─────────────────────────────────────────────────────────────────
   Centralised logic for generating all sitemap URLs.

   SCALE STRATEGY FOR 1,000,000 PAGES:
   - Google's hard limit is 50,000 URLs per sitemap file.
   - We chunk all URLs into groups of CHUNK_SIZE.
   - /sitemap.xml           → sitemap index listing all chunk URLs
   - /sitemaps/[chunk].xml  → each chunk with up to CHUNK_SIZE URLs
   ================================================================ */

export const CHUNK_SIZE = 5_000; // conservative — well under Google's 50k limit
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://carbike-history.com";

/* ── All static/brand-level URLs ── */
export function getStaticUrls() {
    const now = new Date().toISOString();

    const staticPages = [
        { url: `${SITE_URL}`, priority: 1.0, changeFrequency: "weekly" as const },
        { url: `${SITE_URL}/brands`, priority: 0.9, changeFrequency: "daily" as const },
    ];

    const brandPages = BRANDS.map((b) => ({
        url: `${SITE_URL}/brands/${b.slug}`,
        priority: 0.8,
        changeFrequency: "weekly" as const,
        lastModified: now,
    }));

    const modelPages = BRANDS.flatMap((b) =>
        b.models.map((m) => ({
            url: `${SITE_URL}/brands/${b.slug}/models/${m.slug}`,
            priority: 0.7,
            changeFrequency: "weekly" as const,
            lastModified: now,
        }))
    );

    return [...staticPages, ...brandPages, ...modelPages];
}

/* ── All year-level URLs (the bulk — scales to 1M) ── */
export function getYearUrls() {
    const now = new Date().toISOString();

    return getAllYearParams().map(({ brandSlug, modelSlug, year }) => ({
        url: `${SITE_URL}/brands/${brandSlug}/models/${modelSlug}/years/${year}`,
        priority: 0.6,
        changeFrequency: "monthly" as const,
        lastModified: now,
    }));
}

/* ── All URLs combined ── */
export function getAllSitemapUrls() {
    return [...getStaticUrls(), ...getYearUrls()];
}

/* ── Chunk calculator ── */
export function getSitemapChunks() {
    const all = getAllSitemapUrls();
    const totalChunks = Math.ceil(all.length / CHUNK_SIZE);

    return {
        totalChunks,
        totalUrls: all.length,
        getChunk: (chunkIndex: number) =>
            all.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE),
        chunkIds: Array.from({ length: totalChunks }, (_, i) => i),
    };
}

/* ── XML builders ── */
export function buildSitemapIndexXml(chunkCount: number): string {
    const lastmod = new Date().toISOString();

    const sitemaps = Array.from({ length: chunkCount }, (_, i) =>
        `  <sitemap>
    <loc>${SITE_URL}/sitemaps/${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    ).join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

export function buildSitemapChunkXml(
    urls: ReturnType<typeof getAllSitemapUrls>
): string {
    const entries = urls
        .map(
            (entry) =>
                `  <url>
    <loc>${entry.url}</loc>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`
        )
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}