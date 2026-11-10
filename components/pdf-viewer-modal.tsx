"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string | null;
  title?: string;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title = "Technical Data Sheet (TDS)",
}: PdfViewerModalProps) {
  if (!pdfUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[90vh] max-h-[92vh] w-[95vw] !max-w-6xl flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue/10 text-blue">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-base font-bold text-navy">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Technical Data Sheet (TDS) & Specification Document
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-10">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-navy shadow-xs transition-colors hover:border-blue hover:text-blue"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
            <a
              href={pdfUrl}
              download
              title="Download PDF"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-semibold text-navy shadow-xs transition-colors hover:border-blue hover:text-blue"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </DialogHeader>

        <div className="relative flex flex-1 flex-col overflow-hidden bg-slate-100 p-3 sm:p-5">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            className="h-full w-full flex-1 rounded-xl border border-slate-200 bg-white shadow-sm"
            title={title}
          />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Having trouble viewing the PDF inline?{" "}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue hover:underline"
            >
              Click here to view or download directly
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
