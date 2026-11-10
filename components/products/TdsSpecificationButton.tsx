"use client";

import { useState } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import { PdfViewerModal } from "@/components/pdf-viewer-modal";

interface TdsSpecificationButtonProps {
  tdsUrl: string;
  productName: string;
}

export function TdsSpecificationButton({
  tdsUrl,
  productName,
}: TdsSpecificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open technical data sheet for ${productName}`}
        className="group flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition-colors hover:border-blue cursor-pointer"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue text-white">
          <FileText size={18} aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold text-navy">
            Technical data sheet
          </span>
          <span className="block text-[12px] text-ink/60">
            View TDS document
          </span>
        </span>

        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-ink/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue"
        />
      </button>

      <PdfViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={tdsUrl}
        title={`Technical Data Sheet - ${productName}`}
      />
    </>
  );
}
