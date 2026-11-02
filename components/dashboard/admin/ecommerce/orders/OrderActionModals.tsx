"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DashboardButton from "@/components/dashboard/DashboardButton";
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
import { Textarea } from "@/components/ui/textarea";
import { usePatch } from "@/hooks/swr/usePatch";
import {
  getAllowedOrderStatusTransitions,
  getAllowedPaymentStatusTransitions,
  type AdminOrder,
  type OrderPaymentStatus,
  type OrderStatus,
} from "@/types/order.type";
import {
  getOrderActionError,
  prettyOrderStatus,
  type OrderMutationResponse,
} from "./orderActionUtils";

type OrderActionModalProps = {
  order: AdminOrder | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
  onSuccess: (order: AdminOrder, message: string) => void;
};

const IRREVERSIBLE_ORDER_STATUSES: OrderStatus[] = [
  "delivered",
  "cancelled",
];
const IRREVERSIBLE_PAYMENT_STATUSES: OrderPaymentStatus[] = [
  "failed",
  "refunded",
];

export function UpdateOrderStatusModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: updateStatus, isLoading } = usePatch("/order", {
    revalidateKey,
  });

  const [status, setStatus] = useState<OrderStatus | "">("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentStatus = order?.status ?? "pending";
  const allowedStatuses = order
    ? getAllowedOrderStatusTransitions(currentStatus)
    : [];
  const isTerminal = allowedStatuses.length === 0;

  useEffect(() => {
    if (open && order) {
      const allowed = getAllowedOrderStatusTransitions(order.status);
      setStatus(allowed.length > 0 ? allowed[0] : "");
      setIsConfirmed(false);
    }
  }, [open, order]);

  const isIrreversible =
    status &&
    IRREVERSIBLE_ORDER_STATUSES.includes(status as OrderStatus);

  const submit = async () => {
    if (!order || isLoading || !status || isTerminal) return;
    if (status === order.status) return;

    if (isIrreversible && !isConfirmed) {
      setIsConfirmed(true);
      return;
    }

    try {
      const response: OrderMutationResponse = await updateStatus({
        id: `${order._id}/status`,
        data: { status },
      });
      if (response.success === false) {
        toast.error(
          response.message || "Failed to update order status.",
        );
        return;
      }
      onSuccess(
        response.data,
        response.message || "Order status updated successfully.",
      );
      onClose();
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(error, "Failed to update order status."),
      );
    }
  };

  return (
    <Dialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Order Status
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Advance the fulfillment stage for order{" "}
              <span className="font-semibold text-foreground">
                #{order?.orderNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Current status:{" "}
                </span>
                <span className="font-semibold capitalize text-foreground">
                  {order ? prettyOrderStatus(order.status) : "—"}
                </span>
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
                      This order has reached terminal status &quot;
                      {prettyOrderStatus(currentStatus)}&quot;. Orders
                      cannot be moved backward or transitioned to any
                      further status.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="new-order-status"
                    className="font-semibold text-navy"
                  >
                    Allowed next status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value as OrderStatus);
                      setIsConfirmed(false);
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="new-order-status"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select next status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedStatuses.map((value) => (
                        <SelectItem key={value} value={value}>
                          {prettyOrderStatus(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Only permitted forward workflow transitions from
                    &quot;{prettyOrderStatus(currentStatus)}&quot; are
                    selectable.
                  </p>
                </div>

                {isIrreversible && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-semibold">
                          Irreversible Fulfillment State
                        </p>
                        <p className="mt-1 text-xs leading-5">
                          Transitioning to &quot;
                          {prettyOrderStatus(status as OrderStatus)}
                          &quot; is permanent. Once completed, this
                          order cannot be reopened, moved backward, or
                          changed.
                        </p>
                        {isConfirmed && (
                          <p className="mt-2 text-xs font-bold text-red-700 dark:text-red-300">
                            Click &quot;Confirm & Update Status&quot;
                            below to finalize.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5 text-xs font-bold"
              disabled={isLoading}
              onClick={onClose}
            >
              {isTerminal ? "Close" : "Cancel"}
            </DashboardButton>
            {!isTerminal && (
              <DashboardButton
                disabled={
                  isLoading ||
                  !order ||
                  !status ||
                  status === order.status
                }
                onClick={() => void submit()}
                className={
                  isIrreversible
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : undefined
                }
                icon={
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isConfirmed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : undefined
                }
              >
                {isLoading
                  ? "Updating..."
                  : isIrreversible && !isConfirmed
                    ? `Proceed to ${prettyOrderStatus(status as OrderStatus)}`
                    : isConfirmed
                      ? "Confirm & Update Status"
                      : "Update Status"}
              </DashboardButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function UpdatePaymentStatusModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: updatePayment, isLoading } = usePatch("/order", {
    revalidateKey,
  });

  const [paymentStatus, setPaymentStatus] = useState<
    OrderPaymentStatus | ""
  >("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const currentPaymentStatus = order?.paymentStatus ?? "pending";
  const rawAllowed = order
    ? getAllowedPaymentStatusTransitions(currentPaymentStatus)
    : [];

  // If order is cancelled, payment cannot be confirmed as paid
  const allowedPaymentStatuses = rawAllowed.filter((status) => {
    if (order?.status === "cancelled" && status === "paid")
      return false;
    return true;
  });

  const isTerminal = allowedPaymentStatuses.length === 0;

  useEffect(() => {
    if (open && order) {
      const allowed = getAllowedPaymentStatusTransitions(
        order.paymentStatus,
      ).filter(
        (st) => !(order.status === "cancelled" && st === "paid"),
      );
      setPaymentStatus(allowed.length > 0 ? allowed[0] : "");
      setIsConfirmed(false);
    }
  }, [open, order]);

  const isIrreversible =
    paymentStatus &&
    IRREVERSIBLE_PAYMENT_STATUSES.includes(
      paymentStatus as OrderPaymentStatus,
    );

  const submit = async () => {
    if (!order || isLoading || !paymentStatus || isTerminal) return;
    if (paymentStatus === order.paymentStatus) return;

    if (isIrreversible && !isConfirmed) {
      setIsConfirmed(true);
      return;
    }

    try {
      const response: OrderMutationResponse = await updatePayment({
        id: `${order._id}/payment-status`,
        data: { paymentStatus },
      });
      if (response.success === false) {
        toast.error(
          response.message || "Failed to update payment status.",
        );
        return;
      }
      onSuccess(
        response.data,
        response.message || "Payment status updated successfully.",
      );
      onClose();
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(
          error,
          "Failed to update payment status.",
        ),
      );
    }
  };

  return (
    <Dialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <DialogTitle className="text-xl font-bold text-navy">
              Update Payment Status
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Update payment reconciliation for order{" "}
              <span className="font-semibold text-foreground">
                #{order?.orderNumber}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Current payment status:{" "}
                </span>
                <span className="font-semibold capitalize text-foreground">
                  {order
                    ? prettyOrderStatus(order.paymentStatus)
                    : "—"}
                </span>
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
                    <p className="font-semibold">
                      Terminal Payment State
                    </p>
                    <p className="mt-1 text-xs leading-5">
                      Payment for this order has reached terminal
                      status &quot;
                      {prettyOrderStatus(currentPaymentStatus)}&quot;.
                      Failed or refunded payments cannot transition
                      back to paid or pending.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="payment-status-select"
                    className="font-semibold text-navy"
                  >
                    Allowed next payment status
                  </Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(value) => {
                      setPaymentStatus(value as OrderPaymentStatus);
                      setIsConfirmed(false);
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="payment-status-select"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select next payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedPaymentStatuses.map((value) => (
                        <SelectItem key={value} value={value}>
                          {prettyOrderStatus(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Only valid forward transitions according to the
                    payment pipeline are permitted.
                  </p>
                </div>

                {isIrreversible && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-semibold">
                          Irreversible Payment State
                        </p>
                        <p className="mt-1 text-xs leading-5">
                          Transitioning payment to &quot;
                          {prettyOrderStatus(
                            paymentStatus as OrderPaymentStatus,
                          )}
                          &quot; is permanent. Once set, payment
                          cannot be moved back to Paid or Pending.
                        </p>
                        {isConfirmed && (
                          <p className="mt-2 text-xs font-bold text-red-700 dark:text-red-300">
                            Click &quot;Confirm Payment Status&quot;
                            below to finalize.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5 text-xs font-bold"
              disabled={isLoading}
              onClick={onClose}
            >
              {isTerminal ? "Close" : "Cancel"}
            </DashboardButton>
            {!isTerminal && (
              <DashboardButton
                disabled={
                  isLoading ||
                  !order ||
                  !paymentStatus ||
                  paymentStatus === order.paymentStatus
                }
                onClick={() => void submit()}
                className={
                  isIrreversible
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : undefined
                }
                icon={
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isConfirmed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : undefined
                }
              >
                {isLoading
                  ? "Updating..."
                  : isIrreversible && !isConfirmed
                    ? `Proceed to ${prettyOrderStatus(paymentStatus as OrderPaymentStatus)}`
                    : isConfirmed
                      ? "Confirm Payment Status"
                      : "Update Payment Status"}
              </DashboardButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Backward-compatible alias for existing imports
export const MarkPaymentPaidModal = UpdatePaymentStatusModal;

export function CancelOrderModal({
  order,
  open,
  revalidateKey,
  onClose,
  onSuccess,
}: OrderActionModalProps) {
  const { mutate: cancelOrder, isLoading } = usePatch("/order", {
    revalidateKey,
  });
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState("");

  const canCancel =
    order?.status === "pending" ||
    order?.status === "confirmed" ||
    order?.status === "processing";

  const submit = async () => {
    if (!order || isLoading || !canCancel) return;
    const normalizedReason = reason.trim();
    if (
      normalizedReason.length < 3 ||
      normalizedReason.length > 500
    ) {
      setValidationError(
        "Enter a reason between 3 and 500 characters.",
      );
      return;
    }
    setValidationError("");
    try {
      const response: OrderMutationResponse = await cancelOrder({
        id: `${order._id}/cancel`,
        data: { reason: normalizedReason },
      });
      if (response.success === false) {
        toast.error(response.message || "Failed to cancel order.");
        return;
      }
      onSuccess(
        response.data,
        response.message || "Order cancelled successfully.",
      );
      onClose();
    } catch (error: unknown) {
      toast.error(
        getOrderActionError(error, "Failed to cancel order."),
      );
    }
  };

  return (
    <Dialog
      open={open && Boolean(order)}
      onOpenChange={(value) => !value && !isLoading && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-xl">
        <div className="flex max-h-[92vh] flex-col">
          <DialogHeader className="border-b px-6 py-5 pr-14 text-left sm:px-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl font-bold text-navy">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Cancel order{" "}
              <span className="font-semibold text-foreground">
                #{order?.orderNumber}
              </span>
              . This permanently changes its status to Cancelled and
              restores stock.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
            {!canCancel ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                <p className="font-semibold">
                  Cancellation Not Permitted
                </p>
                <p className="mt-1 text-xs leading-5">
                  Orders in status &quot;
                  {order ? prettyOrderStatus(order.status) : ""}&quot;
                  cannot be cancelled. Cancellation is permitted only
                  during Pending, Confirmed, or Processing stages.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label
                  htmlFor="order-cancellation-reason"
                  className="font-semibold text-navy"
                >
                  Cancellation reason
                </Label>
                <Textarea
                  id="order-cancellation-reason"
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setValidationError("");
                  }}
                  disabled={isLoading}
                  maxLength={500}
                  aria-invalid={Boolean(validationError)}
                  placeholder="Enter why this order is being cancelled"
                  className="min-h-32 resize-none"
                />
                <div className="flex justify-between gap-3 text-xs">
                  <p className="text-red-600" role="alert">
                    {validationError}
                  </p>
                  <p className="ml-auto text-muted-foreground">
                    {reason.trim().length}/500 (minimum 3)
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
            <DashboardButton
              variant="outline"
              className="min-h-10 rounded-xl px-5 text-xs font-bold"
              disabled={isLoading}
              onClick={onClose}
            >
              Close
            </DashboardButton>
            {canCancel && (
              <DashboardButton
                className="min-h-10 rounded-xl bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
                disabled={
                  isLoading ||
                  !order ||
                  reason.trim().length < 3 ||
                  reason.trim().length > 500
                }
                onClick={() => void submit()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </DashboardButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
