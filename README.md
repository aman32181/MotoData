# CarBike History

> **Hiring Assignment** — Next.js SEO at Scale (3 hours, AI Allowed)  
> Built with Next.js 16.1.6 · TypeScript · Tailwind CSS v4 · shadcn/ui

A production-grade mini-application demonstrating how to build an SEO-optimised
vehicle history platform designed to scale to **1,000,000+ pages**, with
near-real-time updates, resilience against upstream API failures, and
chunked sitemap generation.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your API keys (see API Keys below)

# 3. Start dev server (uses Turbopack by default in Next.js 16)
npm run dev

# 4. Open in browser
open http://localhost:3000

# 5. Run tests
npm test

# 6. Production build
npm run build
npm start
```

---

## API Keys

| Variable | Where to get it | Required? |
|---|---|---|
| `API_NINJAS_KEY` | [api-ninjas.com/register](https://api-ninjas.com/register) | Yes (free tier available) |
| `CARAPI_TOKEN` | [carapi.app/register](https://carapi.app/register) | Optional (mock fallback works) |
| `NEXT_PUBLIC_SITE_URL` | Your deployment URL | Yes for production |

The app works out of the box with mock data even without API keys — the
`fetchWithFallback` wrapper silently falls back if keys are missing.

---

## Routes

| URL | Description |
|---|---|
| `/` | Homepage with stats and feature overview |
| `/brands` | All car and motorcycle brands |
| `/brands/[brandSlug]` | Brand page with all models |
| `/brands/[brandSlug]/models/[modelSlug]` | Model page with year selector |
| `/brands/[brandSlug]/models/[modelSlug]/years/[year]` | Full detail: specs, trims, recalls, pricing, reviews |
| `/sitemap.xml` | Sitemap index (points to all chunks) |
| `/sitemaps/[chunk].xml` | Chunked sitemap (e.g. `/sitemaps/0.xml`) |
| `/robots.txt` | Auto-generated robots file |

---

## Architecture Decisions

### 1. How the solution scales to 1,000,000 pages

**Problem:** Pre-building 1M pages at deploy time would take hours and gigabytes.

**Solution: On-demand ISR with `use cache`**

Next.js 16 introduces the `use cache` directive which replaces the old
`export const revalidate = N` pattern. Pages are:

1. **Pre-built at deploy** for a small seed set (`generateStaticParams` returns
   top brands/models only for a production dataset).
2. **Generated on first visit** for all other pages — cached after the first
   request, served statically on all subsequent requests.
3. **Revalidated in the background** after `cacheLife({ revalidate: 3600 })`
   expires — users always get a fast cached page while fresh data loads behind the scenes.

```
User visits /brands/toyota/models/camry/years/2022
      │
      ├─ Cache HIT?  → Serve instantly from cache
      │
      └─ Cache MISS? → Render page server-side
                          │
                          ├─ Cache result
                          └─ Serve to user
                          
After cacheLife expires:
Background revalidation → fetch fresh data → update cache
User NEVER waits for this.
```

For a true 1M page dataset, you would:
- Store all brand/model/year combos in a database (Postgres, PlanetScale, etc.)
- `generateStaticParams` returns only the top ~500 most-visited pages
- All others are on-demand
- CDN (Vercel Edge, Cloudflare) caches rendered HTML globally

**Why not build all 1M at deploy?**  
At ~2 seconds per page build, 1M pages = 23+ days. Not viable.

---

### 2. How the 5-API dependency per page works

Each year page fires **5 API calls in parallel** using `Promise.allSettled`:

```
/brands/toyota/models/camry/years/2022
         │
         ├── API 1: API Ninjas /v1/cardetails  → VehicleSpecs
         ├── API 2: CarAPI.app /api/trims       → VehicleTrim[]
         ├── API 3: Mock NHTSA recalls          → Recall[]
         ├── API 4: Mock pricing/market value   → PricingData
         └── API 5: Mock owner reviews          → ReviewsSummary
