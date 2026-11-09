"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Activity,
  AlertCircle,
  Globe,
  Loader2,
  Lock,
  Megaphone,
  Save,
  ShieldCheck,
} from "lucide-react";

import { settingsApi } from "@/lib/api/settings";
import {
  ISettings,
  defaultSettingsValues,
} from "@/types/settings.type";
import DashboardButton from "@/components/dashboard/DashboardButton";
import { SettingsSkeleton } from "./SettingsSkeleton";
import { AdvertisingSettings } from "./AdvertisingSettings";
import { AnalyticsSettings } from "./AnalyticsSettings";
import { GeneralSeoSettings } from "./GeneralSeoSettings";
import { PrivacyConsentSettings } from "./PrivacyConsentSettings";
import { AccountSettings } from "./AccountSettings";

interface AdminSettingsManagerProps {
  initialSettings?: ISettings;
  isAdmin: boolean;
}

type SettingsTab =
  | "seo"
  | "analytics"
  | "advertising"
  | "consent"
  | "account";

export function AdminSettingsManager({
  initialSettings,
  isAdmin,
}: AdminSettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    isAdmin ? "seo" : "account",
  );
  const [settings, setSettings] = useState<ISettings>(
    initialSettings || defaultSettingsValues,
  );
  const [savedSettings, setSavedSettings] = useState<ISettings>(
    initialSettings || defaultSettingsValues,
  );
  const [isLoading, setIsLoading] = useState(
    !initialSettings && isAdmin,
  );
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!initialSettings && isAdmin) {
      settingsApi
        .getAdminSettings()
        .then((data) => {
          setSettings(data);
          setSavedSettings(data);
        })
        .catch((err) => {
          console.error("Failed to load settings:", err);
          toast.error("Failed to load current settings.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialSettings, isAdmin]);

  const hasUnsavedChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // GA4 validation
    if (
      settings.analytics.ga4.enabled &&
      settings.analytics.ga4.measurementId
    ) {
      if (
        !/^G-[A-Z0-9]+$/i.test(settings.analytics.ga4.measurementId)
      ) {
        newErrors["analytics.ga4.measurementId"] =
          "Measurement ID must be in the format G-XXXXXXXXXX";
      }
    }

    // GTM validation
    if (
      settings.analytics.gtm.enabled &&
      settings.analytics.gtm.containerId
    ) {
      if (
        !/^GTM-[A-Z0-9]+$/i.test(settings.analytics.gtm.containerId)
      ) {
        newErrors["analytics.gtm.containerId"] =
          "Container ID must be in the format GTM-XXXXXXX";
      }
    }

    // Meta Pixel validation
    if (
      settings.marketing.metaPixel.enabled &&
      settings.marketing.metaPixel.pixelId
    ) {
      if (!/^\d{8,20}$/.test(settings.marketing.metaPixel.pixelId)) {
        newErrors["marketing.metaPixel.pixelId"] =
          "Meta Pixel ID must contain 8–20 digits";
      }

      if (
        settings.marketing.metaPixel.capi?.enabled &&
        !settings.marketing.metaPixel.capi.accessTokenConfigured &&
        !settings.marketing.metaPixel.capi.accessToken?.trim()
      ) {
        newErrors["marketing.metaPixel.capi.accessToken"] =
          "Access token is required when Meta CAPI is enabled";
      }
    }

    // Google Ads validation
    if (
      settings.marketing.googleAds.enabled &&
      settings.marketing.googleAds.conversionId
    ) {
      if (
        !/^(AW-)?[0-9]+$/i.test(
          settings.marketing.googleAds.conversionId,
        )
      ) {
        newErrors["marketing.googleAds.conversionId"] =
          "Conversion ID must be numbers or AW-XXXXXXXXX";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error(
        "Please correct the highlighted validation errors.",
      );
      return;
    }

    startTransition(async () => {
      try {
        const updated = await settingsApi.updateSettings(settings);
        setSettings(updated);
        setSavedSettings(updated);
        toast.success("Settings saved successfully!");
      } catch (error: unknown) {
        console.error("Save settings error:", error);
        let msg = "Failed to save settings.";
        const errObj = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (typeof errObj?.response?.data?.message === "string") {
          msg = errObj.response.data.message;
        } else if (typeof errObj?.message === "string") {
          msg = errObj.message;
        }
        toast.error(msg);
      }
    });
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Navigation & Actions */}
      {isAdmin && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div
            role="tablist"
            className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted/60 p-1.5 backdrop-blur-sm border border-border/40"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "seo"}
              onClick={() => setActiveTab("seo")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "seo"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Globe className="h-4 w-4 text-blue" />
              General SEO
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "analytics"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Activity className="h-4 w-4 text-indigo" />
              Analytics
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "advertising"}
              onClick={() => setActiveTab("advertising")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "advertising"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Megaphone className="h-4 w-4 text-purple-600" />
              Advertising
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "consent"}
              onClick={() => setActiveTab("consent")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "consent"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <Lock className="h-4 w-4 text-teal" />
              Privacy &amp; Consent
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "account"
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Account &amp; Security
            </button>
          </div>

          {activeTab !== "account" && (
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Unsaved changes
                </span>
              )}
              <DashboardButton
                onClick={handleSave}
                disabled={isPending}
                icon={
                  isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {isPending ? "Saving..." : "Save Settings"}
              </DashboardButton>
            </div>
          )}
        </div>
      )}

      {/* Tab Panels */}
      {isAdmin && activeTab === "seo" && (
        <GeneralSeoSettings
          data={settings.seo}
          onChange={(seo) => setSettings({ ...settings, seo })}
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "analytics" && (
        <AnalyticsSettings
          data={settings.analytics}
          onChange={(analytics) =>
            setSettings({ ...settings, analytics })
          }
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "advertising" && (
        <AdvertisingSettings
          data={settings.marketing}
          onChange={(marketing) =>
            setSettings({ ...settings, marketing })
          }
          errors={errors}
        />
      )}

      {isAdmin && activeTab === "consent" && (
        <PrivacyConsentSettings
          data={settings.consent}
          onChange={(consent) =>
            setSettings({ ...settings, consent })
          }
          errors={errors}
        />
      )}

      {/* Account & Security Tab */}
      {(!isAdmin || activeTab === "account") && <AccountSettings />}
    </div>
  );
}
