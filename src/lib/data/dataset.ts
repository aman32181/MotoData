import type { Brand } from "../../lib/type";

/* ================================================================
   dataset.ts — Seed data for 15 brands
   In production, this would be fetched from a DB / CMS.
   The structure here maps 1:1 to URL slugs:
     /brands/[brandSlug]/models/[modelSlug]/years/[year]
   ================================================================ */

export const BRANDS: Brand[] = [
  {
    slug: "toyota",
    name: "Toyota",
    type: "car",
    country: "Japan",
    founded: 1937,
    description:
      "Toyota Motor Corporation is a Japanese multinational automotive manufacturer known for reliability and innovation.",
    models: [
      { slug: "camry",   name: "Camry",   brandSlug: "toyota", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "corolla", name: "Corolla", brandSlug: "toyota", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "rav4",    name: "RAV4",    brandSlug: "toyota", type: "suv",   years: [2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "honda",
    name: "Honda",
    type: "both",
    country: "Japan",
    founded: 1948,
    description:
      "Honda Motor Co. produces automobiles, motorcycles, and power equipment and is renowned for fuel efficiency.",
    models: [
      { slug: "civic",  name: "Civic",  brandSlug: "honda", type: "sedan",  years: [2010,2011,2012,2013,2014,2015] },
      { slug: "accord", name: "Accord", brandSlug: "honda", type: "sedan",  years: [2010,2011,2012,2013,2014,2015] },
      { slug: "cr-v",   name: "CR-V",   brandSlug: "honda", type: "suv",    years: [2019, 2020, 2021, 2022, 2023] },
      { slug: "cbr600", name: "CBR600", brandSlug: "honda", type: "motorcycle", years: [2019, 2020, 2021, 2022] },
    ],
  },
  {
    slug: "ford",
    name: "Ford",
    type: "car",
    country: "USA",
    founded: 1903,
    description:
      "Ford Motor Company is an American multinational automaker renowned for the Model T and F-Series trucks.",
    models: [
      { slug: "f-150",    name: "F-150",    brandSlug: "ford", type: "truck", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "mustang",  name: "Mustang",  brandSlug: "ford", type: "coupe", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "explorer", name: "Explorer", brandSlug: "ford", type: "suv",   years: [2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "bmw",
    name: "BMW",
    type: "both",
    country: "Germany",
    founded: 1916,
    description:
      "Bayerische Motoren Werke AG is a German luxury vehicle and motorcycle manufacturer.",
    models: [
      { slug: "3-series", name: "3 Series", brandSlug: "bmw", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "5-series", name: "5 Series", brandSlug: "bmw", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "x5",       name: "X5",       brandSlug: "bmw", type: "suv",   years: [2019, 2020, 2021, 2022, 2023] },
      { slug: "s1000rr",  name: "S1000RR",  brandSlug: "bmw", type: "motorcycle", years: [2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "mercedes-benz",
    name: "Mercedes-Benz",
    type: "car",
    country: "Germany",
    founded: 1926,
    description:
      "Mercedes-Benz is a global luxury automotive brand producing premium cars, vans, and trucks.",
    models: [
      { slug: "c-class", name: "C-Class", brandSlug: "mercedes-benz", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "e-class", name: "E-Class", brandSlug: "mercedes-benz", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "gle",     name: "GLE",     brandSlug: "mercedes-benz", type: "suv",   years: [2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "chevrolet",
    name: "Chevrolet",
    type: "car",
    country: "USA",
    founded: 1911,
    description:
      "Chevrolet is an American automobile division of General Motors known for iconic models like the Corvette.",
    models: [
      { slug: "silverado", name: "Silverado", brandSlug: "chevrolet", type: "truck", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "corvette",  name: "Corvette",  brandSlug: "chevrolet", type: "coupe", years: [2020, 2021, 2022, 2023] },
      { slug: "equinox",   name: "Equinox",   brandSlug: "chevrolet", type: "suv",   years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    type: "bike",
    country: "Japan",
    founded: 1955,
    description:
      "Yamaha Motor Company is a Japanese manufacturer of motorcycles, marine products, and other motorized vehicles.",
    models: [
      { slug: "r1",    name: "YZF-R1",  brandSlug: "yamaha", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "mt-09", name: "MT-09",   brandSlug: "yamaha", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "r6",    name: "YZF-R6",  brandSlug: "yamaha", type: "motorcycle", years: [2010,2011,2012,2013,2014] },
    ],
  },
  {
    slug: "kawasaki",
    name: "Kawasaki",
    type: "bike",
    country: "Japan",
    founded: 1896,
    description:
      "Kawasaki Heavy Industries produces motorcycles renowned for performance, including the iconic Ninja series.",
    models: [
      { slug: "ninja-zx10r", name: "Ninja ZX-10R", brandSlug: "kawasaki", type: "motorcycle", years: [2019, 2020, 2021, 2022, 2023] },
      { slug: "z900",        name: "Z900",          brandSlug: "kawasaki", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "ducati",
    name: "Ducati",
    type: "bike",
    country: "Italy",
    founded: 1926,
    description:
      "Ducati is an Italian motorcycle manufacturer known for high-performance bikes used in MotoGP racing.",
    models: [
      { slug: "panigale-v4",  name: "Panigale V4",  brandSlug: "ducati", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "monster-1200", name: "Monster 1200", brandSlug: "ducati", type: "motorcycle", years: [2010,2011,2012,2013,2014] },
    ],
  },
  {
    slug: "audi",
    name: "Audi",
    type: "car",
    country: "Germany",
    founded: 1909,
    description:
      "Audi AG is a German automotive manufacturer producing luxury vehicles under the Volkswagen Group umbrella.",
    models: [
      { slug: "a4", name: "A4", brandSlug: "audi", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "q5", name: "Q5", brandSlug: "audi", type: "suv",   years: [2010,2011,2012,2013,2014,2015] },
      { slug: "a6", name: "A6", brandSlug: "audi", type: "sedan", years: [2019, 2020, 2021, 2022, 2023] },
    ],
  },
  {
    slug: "tesla",
    name: "Tesla",
    type: "car",
    country: "USA",
    founded: 2003,
    description:
      "Tesla, Inc. is an American electric vehicle and clean energy company that changed the automotive industry.",
    models: [
      { slug: "model-3", name: "Model 3", brandSlug: "tesla", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "model-y", name: "Model Y", brandSlug: "tesla", type: "suv",   years: [2020, 2021, 2022, 2023] },
      { slug: "model-s", name: "Model S", brandSlug: "tesla", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "hyundai",
    name: "Hyundai",
    type: "car",
    country: "South Korea",
    founded: 1967,
    description:
      "Hyundai Motor Company is a South Korean multinational automotive manufacturer known for value and innovation.",
    models: [
      { slug: "elantra", name: "Elantra", brandSlug: "hyundai", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "tucson",  name: "Tucson",  brandSlug: "hyundai", type: "suv",   years: [2019, 2020, 2021, 2022, 2023] },
      { slug: "sonata",  name: "Sonata",  brandSlug: "hyundai", type: "sedan", years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "harley-davidson",
    name: "Harley-Davidson",
    type: "bike",
    country: "USA",
    founded: 1903,
    description:
      "Harley-Davidson is an iconic American motorcycle manufacturer known for heavyweight cruiser motorcycles.",
    models: [
      { slug: "sportster",     name: "Sportster",       brandSlug: "harley-davidson", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "street-glide",  name: "Street Glide",    brandSlug: "harley-davidson", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "suzuki",
    name: "Suzuki",
    type: "both",
    country: "Japan",
    founded: 1909,
    description:
      "Suzuki Motor Corporation produces automobiles, motorcycles, and marine engines for global markets.",
    models: [
      { slug: "gsx-r1000", name: "GSX-R1000", brandSlug: "suzuki", type: "motorcycle", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "swift",     name: "Swift",      brandSlug: "suzuki", type: "hatchback",  years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
  {
    slug: "porsche",
    name: "Porsche",
    type: "car",
    country: "Germany",
    founded: 1931,
    description:
      "Porsche AG is a German automotive manufacturer specialising in high-performance sports cars, SUVs, and sedans.",
    models: [
      { slug: "911",    name: "911",    brandSlug: "porsche", type: "coupe", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "cayenne", name: "Cayenne", brandSlug: "porsche", type: "suv", years: [2010,2011,2012,2013,2014,2015] },
      { slug: "macan",   name: "Macan",   brandSlug: "porsche", type: "suv", years: [2010,2011,2012,2013,2014,2015] },
    ],
  },
];

/* ── Lookup helpers ── */

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getModelBySlug(
  brandSlug: string,
  modelSlug: string
): { brand: Brand; model: (typeof BRANDS)[0]["models"][0] } | undefined {
  const brand = getBrandBySlug(brandSlug);
  if (!brand) return undefined;
  const model = brand.models.find((m) => m.slug === modelSlug);
  if (!model) return undefined;
  return { brand, model };
}

/** Total unique pages = sum of (models × years) across all brands */
export function getTotalPageCount(): number {
  return BRANDS.reduce((total, brand) => {
    return (
      total +
      brand.models.reduce((mTotal, model) => mTotal + model.years.length, 0)
    );
  }, 0);
}

/** All year-level slugs — used for generateStaticParams + sitemaps */
export function getAllYearParams() {
  return BRANDS.flatMap((brand) =>
    brand.models.flatMap((model) =>
      model.years.map((year) => ({
        brandSlug: brand.slug,
        modelSlug: model.slug,
        year: String(year),
      }))
    )
  );
}