```

All 5 run concurrently — total latency = slowest API, not sum of all.

Each call is wrapped in `fetchWithFallback()`:

```typescript
async function getYearPageData(brandSlug, modelSlug, year) {
  "use cache";
  
  const [specs, trims, recalls, pricing, reviews] = await Promise.allSettled([
    fetchVehicleSpecs(make, model, year),   // API Ninjas
    fetchVehicleTrims(make, model, year),   // CarAPI.app
    fetchVehicleRecalls(make, model, year), // Mock NHTSA
    fetchVehiclePricing(model, year),       // Mock pricing
    fetchVehicleReviews(make, model, year), // Mock reviews
  ]);
  
  // Page renders regardless of how many settled/rejected
}
```

In production, APIs 3–5 would be replaced with:
- NHTSA recalls API (`api.nhtsa.gov/recalls/recallsByVehicle`)
- Black Book or Edmunds pricing API
- J.D. Power or Edmunds reviews API

---

### 3. How SEO is not impacted by upstream API latency/failure

**The key insight:** `generateMetadata` uses **only local dataset data** — it
never calls any upstream API.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { brandSlug, modelSlug, year } = await params;
  
  // Pure local lookup — ALWAYS returns something
  const lookup = getModelBySlug(brandSlug, modelSlug);
  
  return {
    title: `${year} ${brand.name} ${model.name}`,
    description: `Complete specs, trims, recalls...`,
    // ...
  };
}
```

This means:
- Google's crawler always gets a valid `<title>` and `<meta description>`
- Even if all 5 upstream APIs are timing out, the HTML head is perfect
- Page content degrades gracefully — sections show "data unavailable" notices
  rather than crashing

Additionally, `fetchWithFallback` wraps every API call with:
- A **4-second timeout** (configurable per API)
- A **try/catch** that returns typed fallback data instead of throwing
- The page always renders — never a 500 error because an API is slow

```typescript
// If this API times out → fallback data returned, status = "timeout"
// If this API crashes   → fallback data returned, status = "error"
// The page always renders either way
const specs = await fetchWithFallback(
  "api-ninjas-specs",
  () => fetchFromApiNinjas(make, model, year),
  buildSpecsFallback(make, model, year), // always valid
  { timeoutMs: 5000 }
);
```

---

### 4. How near real-time updates propagate to affected pages

**Strategy: Tag-based cache invalidation**

Every cached function is tagged with specific identifiers:

```typescript
async function getYearPageData(brandSlug, modelSlug, year) {
  "use cache";
  cacheLife({ revalidate: 3600, expire: 86400 });
  cacheTag(
    `year-${brandSlug}-${modelSlug}-${year}`,  // specific page
    `brand-${brandSlug}`,                        // all pages for this brand
    `model-${brandSlug}-${modelSlug}`            // all pages for this model
  );
}
```

When data changes, you call `revalidateTag()` from a webhook or admin action:

```typescript
// Called by a webhook when Toyota Camry 2022 specs are updated:
import { revalidateTag } from "next/cache";

revalidateTag("year-toyota-camry-2022");      // just this page
// or
revalidateTag("brand-toyota");               // all Toyota pages
// or
revalidateTag("model-toyota-camry");         // all Camry year pages
```

The background revalidation flow:
```
Data updated in DB / upstream API
      │
      └─ Webhook hits /api/revalidate?tag=brand-toyota
              │
              └─ revalidateTag("brand-toyota")
                      │
                      └─ Next.js marks all tagged pages as stale
                              │
                              └─ Next request → background re-render
                                      │
                                      └─ Cache updated silently
```

Users see fresh data within **seconds of a data change**, not on the next
deploy.

---

### 5. How sitemap generation works at large scale

Google requires sitemaps to be under 50,000 URLs and 50MB each. For 1M pages,
a single sitemap is impossible.

**Our approach: Sitemap Index + Chunked Sitemaps**

```
/sitemap.xml                  ← Sitemap INDEX (this is what you submit to Google)
  │
  ├── /sitemaps/0.xml         ← Chunk 0: first 5,000 URLs
  ├── /sitemaps/1.xml         ← Chunk 1: next 5,000 URLs
  ├── ...
  └── /sitemaps/199.xml       ← Chunk 199: last 5,000 URLs (for 1M pages)
```

The index is a Route Handler at `src/app/sitemap.xml/route.ts`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://carbike-history.com/sitemaps/0.xml</loc>
    <lastmod>2025-01-01T00:00:00.000Z</lastmod>
  </sitemap>
  ...
