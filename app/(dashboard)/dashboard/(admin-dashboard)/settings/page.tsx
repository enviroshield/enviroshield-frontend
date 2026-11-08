import { requireRole } from "@/lib/auth-guards";
import { AdminSettingsManager } from "@/components/dashboard/admin/settings/AdminSettingsManager";
import { Sliders } from "lucide-react";

export default async function SettingsPage() {
  await requireRole("admin");

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-8 p-6 sm:p-8 lg:p-10">
      <section className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo/20 bg-indigo/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo">
          <Sliders className="h-3.5 w-3.5" />
          System Administration
        </div>

        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Settings &amp; Preferences
        </h1>

        <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Manage website SEO, web analytics tracking, advertising conversions,
          visitor privacy consent, active user sessions, and notification preferences.
        </p>
      </section>

      <AdminSettingsManager isAdmin={true} />
    </div>
  );
}
