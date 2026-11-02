import Link from "next/link";
import { AlertCircle, SlidersHorizontal, X } from "lucide-react";
import type { Metadata } from "next";

import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/reveal";
import { Button } from "@/components/Button";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import CategorySidebar from "@/components/products/CategorySidebar";
import PriceFilter from "@/components/products/PriceFilter";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getAllCategories,
  getPublishedProducts,
} from "@/lib/api/products";
import { siteUrl } from "@/lib/site-url";

type SearchParams = Record<
  string,
  string | string[] | undefined
>;

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
};

const PAGE_SIZE = 12;
const PRICE_MAX = 10000;

const first = (
  value: string | string[] | undefined,
) => (Array.isArray(value) ? value[0] : value);

/* -------------------------------------------------------------------------- */
/* SEO METADATA                                                               */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;

  const page = Math.max(
    1,
    Number.parseInt(first(params.page) || "1", 10) || 1,
  );

  const isFirstPage = page === 1;

  const rawCategoryId = first(params.categoryId) || "";
  const hasCategory = /^[0-9a-fA-F]{24}$/.test(rawCategoryId);

  const rawMin = first(params.minPrice) || "";
  const rawMax = first(params.maxPrice) || "";
  const numberRegex = /^\d+(\.\d+)?$/;
  const hasPrice = numberRegex.test(rawMin) || numberRegex.test(rawMax);

  const hasFilters = hasCategory || hasPrice;

  const title = isFirstPage
    ? "Paints, Primers & Finishing Products in Bangladesh | Enviroshield"
    : `Paints, Primers & Finishing Products — Page ${page} | Enviroshield`;

  const description = isFirstPage
    ? "Explore Enviroshield's range of paints, primers, decorative finishes, surface preparation products, protective coatings, and wallcoverings in Bangladesh."
    : `Explore more of Enviroshield's paints, primers, decorative finishes, protective coatings, and wallcoverings on product catalogue page ${page}.`;

  const canonical = isFirstPage
    ? `${siteUrl}/products`
    : `${siteUrl}/products?page=${page}`;

  return {
    title,
    description,

    keywords: [
      "Enviroshield products",
      "paints and primers Bangladesh",
      "interior paint Bangladesh",
      "exterior paint Bangladesh",
      "decorative wall finishes",
      "surface preparation products",
      "protective coatings Bangladesh",
      "wallcoverings Bangladesh",
      "construction finishing materials",
      "painting products Bangladesh",
      "finishing products Bangladesh",
      "paint primers",
      "decorative coatings",
    ],

    alternates: {
      canonical,
    },

    robots: {
      index: !hasFilters,
      follow: true,
    },

    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: "/images/service-hero.jpg",
          width: 1200,
          height: 630,
          alt: "Enviroshield paints, primers, coatings and finishing products",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/service-hero.jpg"],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* TYPES AND HELPERS                                                          */
/* -------------------------------------------------------------------------- */

type State = {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  page: number;
};

function href(state: Partial<State>) {
  const qs = new URLSearchParams();

  if (state.categoryId) {
    qs.set("categoryId", state.categoryId);
  }

  if (state.minPrice) {
    qs.set("minPrice", state.minPrice);
  }

  if (state.maxPrice) {
    qs.set("maxPrice", state.maxPrice);
  }

  if (state.page && state.page > 1) {
    qs.set("page", String(state.page));
  }

  const query = qs.toString();

  return query ? `/products?${query}` : "/products";
}

function pageItems(
  page: number,
  totalPages: number,
): (number | "gap")[] {
  const set = new Set<number>([
    1,
    totalPages,
    page - 1,
    page,
    page + 1,
  ]);

  const list = [...set]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];

  list.forEach((value, index) => {
    if (
      index > 0 &&
      value - list[index - 1] > 1
    ) {
      items.push("gap");
    }

    items.push(value);
  });

  return items;
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const rawPage = Number(first(params.page) || "1");

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const rawCategoryId = first(params.categoryId) || "";

  const categoryId =
    /^[0-9a-fA-F]{24}$/.test(rawCategoryId)
      ? rawCategoryId
      : "";

  const rawMin = first(params.minPrice) || "";
  const rawMax = first(params.maxPrice) || "";

  const numberRegex = /^\d+(\.\d+)?$/;

  const minPrice = numberRegex.test(rawMin)
    ? Number(rawMin)
    : undefined;

  const maxPrice = numberRegex.test(rawMax)
    ? Number(rawMax)
    : undefined;

  const state: State = {
    categoryId,
    minPrice: minPrice !== undefined ? rawMin : "",
    maxPrice: maxPrice !== undefined ? rawMax : "",
    page,
  };

  const [
    productsResult,
    categoriesResult,
  ] = await Promise.allSettled([
    getPublishedProducts({
      page,
      limit: PAGE_SIZE,
      search: "",
      categoryId,
      minPrice,
      maxPrice,
    }),
    getAllCategories(),
  ]);

  const productResponse =
    productsResult.status === "fulfilled"
      ? productsResult.value
      : null;

  const categories =
    categoriesResult.status === "fulfilled"
      ? categoriesResult.value
      : [];

  const selectedCategory = categories.find(
    (c) => c._id === categoryId,
  );

  const createCategoryHref = (id: string) =>
    href({
      ...state,
      categoryId: id,
      page: 1,
    });

  const error =
    productsResult.status === "rejected"
      ? "Products could not be loaded right now. Please try again later."
      : null;

  const hasPrice =
    minPrice !== undefined || maxPrice !== undefined;

  const hasFilters = Boolean(categoryId) || hasPrice;

  return (
    <>
      <PageHero
        eyebrow="PRODUCTS"
        title="Finishes and materials you can trust."
        text="A curated range of paints, primers, coatings and wallcoverings — chosen for performance, feel, and longevity."
        image="/images/service-hero.jpg"
      />

      <section
        aria-label="Product catalogue"
        className="py-16 max-[600px]:py-10"
      >
        <Container>
          <div className="grid grid-cols-[280px_1fr] items-start gap-12 max-[1000px]:grid-cols-1 max-[1000px]:gap-8">
            {/* PRODUCT FILTERS: CATEGORIES FIRST, THEN PRICE */}

            <aside
              aria-label="Product filters"
              className="flex flex-col gap-6"
            >
              <CategorySidebar
                categories={categories}
                activeCategoryId={categoryId}
                minPrice={state.minPrice}
                maxPrice={state.maxPrice}
                hasError={categoriesResult.status === "rejected"}
              />

              <div className="overflow-hidden rounded-2xl border border-line/90 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,51,78,0.06)]">
                <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue/10 text-blue">
                      <SlidersHorizontal size={15} />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-navy">
                      Filter by price
                    </h3>
                  </div>
                </div>

                <PriceFilter
                  key={`${state.minPrice}-${state.maxPrice}`}
                  max={PRICE_MAX}
                  initialMin={minPrice}
                  initialMax={maxPrice}
                  hidden={categoryId ? { categoryId } : {}}
                  resetHref={href({ categoryId })}
                  isFiltered={hasPrice}
                />
              </div>
            </aside>

            {/* PRODUCT LISTING */}

            <div className="min-w-0">
              {/* Contextual Category Header & Active Filters Bar */}
              <div className="mb-8 flex flex-col gap-4 border-b border-line/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
                      {selectedCategory ? selectedCategory.name : "All Products"}
                    </h2>
                    <span className="inline-flex items-center rounded-full border border-line bg-mist/80 px-2.5 py-0.5 text-xs font-semibold text-ink/75">
                      {productResponse?.meta.total ?? 0}{" "}
                      {(productResponse?.meta.total ?? 0) === 1
                        ? "Product"
                        : "Products"}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-ink/70">
                    {selectedCategory
                      ? `Browsing our specialized range in ${selectedCategory.name}.`
                      : "Engineered coatings, primers, and protective materials for demanding conditions."}
                  </p>
                </div>

                {/* Active filter badges if any filter is active */}
                {hasFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategory && (
                      <Link
                        href={createCategoryHref("")}
                        scroll={false}
                        aria-label={`Remove filter: ${selectedCategory.name}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-blue/20 bg-blue/10 px-3 py-1 text-xs font-semibold text-blue transition hover:bg-blue hover:text-white"
                      >
                        <span>{selectedCategory.name}</span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    {hasPrice && (
                      <Link
                        href={href({
                          ...state,
                          minPrice: "",
                          maxPrice: "",
                          page: 1,
                        })}
                        scroll={false}
                        aria-label="Remove price filter"
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 text-xs font-semibold text-ink/80 transition hover:bg-line/60 hover:text-navy"
                      >
                        <span>
                          ৳{minPrice ?? 0} – ৳{maxPrice ?? PRICE_MAX}
                        </span>
                        <X size={12} className="stroke-[2.5]" />
                      </Link>
                    )}

                    <Link
                      href="/products"
                      scroll={false}
                      className="ml-1 text-xs font-bold text-navy underline underline-offset-4 hover:text-blue"
                    >
                      Clear all
                    </Link>
                  </div>
                )}
              </div>
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>
                    Something went wrong
                  </AlertTitle>

                  <AlertDescription>
                    {error}{" "}
                    <Link
                      href={href(state)}
                      className="font-medium underline underline-offset-4"
                    >
                      Try again
                    </Link>
                  </AlertDescription>
                </Alert>
              ) : productResponse?.data.length ? (
                <>
                  <StaggerContainer
                    className="grid grid-cols-3 gap-x-6 gap-y-10 max-[1200px]:grid-cols-2 max-[600px]:grid-cols-1"
                    id="product-grid"
                  >
                    {productResponse.data.map((product) => (
                      <StaggerItem
                        key={product._id}
                        data-category={product.categoryId.name}
                      >
                        <ProductCard product={product} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {productResponse.meta.totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        {productResponse.meta.page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              href={href({
                                ...state,
                                page:
                                  productResponse.meta.page - 1,
                              })}
                            />
                          </PaginationItem>
                        )}

                        {pageItems(
                          productResponse.meta.page,
                          productResponse.meta.totalPages,
                        ).map((item, index) =>
                          item === "gap" ? (
                            <PaginationItem key={`gap-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={item}>
                              <PaginationLink
                                href={href({
                                  ...state,
                                  page: item,
                                })}
                                isActive={
                                  item ===
                                  productResponse.meta.page
                                }
                                className={
                                  item ===
                                  productResponse.meta.page
                                    ? "border-blue text-blue"
                                    : ""
                                }
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          ),
                        )}

                        {productResponse.meta.page <
                          productResponse.meta.totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              href={href({
                                ...state,
                                page:
                                  productResponse.meta.page + 1,
                              })}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-line bg-white px-6 py-20 text-center">
                  <p className="text-base font-semibold text-navy">
                    No products found
                  </p>

                  <p className="mx-auto mt-2 max-w-[420px] text-sm text-ink/70">
                    {hasFilters
                      ? "Nothing matches your current filters. Try a different price range or category."
                      : "There are no published products yet. Please check back soon."}
                  </p>

                  {hasFilters && (
                    <Button
                      href="/products"
                      className="mt-6"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}