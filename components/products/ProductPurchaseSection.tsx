"use client";

import { useState } from "react";
import type { IPublishedProduct, IProductVariant } from "@/types/product.type";
import AddToCart from "./AddToCart";
import { formatTaka } from "@/lib/utils";
import { Tag, Scale, Layers, CalendarDays, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/Button";
import { getTrustedTdsUrl } from "@/lib/products/tds";
import { PdfViewerModal } from "@/components/pdf-viewer-modal";

type Props = {
  product: IPublishedProduct;
  categoryName: string;
  publishedOn: string | null;
};

export default function ProductPurchaseSection({
  product,
  categoryName,
  publishedOn,
}: Props) {
  const variants =
    product.variants && product.variants.length > 0
      ? product.variants
      : [
          {
            _id: undefined,
            weight: (product.weight && product.weight > 0) ? `${product.weight} kg` : "Standard",
            size: (product.weight && product.weight > 0) ? `${product.weight} kg` : "Standard",
            price: product.price,
            stockQuantity: product.stockQuantity,
            lowStockThreshold: product.lowStockThreshold,
            sku: product.sku,
          },
        ];

  const [selectedVariant, setSelectedVariant] = useState<IProductVariant>(() => {
    const inStock = variants.find((v) => v.stockQuantity > 0);
    return inStock || variants[0];
  });
  const [isTdsModalOpen, setIsTdsModalOpen] = useState(false);

  const currentPrice = selectedVariant.price ?? product.price;
  const currentStock = Number.isFinite(selectedVariant.stockQuantity)
    ? Math.max(0, selectedVariant.stockQuantity)
    : 0;
  const currentThreshold = Number.isFinite(selectedVariant.lowStockThreshold)
    ? Math.max(
        0,
        selectedVariant.lowStockThreshold ?? product.lowStockThreshold ?? 5,
      )
    : 5;

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) {
      return {
        label: "Currently out of stock",
        dot: "bg-red-500",
        pill: "bg-red-50 text-red-700",
      };
    }

    if (quantity <= threshold) {
      return {
        label: `Low stock · only ${quantity} left`,
        dot: "bg-amber-500",
        pill: "bg-amber-50 text-amber-700",
      };
    }

    return {
      label: `In stock · ${quantity} available`,
      dot: "bg-emerald-500",
      pill: "bg-emerald-50 text-emerald-700",
    };
  };

  const stockStatus = getStockStatus(currentStock, currentThreshold);
  const activeSku = selectedVariant.sku || product.sku;

  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_10px_40px_rgba(0,51,78,0.07)] min-[901px]:sticky min-[901px]:top-28">
      {/* Price Header */}
      <div className="border-b border-line p-7 max-[600px]:p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue">
          Product information
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60">
              Price
            </p>

            <p className="mt-1 text-[36px] font-extrabold leading-none tracking-[-0.035em] text-navy">
              {currentPrice > 0
                ? formatTaka(currentPrice)
                : "Contact for pricing"}
            </p>
          </div>
        </div>

        {!currentPrice && (
          <p className="mt-2 text-[13px] text-ink/60">
            Contact our team for current pricing.
          </p>
        )}

        <span
          className={`mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-bold ${stockStatus.pill}`}
        >
          <span className={`size-2 rounded-full ${stockStatus.dot}`} />
          {stockStatus.label}
        </span>
      </div>

      <div className="p-7 max-[600px]:p-5">
        {/* Weight Variant Selection */}
        {variants.length > 1 ? (
          <div className="mb-6">
            <div className="mb-2.5 flex items-center justify-between">
              <label className="text-[13px] font-bold text-navy">
                Select Weight:
              </label>
              <span className="text-[12px] font-semibold text-blue">
                {selectedVariant.weight || selectedVariant.size}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {variants.map((v) => {
                const label = v.weight || v.size || "Standard";
                const isSelected =
                  (selectedVariant.weight || selectedVariant.size) === label;
                const isOut = v.stockQuantity <= 0;
                return (
                  <button
                    key={v._id || label}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`relative rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
                      isSelected
                        ? "border-blue bg-blue text-white shadow-[0_4px_12px_rgba(1,110,220,0.25)]"
                        : "border-line bg-white text-navy hover:border-blue/50 hover:bg-mist/50"
                    }`}
                  >
                    <span>{label}</span>
                    {isOut && (
                      <span className="ml-1.5 text-[10px] font-normal opacity-75">
                        (Out of stock)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : variants.length === 1 &&
          (variants[0].weight || variants[0].size) &&
          (variants[0].weight || variants[0].size) !== "Standard" ? (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-muted p-3">
            <span className="text-[12px] font-bold text-ink/70">Weight:</span>
            <span className="text-sm font-extrabold text-navy">
              {variants[0].weight || variants[0].size}
            </span>
          </div>
        ) : null}

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-4">
            <div className="mb-2 flex items-center gap-2 text-ink/60">
              <Tag size={16} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                SKU
              </span>
            </div>
            <p className="break-words text-[14px] font-bold text-navy">
              {activeSku || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="mb-2 flex items-center gap-2 text-ink/60">
              <Scale size={16} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                Weight
              </span>
            </div>
            <p className="break-words text-[14px] font-bold text-navy">
              {selectedVariant.weight ||
                selectedVariant.size ||
                ((product.weight && product.weight > 0) ? `${product.weight} kg` : "Not specified")}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="mb-2 flex items-center gap-2 text-ink/60">
              <Layers size={16} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                Category
              </span>
            </div>
            <p className="break-words text-[14px] font-bold text-navy">
              {categoryName}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <div className="mb-2 flex items-center gap-2 text-ink/60">
              <CalendarDays size={16} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
                Listed
              </span>
            </div>
            <p className="break-words text-[14px] font-bold text-navy">
              {publishedOn || "—"}
            </p>
          </div>
        </div>

        {/* Add To Cart */}
        <div className="mt-6 flex flex-col gap-3">
          {currentPrice > 0 ? (
            <AddToCart
              product={{
                _id: product._id,
                slug: product.slug,
                sku: activeSku,
                name: product.name,
                price: currentPrice,
                primaryImage: product.primaryImage,
              }}
              selectedVariant={selectedVariant}
              stock={currentStock}
            />
          ) : (
            <Button href="/contact" fullWidth>
              Ask about this product
            </Button>
          )}

          {(() => {
            const safeTdsUrl = getTrustedTdsUrl(product.tdsUrl);
            if (!safeTdsUrl) return null;
            return (
              <>
                <button
                  type="button"
                  onClick={() => setIsTdsModalOpen(true)}
                  aria-label={`Open technical data sheet for ${product.name}`}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-[13px] font-bold text-navy transition-colors hover:border-blue hover:text-blue cursor-pointer"
                >
                  <FileText size={17} aria-hidden="true" />
                  View Technical Data Sheet (TDS)
                  <ArrowUpRight size={15} aria-hidden="true" />
                </button>

                <PdfViewerModal
                  isOpen={isTdsModalOpen}
                  onClose={() => setIsTdsModalOpen(false)}
                  pdfUrl={safeTdsUrl}
                  title={`Technical Data Sheet - ${product.name}`}
                />
              </>
            );
          })()}
        </div>

        <p className="mt-5 text-center text-[12px] leading-6 text-ink/60">
          Questions about specifications, bulk orders or suitability?
          Our team is happy to help.
        </p>
      </div>
    </div>
  );
}
