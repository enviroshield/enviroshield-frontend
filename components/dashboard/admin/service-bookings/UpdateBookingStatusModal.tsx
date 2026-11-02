"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import {
  getAllowedBookingStatusTransitions,
  type Booking,
  type BookingStatus,
} from "@/types/booking.type";
import { formatBookingStatus, getBookingStatusClass } from "./bookingUtils";

type UpdateBookingStatusModalProps = {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const IRREVERSIBLE_STATUSES: BookingStatus[] = ["completed", "cancelled", "rejected"];

export default function UpdateBookingStatusModal({
  booking,
  open,
  onClose,
  onSuccess,
}: UpdateBookingStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentStatus = booking?.status ?? "pending";
  const allowedStatuses = booking ? getAllowedBookingStatusTransitions(currentStatus) : [];
  const isTerminal = allowedStatuses.length === 0;

  useEffect(() => {
    if (open && booking) {
      const allowed = getAllowedBookingStatusTransitions(booking.status);
      setSelectedStatus(allowed.length > 0 ? allowed[0] : "");
      setIsConfirmed(false);
    }
  }, [open, booking]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const isIrreversible = selectedStatus && IRREVERSIBLE_STATUSES.includes(selectedStatus as BookingStatus);
  const requiresConfirmation = Boolean(isIrreversible);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !selectedStatus || isTerminal) return;

    if (selectedStatus === booking.status) {
      toast.info("Status is already set to " + formatBookingStatus(selectedStatus));
      onClose();
      return;
    }

    if (requiresConfirmation && !isConfirmed) {
      setIsConfirmed(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.patch(`/booking/${booking._id}/status`, {
        status: selectedStatus,
      });

      toast.success(
        response.data?.message || "Booking status updated successfully.",
      );
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking status.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open && Boolean(booking)} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Booking Status
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Advance the fulfillment status for booking{" "}
              <span className="font-semibold text-foreground">
                #{booking?.bookingNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
              {/* Current Status Box */}
              <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current status: </span>
                  <Badge
                    variant="outline"
                    className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      booking ? getBookingStatusClass(booking.status) : ""
                    }`}
                  >
                    {booking ? formatBookingStatus(booking.status) : "—"}
                  </Badge>
                </div>
                {isTerminal && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <Lock className="h-3.5 w-3.5" />
                    Terminal State
                  </span>
                )}
              </div>

              {isTerminal ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-semibold">Workflow Complete</p>
                      <p className="mt-1 text-xs leading-5">
                        This booking has reached terminal status &quot;{formatBookingStatus(currentStatus)}&quot;. No further status transitions are permitted in this pipeline.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Status Select */}
                  <div className="space-y-2">
                    <Label htmlFor="status-select" className="text-sm font-semibold text-navy">
                      Allowed next status
                    </Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={(val) => {
                        setSelectedStatus(val as BookingStatus);
                        setIsConfirmed(false);
                      }}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="status-select" className="h-11 w-full rounded-xl">
                        <SelectValue placeholder="Select next status" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {formatBookingStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Only permitted forward transitions from &quot;{formatBookingStatus(currentStatus)}&quot; are selectable.
                    </p>
                  </div>

                  {/* Warning / Confirmation Box for critical terminal states */}
                  {isIrreversible && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                        <div>
                          <p className="font-semibold">Irreversible Action</p>
                          <p className="mt-1 text-xs leading-5">
                            Transitioning to &quot;{formatBookingStatus(selectedStatus as BookingStatus)}&quot; is permanent. Once transitioned, this booking cannot be moved backward or updated again.
                          </p>
                          {isConfirmed && (
                            <p className="mt-2 text-xs font-bold text-red-700 dark:text-red-300">
                              Please click &quot;Confirm & Update Status&quot; below to proceed.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
              <DashboardButton
                type="button"
                variant="outline"
                className="min-h-10 rounded-xl px-5 text-xs font-bold"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                {isTerminal ? "Close" : "Cancel"}
              </DashboardButton>
              {!isTerminal && (
                <DashboardButton
                  type="submit"
                  disabled={isSubmitting || !selectedStatus}
                  className={
                    isIrreversible
                      ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700"
                      : undefined
                  }
                  icon={
                    isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isConfirmed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : undefined
                  }
                >
                  {isSubmitting
                    ? "Updating..."
                    : requiresConfirmation && !isConfirmed
                    ? `Proceed to ${formatBookingStatus(selectedStatus as BookingStatus)}`
                    : isConfirmed
                    ? "Confirm & Update Status"
                    : "Update Status"}
                </DashboardButton>
              )}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