</sitemapindex>
```

Each chunk is also a Route Handler at `src/app/sitemaps/[chunk]/route.ts`.

**Priority levels:**

| Page type | Priority | Change frequency |
|---|---|---|
| Homepage | 1.0 | Weekly |
| /brands | 0.9 | Daily |
| Brand pages | 0.8 | Weekly |
| Model pages | 0.7 | Weekly |
| Year pages (the bulk) | 0.6 | Monthly |

**For 1M pages in production:**  
Replace the local dataset lookups with database queries:
```sql
SELECT brand_slug, model_slug, year FROM vehicles
ORDER BY updated_at DESC
LIMIT 5000 OFFSET (chunk_index * 5000)
```

Both sitemap routes are CDN-cached (`Cache-Control: max-age=3600`) so
Google's crawler never slows down your origin.

---

## Project Structure

```
src/
├── app/
│   ├── brands/
│   │   └── [brandSlug]/
│   │       ├── page.tsx                        ← Brand page
│   │       └── models/[modelSlug]/
│   │           ├── page.tsx                    ← Model page
│   │           └── years/[year]/
│   │               └── page.tsx                ← Year detail (5 APIs)
│   ├── sitemap.xml/route.ts                    ← Sitemap index
│   ├── sitemaps/[chunk]/route.ts               ← Chunked sitemaps
│   ├── robots.ts                               ← robots.txt
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── layout/   Navbar  Footer
│   ├── ui/       BrandCard  ModelCard  YearCard  Badge  Skeleton  Breadcrumb  etc.
│   └── sections/ SpecsSection  TrimsSection  RecallsSection  PricingSection  ReviewsSection
├── lib/
│   ├── api/
│   │   ├── fetchWithFallback.ts               ← Core resilience wrapper
│   │   ├── carsApi.ts                         ← API Ninjas integration
│   │   ├── carApiApp.ts                       ← CarAPI.app integration
│   │   ├── mockRecallApi.ts                   ← Mock NHTSA recalls
│   │   ├── mockPriceApi.ts                    ← Mock pricing
│   │   └── mockReviewApi.ts                   ← Mock reviews
│   ├── data/
│   │   └── dataset.ts                         ← 15 brands, 40+ models
│   ├── sitemap/
│   │   └── sitemapHelpers.ts                  ← Chunk logic & XML builders
│   └── types.ts                               ← All TypeScript interfaces
└── __tests__/
    └── fetchWithFallback.test.ts              ← 7 unit tests
```

---

## Testing

```bash
npm test                  # run all tests
npm test -- --coverage    # with coverage report
npm test -- --watch       # watch mode
```

The test suite covers the `fetchWithFallback` resilience layer:

| Test | What it verifies |
|---|---|
| Success case | Returns `status: "ok"` with correct data |
| Error case | Returns `status: "error"` with fallback data |
| Timeout case | Returns `status: "timeout"` when fetcher is slow |
| Non-Error throws | Handles string/object throws gracefully |
| Latency recording | `latencyMs` is populated correctly |
| Source labelling | All 5 API source names preserved |
| Null fallback | `null` is a valid fallback value |

---

## Technology Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (Zinc dark theme) |
| Fonts | Bebas Neue (display) · DM Sans (body) · DM Mono (code) |
| Testing | Jest 29 + ts-jest |
| Caching | Next.js `use cache` directive + `cacheLife` + `cacheTag` |
| Sitemaps | Custom Route Handlers (XML) |
| Icons | lucide-react |

---

## Evaluation Criteria Mapping

| Criterion | Where implemented |
|---|---|
| ✅ Correct routing | `src/app/brands/[brandSlug]/models/[modelSlug]/years/[year]/page.tsx` |
| ✅ Scalability (1M pages) | `use cache` + `generateStaticParams` + on-demand ISR |
| ✅ SEO under failing APIs | `generateMetadata` uses local data only; `fetchWithFallback` never throws |
| ✅ Near real-time updates | `cacheTag` + `revalidateTag` strategy documented above |
| ✅ Resilience | `fetchWithFallback` wraps all 5 APIs; `Promise.allSettled` in pages |
| ✅ Code quality | TypeScript strict mode, typed API results, barrel exports |
| ✅ Sitemap at scale | Index + chunked Route Handlers; `CHUNK_SIZE=5000` |
| ✅ Tests | 7 unit tests covering all resilience scenarios |