"use client";

import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { usePatch } from "@/hooks/swr/usePatch";

import type { IContact, TContactStatus } from "@/types";
import { getAllowedContactStatusTransitions } from "@/types/contact.type";

import DashboardButton from "../../DashboardButton";
import StatusPipelineGuide from "@/components/dashboard/StatusPipelineGuide";

type EditContactModalProps = {
  contact: IContact | null;
  open: boolean;
  revalidateKey: string;
  onClose: () => void;
};

type FormValues = {
  status: TContactStatus;
  adminNotes: string;
};

const statusOptions: {
  value: TContactStatus;
  label: string;
}[] = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "qualified",
    label: "Qualified",
  },
  {
    value: "site-visit",
    label: "Site Visit",
  },
  {
    value: "proposal-sent",
    label: "Proposal Sent",
  },
  {
    value: "won",
    label: "Won (Terminal)",
  },
  {
    value: "lost",
    label: "Lost (Terminal)",
  },
];

const defaultValues: FormValues = {
  status: "new",
  adminNotes: "",
};

export default function EditContactModal({
  contact,
  open,
  revalidateKey,
  onClose,
}: EditContactModalProps) {
  const { mutate: updateContact, isLoading } = usePatch("/contact", {
    revalidateKey,
  });

  const [confirmed, setConfirmed] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const selectedStatus = watch("status");
  const currentStatus = contact?.status ?? "new";

  const allowedTransitions = useMemo(() => {
    return contact ? getAllowedContactStatusTransitions(contact.status) : [];
  }, [contact]);

  const isTerminal = allowedTransitions.length === 0;

  const availableStatusOptions = useMemo(() => {
    return statusOptions.filter(
      (opt) => opt.value === currentStatus || allowedTransitions.includes(opt.value)
    );
  }, [currentStatus, allowedTransitions]);

  const isTransitioningToTerminal =
    selectedStatus !== currentStatus && (selectedStatus === "won" || selectedStatus === "lost");

  useEffect(() => {
    if (!open || !contact) return;

    reset({
      status: contact.status,
      adminNotes: contact.adminNotes ?? "",
    });
    setConfirmed(false);
  }, [open, contact, reset]);

  const handleClose = () => {
    if (isLoading) return;

    onClose();
    reset(defaultValues);
    setConfirmed(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!contact) return;

    if (isTransitioningToTerminal && !confirmed) {
      toast.error(`Please confirm the transition to terminal status "${values.status.toUpperCase()}".`);
      return;
    }

    try {
      await updateContact({
        id: contact._id,
        data: {
          status: values.status,
          adminNotes: values.adminNotes,
        },
      });

      toast.success("Contact updated successfully.");
      onClose();
      reset(defaultValues);
      setConfirmed(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update contact.";

      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !isLoading) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-xl rounded-2xl border-0 p-0 shadow-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left sm:px-7">
          <DialogTitle className="text-xl font-bold text-navy">
            Update Contact
          </DialogTitle>

          <DialogDescription className="text-sm leading-6">
            Update the status and internal notes for{" "}
            <span className="font-semibold text-foreground">
              {contact?.fullName ?? "this contact"}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 px-6 py-6 sm:px-7">
            {/* Pipeline Flow Guide */}
            <StatusPipelineGuide
              type="contact"
              currentStatus={currentStatus}
              selectedStatus={!isTerminal ? selectedStatus : undefined}
            />

            {/* Terminal Status Warning Banner */}
            {isTerminal && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  Terminal Status: {statusOptions.find((o) => o.value === currentStatus)?.label || currentStatus}
                </div>
                <p className="mt-1 text-amber-700 leading-relaxed">
                  This contact inquiry has reached a terminal status and cannot transition to any other status.
                  You can still update the internal admin notes below.
                </p>
              </div>
            )}

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-navy">
                Contact Status
              </Label>

              <Controller
                control={control}
                name="status"
                rules={{
                  required: "Status is required",
                }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setConfirmed(false);
                    }}
                    disabled={isLoading || isTerminal}
                  >
                    <SelectTrigger className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select contact status" />
                    </SelectTrigger>

                    <SelectContent>
                      {availableStatusOptions.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}

              <p className="text-xs leading-5 text-muted-foreground">
                {isTerminal
                  ? "This record is at a terminal stage and cannot be changed."
                  : "Only forward status transitions according to the inquiry pipeline are available."}
              </p>
            </div>

            {/* Irreversible Confirmation Banner */}
            {isTransitioningToTerminal && !isTerminal && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-red-800">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  Irreversible Status Transition
                </div>
                <p className="text-red-700 leading-relaxed">
                  Transitioning this inquiry to <strong>{selectedStatus.toUpperCase()}</strong> is permanent.
                  Once saved, no further status updates will be permitted.
                </p>
                <label className="flex items-start gap-2 pt-1 font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                  <span>
                    I confirm that I want to mark this contact inquiry as {selectedStatus.toUpperCase()} (Irreversible).
                  </span>
                </label>
              </div>
            )}

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label
                htmlFor="contact-admin-notes"
                className="text-sm font-semibold text-navy"
              >
                Admin Notes
              </Label>

              <Controller
                control={control}
                name="adminNotes"
                render={({ field }) => (
                  <Textarea
                    id="contact-admin-notes"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    placeholder="Add internal notes about this contact..."
                    className="min-h-36 resize-none rounded-xl"
                  />
                )}
              />

              <p className="text-xs leading-5 text-muted-foreground">
                These notes are internal and are not shown to the customer.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t bg-muted/10 px-6 py-4 sm:px-7">
            <DashboardButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 rounded-xl px-5 text-xs font-bold"
            >
              Cancel
            </DashboardButton>

            <DashboardButton
              type="submit"
              disabled={isLoading || (isTransitioningToTerminal && !confirmed)}
              icon={
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )
              }
            >
              {isLoading ? "Updating..." : "Update Contact"}
            </DashboardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
