import { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "success" | "danger";

const styles: Record<CalloutType, { container: string; icon: string; title: string }> = {
  info: {
    container: "border-blue-200 bg-blue-50/60 text-navy",
    icon: "text-blue",
    title: "text-navy",
  },
  warning: {
    container: "border-amber-200 bg-amber-50/70 text-amber-950",
    icon: "text-amber-600",
    title: "text-amber-900",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50/60 text-emerald-950",
    icon: "text-emerald-600",
    title: "text-emerald-900",
  },
  danger: {
    container: "border-red-200 bg-red-50/70 text-red-950",
    icon: "text-red-600",
    title: "text-red-900",
  },
};

export default function ArticleCallout({
  type = "info",
  title,
  children,
  className,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const current = styles[type];

  const IconComponent =
    type === "warning"
      ? AlertTriangle
      : type === "danger"
        ? ShieldAlert
        : type === "success"
          ? CheckCircle
          : Info;

  return (
    <div
      role="note"
      className={cn(
        "my-8 rounded-2xl border p-5 sm:p-6 shadow-xs leading-relaxed",
        current.container,
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <IconComponent
          className={cn("mt-0.5 h-5 w-5 shrink-0", current.icon)}
          aria-hidden="true"
        />
        <div className="space-y-1.5 min-w-0">
          {title && (
            <h4 className={cn("text-sm font-bold tracking-tight", current.title)}>
              {title}
            </h4>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

