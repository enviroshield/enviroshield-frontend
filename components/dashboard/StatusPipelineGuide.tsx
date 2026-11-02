"use client";

import {
  ArrowRight,
  Ban,
  Check,
  GitBranch,
  Info,
  Lock,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { getAllowedBookingStatusTransitions } from "@/types/booking.type";
import {
  getAllowedOrderStatusTransitions,
  getAllowedPaymentStatusTransitions,
} from "@/types/order.type";
import { getAllowedContactStatusTransitions } from "@/types/contact.type";

export type PipelineType = "booking" | "order" | "payment" | "contact";

type StepDefinition = {
  id: string;
  label: string;
};

type AlternativeBranch = {
  id: string;
  label: string;
  type: "cancelled" | "rejected" | "failed" | "lost";
};

type PipelineConfig = {
  title: string;
  primaryPath: StepDefinition[];
  alternativeBranches: AlternativeBranch[];
  getAllowed: (current: string) => readonly string[];
};

const PIPELINE_CONFIGS: Record<PipelineType, PipelineConfig> = {
  booking: {
    title: "Booking Progression Pipeline",
    primaryPath: [
      { id: "pending", label: "Pending" },
      { id: "confirmed", label: "Confirmed" },
      { id: "in-progress", label: "In Progress" },
      { id: "completed", label: "Completed" },
    ],
    alternativeBranches: [
      { id: "cancelled", label: "Cancelled", type: "cancelled" },
      { id: "rejected", label: "Rejected", type: "rejected" },
    ],
    getAllowed: (status: string) =>
      getAllowedBookingStatusTransitions(status as any),
  },
  order: {
    title: "Order Fulfillment Pipeline",
    primaryPath: [
      { id: "pending", label: "Pending" },
      { id: "confirmed", label: "Confirmed" },
      { id: "processing", label: "Processing" },
      { id: "shipped", label: "Shipped" },
      { id: "delivered", label: "Delivered" },
    ],
    alternativeBranches: [
      { id: "cancelled", label: "Cancelled", type: "cancelled" },
    ],
    getAllowed: (status: string) =>
      getAllowedOrderStatusTransitions(status as any),
  },
  payment: {
    title: "Payment Status Pipeline",
    primaryPath: [
      { id: "pending", label: "Pending" },
      { id: "paid", label: "Paid" },
      { id: "refunded", label: "Refunded" },
    ],
    alternativeBranches: [
      { id: "failed", label: "Failed", type: "failed" },
    ],
    getAllowed: (status: string) =>
      getAllowedPaymentStatusTransitions(status as any),
  },
  contact: {
    title: "Inquiry Qualification Pipeline",
    primaryPath: [
      { id: "new", label: "New" },
      { id: "contacted", label: "Contacted" },
      { id: "qualified", label: "Qualified" },
      { id: "site-visit", label: "Site Visit" },
      { id: "proposal-sent", label: "Proposal Sent" },
      { id: "won", label: "Won" },
    ],
    alternativeBranches: [
      { id: "lost", label: "Lost", type: "lost" },
    ],
    getAllowed: (status: string) =>
      getAllowedContactStatusTransitions(status as any),
  },
};

interface StatusPipelineGuideProps {
  type: PipelineType;
  currentStatus: string;
  selectedStatus?: string;
  className?: string;
}

export default function StatusPipelineGuide({
  type,
  currentStatus,
  selectedStatus,
  className = "",
}: StatusPipelineGuideProps) {
  const config = PIPELINE_CONFIGS[type];

  const allowedNext = useMemo(() => {
    return config.getAllowed(currentStatus);
  }, [config, currentStatus]);

  const primaryIds = useMemo(
    () => config.primaryPath.map((s) => s.id),
    [config.primaryPath]
  );

  const currentIndex = primaryIds.indexOf(currentStatus);
  const isTerminal = allowedNext.length === 0;

  return (
    <div
      className={`rounded-2xl border border-blue/15 bg-gradient-to-b from-blue/5 to-transparent p-4 text-xs dark:border-blue/20 dark:from-blue-950/20 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue/10 text-blue dark:bg-blue-900/40 dark:text-blue-300">
            <GitBranch className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              {config.title}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isTerminal ? (
            <Badge
              variant="outline"
              className="border-amber-300 bg-amber-50 text-[10px] font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
            >
              <Lock className="mr-1 h-3 w-3" />
              Locked Terminal
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-blue/30 bg-blue/5 text-[10px] font-semibold text-blue dark:border-blue-800 dark:text-blue-300"
            >
              Forward Only
            </Badge>
          )}
        </div>
      </div>

      {/* Primary Pipeline Steps */}
      <div className="pt-3">
        <div className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center justify-between">
          <span>Main Progression Workflow</span>
          <span className="text-[10px] text-muted-foreground/80">
            Cannot move backward
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {config.primaryPath.map((step, idx) => {
            const isCurrent = step.id === currentStatus;
            const isSelected = selectedStatus && step.id === selectedStatus && !isCurrent;
            const isNextAllowed = allowedNext.includes(step.id);
            const isPast = currentIndex !== -1 && idx < currentIndex;
            const isLast = idx === config.primaryPath.length - 1;

            return (
              <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 transition-all ${
                    isCurrent
                      ? "border-2 border-blue bg-blue/10 font-bold text-navy shadow-sm ring-2 ring-blue/20 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-200"
                      : isSelected
                      ? "border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 shadow-sm ring-2 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : isNextAllowed
                      ? "border border-emerald-400/80 bg-emerald-50/50 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : isPast
                      ? "border border-slate-200 bg-slate-100/70 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400"
                      : "border border-dashed border-slate-200 bg-background/50 text-slate-400 dark:border-slate-800 dark:text-slate-600"
                  }`}
                >
                  {isCurrent ? (
                    <span className="flex h-2 w-2 rounded-full bg-blue animate-pulse" />
                  ) : isSelected ? (
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  ) : isPast ? (
                    <Check className="h-3 w-3 text-slate-500" />
                  ) : isNextAllowed ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ) : null}

                  <span className="text-[11px] whitespace-nowrap">
                    {step.label}
                  </span>

                  {isCurrent && (
                    <span className="rounded bg-blue text-white px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                  {isSelected && (
                    <span className="rounded bg-emerald-600 text-white px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                  {!isCurrent && !isSelected && isNextAllowed && (
                    <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 px-1 text-[9px] font-medium">
                      Next
                    </span>
                  )}
                </div>

                {!isLast && (
                  <ArrowRight
                    className={`h-3 w-3 shrink-0 ${
                      isPast
                        ? "text-slate-400 dark:text-slate-600"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alternative Terminal Branches */}
      {config.alternativeBranches.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              Terminal Branches:
            </span>

            {config.alternativeBranches.map((branch) => {
              const isCurrent = branch.id === currentStatus;
              const isSelected = selectedStatus && branch.id === selectedStatus && !isCurrent;
              const isNextAllowed = allowedNext.includes(branch.id);

              return (
                <div
                  key={branch.id}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] transition-all ${
                    isCurrent
                      ? "border border-red-500 bg-red-50 font-bold text-red-800 ring-2 ring-red-500/20 dark:bg-red-950/60 dark:text-red-300"
                      : isSelected
                      ? "border border-red-500 bg-red-50 font-bold text-red-800 ring-2 ring-red-500/20 dark:bg-red-950/60 dark:text-red-300"
                      : isNextAllowed
                      ? "border border-amber-300 bg-amber-50/70 font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                      : "border border-slate-200 bg-slate-100/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-600"
                  }`}
                >
                  {isCurrent ? (
                    <Ban className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : isSelected ? (
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : isNextAllowed ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  ) : (
                    <Lock className="h-2.5 w-2.5 text-slate-400" />
                  )}

                  <span>{branch.label}</span>

                  {isCurrent ? (
                    <span className="rounded bg-red-600 text-white px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                      Current (Terminal)
                    </span>
                  ) : isSelected ? (
                    <span className="rounded bg-red-600 text-white px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider">
                      Selected
                    </span>
                  ) : isNextAllowed ? (
                    <span className="rounded bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 px-1 text-[9px] font-medium">
                      Allowed Next
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 dark:text-slate-600">
                      Unavailable
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Informative Guidance Footer */}
      <div className="mt-3 flex items-start gap-1.5 pt-2 border-t border-border/30 text-[10.5px] leading-relaxed text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue/70" />
        <span>
          {isTerminal ? (
            <span className="font-medium text-amber-700 dark:text-amber-400">
              This record is in a terminal state. Status transitions are locked and cannot be changed.
            </span>
          ) : (
            <span>
              Status must advance in forward progression only. Once an order or booking moves to a subsequent stage, returning to an earlier stage is strictly prohibited.
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
