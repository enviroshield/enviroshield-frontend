"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PdfViewerModal } from "./pdf-viewer-modal";

interface PdfUploaderProps {
  value?: string;
  pdfPublicId?: string;
  onChange: (url: string, public_id: string, file?: File) => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export const PdfUploader = ({
  value,
  pdfPublicId: initialPublicId,
  onChange,
  onFileSelect,
  disabled = false,
}: PdfUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(value || null);
  const [pdfPublicId, setPdfPublicId] = useState<string>(initialPublicId || "");
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFileUrl(value || null);
    setPdfPublicId(initialPublicId || "");

    if (value) {
      try {
        const urlParts = value.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        setFileName(decodeURIComponent(lastPart) || "Technical-Data-Sheet.pdf");
      } catch {
        setFileName("Technical-Data-Sheet.pdf");
      }
    } else {
      setFileName("");
    }
  }, [value, initialPublicId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the user can select the same file again if needed
    e.target.value = "";

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Please upload a valid PDF document.");
      return;
    }

    // Maximum 20MB
    const MAX_SIZE_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("PDF file exceeds the 20MB limit.");
      return;
    }

    const previousPublicId = pdfPublicId;
    setFileName(file.name);
    onFileSelect?.(file);

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const data = await new Promise<{ url: string; public_id: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/upload");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              setProgress(Math.round((event.loaded * 100) / event.total));
            }
          };

          xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
              reject(new Error("PDF upload failed."));
              return;
            }

            try {
              const result = JSON.parse(xhr.responseText);
              if (!result.url || !result.public_id) {
                reject(
                  new Error("Upload response is missing PDF document information.")
                );
                return;
              }
              resolve(result);
            } catch {
              reject(new Error("Invalid response from the upload endpoint."));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during PDF upload."));
          xhr.onabort = () => reject(new Error("PDF upload was cancelled."));
          xhr.send(formData);
        }
      );

      // If replacing an existing PDF, delete the old PDF file from Cloudinary
      if (previousPublicId && previousPublicId !== data.public_id) {
        fetch("/api/delete-image", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: previousPublicId,
            resource_type: "raw",
          }),
        }).catch((err) => {
          console.error("Failed to delete old PDF on replace:", err);
        });
      }

      setPdfPublicId(data.public_id);
      setFileUrl(data.url);
      onChange(data.url, data.public_id, file);
      toast.success("Technical Data Sheet (PDF) uploaded successfully.");
    } catch (error) {
      setFileUrl(value || null);
      const message =
        error instanceof Error ? error.message : "Failed to upload PDF.";
      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const removePdf = async () => {
    if (uploading || deleting || disabled) return;

    if (!pdfPublicId) {
      setFileUrl(null);
      setFileName("");
      onChange("", "");
      return;
    }

    setDeleting(true);

    try {
      await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: pdfPublicId,
          resource_type: "raw",
        }),
      });

      setFileUrl(null);
      setPdfPublicId("");
      setFileName("");
      onChange("", "");
      toast.success("PDF document removed successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove PDF.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="flex w-full flex-col justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 transition-all hover:border-blue/40">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          disabled={disabled || uploading || deleting}
          onChange={handleFileChange}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue" />
            <div className="w-full max-w-xs space-y-1.5">
              <Progress value={progress} className="h-2 w-full" />
              <p className="text-xs font-semibold text-navy">
                Uploading to Cloudinary... {progress}%
              </p>
            </div>
          </div>
        ) : fileUrl ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy" title={fileName}>
                  {fileName || "Technical Data Sheet (TDS)"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-blue uppercase text-[10px] tracking-wider">
                    PDF Document
                  </span>
                  <span>·</span>
                  <span>Cloudinary Hosted</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsViewerOpen(true)}
                className="h-8 gap-1.5 rounded-lg text-xs font-semibold text-navy hover:text-blue"
              >
                <Eye className="h-3.5 w-3.5" />
                View PDF
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || deleting}
                className="h-8 gap-1.5 rounded-lg text-xs font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removePdf}
                disabled={disabled || deleting}
                className="h-8 rounded-lg text-xs font-semibold text-destructive hover:bg-red-50 hover:text-red-700"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !disabled && inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 py-6 text-center group"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue/5 text-blue transition-transform group-hover:scale-105">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy group-hover:text-blue transition-colors">
                Upload Technical Data Sheet (PDF)
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Click or drag & drop PDF document up to 20MB
              </p>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <AlertCircle className="h-3 w-3" />
              PDF will be securely uploaded and hosted on Cloudinary
            </div>
          </div>
        )}
      </Card>

      {fileUrl && (
        <PdfViewerModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfUrl={fileUrl}
          title={fileName || "Technical Data Sheet (TDS)"}
        />
      )}
    </>
  );
};
