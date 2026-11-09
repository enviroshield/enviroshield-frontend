"use client";

import { useState } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Info,
  Megaphone,
  Server,
  ShieldCheck,
  Target,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMarketingSettings } from "@/types/settings.type";

interface AdvertisingSettingsProps {
  data: IMarketingSettings;
  onChange: (data: IMarketingSettings) => void;
  errors?: Record<string, string>;
}

export function AdvertisingSettings({
  data,
  onChange,
  errors = {},
}: AdvertisingSettingsProps) {
  const [showToken, setShowToken] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const updateMetaPixel = <K extends keyof IMarketingSettings["metaPixel"]>(
    field: K,
    value: IMarketingSettings["metaPixel"][K],
  ) => {
    onChange({
      ...data,
      metaPixel: {
        ...data.metaPixel,
        [field]: value,
      },
    });
  };

  const updateCapi = <
    K extends keyof NonNullable<IMarketingSettings["metaPixel"]["capi"]>,
  >(
    field: K,
    value: NonNullable<IMarketingSettings["metaPixel"]["capi"]>[K],
  ) => {
    const currentCapi = data.metaPixel.capi || {
      enabled: false,
      accessToken: "",
      accessTokenConfigured: false,
      testEventCode: "",
    };
    onChange({
      ...data,
      metaPixel: {
        ...data.metaPixel,
        capi: {
          ...currentCapi,
          [field]: value,
        },
      },
    });
  };

  const handleClearToken = () => {
    const currentCapi = data.metaPixel.capi || {
      enabled: false,
      accessToken: "",
      accessTokenConfigured: false,
      testEventCode: "",
    };
    onChange({
      ...data,
      metaPixel: {
        ...data.metaPixel,
        capi: {
          ...currentCapi,
          accessToken: "",
          clearAccessToken: true,
          accessTokenConfigured: false,
        },
      },
    });
    setShowClearConfirm(false);
  };

  const updateGoogleAds = <K extends keyof IMarketingSettings["googleAds"]>(
    field: K,
    value: IMarketingSettings["googleAds"][K],
  ) => {
    onChange({
      ...data,
      googleAds: {
        ...data.googleAds,
        [field]: value,
      },
    });
  };

  const updateConversionLabel = (
    key: keyof IMarketingSettings["googleAds"]["conversionLabels"],
    value: string,
  ) => {
    onChange({
      ...data,
      googleAds: {
        ...data.googleAds,
        conversionLabels: {
          ...data.googleAds.conversionLabels,
          [key]: value.trim(),
        },
      },
    });
  };

  const isPixelActive = Boolean(data.metaPixel.enabled);
  const capiData = data.metaPixel.capi || {
    enabled: false,
    accessToken: "",
    accessTokenConfigured: false,
    testEventCode: "",
  };
  const isCapiActive = isPixelActive && Boolean(capiData.enabled);
  const isTokenConfigured = Boolean(capiData.accessTokenConfigured);

  return (
    <div className="space-y-6">
      {/* Meta Pixel & Conversions API */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Meta Pixel &amp; Conversions API (CAPI)
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Track website visits and server-side conversions on Meta platforms with deduplication.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.metaPixel.enabled}
              onCheckedChange={(val) => updateMetaPixel("enabled", val)}
              aria-label="Enable Meta Pixel"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6 sm:px-7">
          {/* Pixel ID */}
          <div className="space-y-2">
            <Label htmlFor="metaPixelId" className="text-sm font-medium">
              Meta Pixel ID
            </Label>
            <Input
              id="metaPixelId"
              disabled={!isPixelActive}
              value={data.metaPixel.pixelId || ""}
              onChange={(e) => updateMetaPixel("pixelId", e.target.value.trim())}
              placeholder="e.g. 123456789012345"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["marketing.metaPixel.pixelId"] && (
              <p className="text-xs text-destructive">
                {errors["marketing.metaPixel.pixelId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Numeric identifier located in Meta Events Manager &gt; Data Sources.
            </p>
          </div>

          {/* CAPI Sub-Section */}
          <div className="pt-4 border-t border-border/60 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                  <Server className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    Meta Conversions API (Server-Side Tracking)
                    {isCapiActive && (
                      isTokenConfigured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <Check className="h-3 w-3" /> Token configured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <AlertCircle className="h-3 w-3" /> Token required
                        </span>
                      )
                    )}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reliably dispatches server-side conversion events directly to Meta Graph API alongside browser Pixel.
                  </p>
                </div>
              </div>
              <Switch
                disabled={!isPixelActive}
                checked={Boolean(capiData.enabled)}
                onCheckedChange={(val) => updateCapi("enabled", val)}
                aria-label="Enable Meta Conversions API"
              />
            </div>

            {/* Access Token Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaCapiToken" className="text-sm font-medium">
                  Meta CAPI Access Token
                </Label>
                {isTokenConfigured && !showClearConfirm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={!isCapiActive}
                    onClick={() => setShowClearConfirm(true)}
                    className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive px-2"
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Clear Token
                  </Button>
                )}
              </div>

              {/* Clear Token Confirmation Banner */}
              {showClearConfirm && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-destructive font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Are you sure you want to remove the configured access token?</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={handleClearToken}
                      className="h-7 text-xs px-2.5"
                    >
                      Yes, Clear
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowClearConfirm(false)}
                      className="h-7 text-xs px-2.5"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="relative max-w-md">
                <Input
                  id="metaCapiToken"
                  type={showToken ? "text" : "password"}
                  disabled={!isCapiActive}
                  value={capiData.accessToken || ""}
                  onChange={(e) => {
                    updateCapi("accessToken", e.target.value.trim());
                    if (capiData.clearAccessToken) {
                      updateCapi("clearAccessToken", false);
                    }
                  }}
                  placeholder={
                    isTokenConfigured
                      ? "Token is securely configured. Enter new token to replace"
                      : "EAAB..."
                  }
                  className="rounded-xl border-border/70 font-mono text-sm pr-10"
                />
                <button
                  type="button"
                  disabled={!isCapiActive}
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                  aria-label={showToken ? "Hide access token" : "Show access token"}
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors["marketing.metaPixel.capi.accessToken"] && (
                <p className="text-xs text-destructive">
                  {errors["marketing.metaPixel.capi.accessToken"]}
                </p>
              )}

              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  The access token is encrypted at rest using AES-256-GCM on the server and is never exposed in browser HTML, network responses, or public APIs.
                </span>
              </div>
            </div>

            {/* Test Event Code */}
            <div className="space-y-2">
              <Label htmlFor="metaCapiTestEventCode" className="text-sm font-medium">
                Test Event Code (Optional)
              </Label>
              <Input
                id="metaCapiTestEventCode"
                disabled={!isCapiActive}
                value={capiData.testEventCode || ""}
                onChange={(e) =>
                  updateCapi("testEventCode", e.target.value.trim())
                }
                placeholder="e.g. TEST12345"
                className="rounded-xl border-border/70 font-mono text-sm max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                Found in Meta Events Manager &gt; Test Events tab. Leave blank in production so events are recorded as live traffic.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Ads Conversion Tracking */}
      <Card className="rounded-2xl border-border/70 bg-background shadow-none">
        <CardHeader className="border-b border-border/60 px-6 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold tracking-tight">
                  Google Ads Conversion Tracking
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  Record conversions directly in Google Ads for high-intent actions.
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={data.googleAds.enabled}
              onCheckedChange={(val) => updateGoogleAds("enabled", val)}
              aria-label="Enable Google Ads Conversion Tracking"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="googleAdsConversionId" className="text-sm font-medium">
              Google Ads Conversion ID
            </Label>
            <Input
              id="googleAdsConversionId"
              disabled={!data.googleAds.enabled}
              value={data.googleAds.conversionId || ""}
              onChange={(e) => updateGoogleAds("conversionId", e.target.value.trim())}
              placeholder="AW-XXXXXXXXX or XXXXXXXXX"
              className="rounded-xl border-border/70 font-mono text-sm max-w-md"
            />
            {errors["marketing.googleAds.conversionId"] && (
              <p className="text-xs text-destructive">
                {errors["marketing.googleAds.conversionId"]}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Provided in Google Ads &gt; Goals &gt; Conversions &gt; Summary &gt; Tag details.
            </p>
          </div>

          <div className="pt-2 border-t border-border/60">
            <div className="mb-4">
              <h4 className="text-sm font-semibold">Action-Specific Conversion Labels</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure labels only for the conversion actions you want reported to Google Ads. Leave empty to skip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="labelContactForm" className="text-xs font-medium">
                  Contact Form Submission
                </Label>
                <Input
                  id="labelContactForm"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.contactForm || ""}
                  onChange={(e) => updateConversionLabel("contactForm", e.target.value)}
                  placeholder="e.g. AbC-D_efG123"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelConsultation" className="text-xs font-medium">
                  Service Booking / Consultation Request
                </Label>
                <Input
                  id="labelConsultation"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.consultationRequest || ""}
                  onChange={(e) => updateConversionLabel("consultationRequest", e.target.value)}
                  placeholder="e.g. BcD-E_fgH234"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelQuote" className="text-xs font-medium">
                  Quote Request
                </Label>
                <Input
                  id="labelQuote"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.quoteRequest || ""}
                  onChange={(e) => updateConversionLabel("quoteRequest", e.target.value)}
                  placeholder="e.g. CdE-F_ghI345"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelPhone" className="text-xs font-medium">
                  Phone Number Click
                </Label>
                <Input
                  id="labelPhone"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.phoneClick || ""}
                  onChange={(e) => updateConversionLabel("phoneClick", e.target.value)}
                  placeholder="e.g. DeF-G_hiJ456"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelEmail" className="text-xs font-medium">
                  Email Link Click
                </Label>
                <Input
                  id="labelEmail"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.emailClick || ""}
                  onChange={(e) => updateConversionLabel("emailClick", e.target.value)}
                  placeholder="e.g. EfG-H_ijK567"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="labelWhatsapp" className="text-xs font-medium">
                  WhatsApp Link Click
                </Label>
                <Input
                  id="labelWhatsapp"
                  disabled={!data.googleAds.enabled}
                  value={data.googleAds.conversionLabels?.whatsappClick || ""}
                  onChange={(e) => updateConversionLabel("whatsappClick", e.target.value)}
                  placeholder="e.g. FgH-I_jkL678"
                  className="rounded-xl border-border/70 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground/80 mt-0.5" />
            <span>
              Google Ads conversions will be sent using the standard format <code>gtag(&apos;event&apos;, &apos;conversion&apos;, &#123; send_to: &apos;{data.googleAds.conversionId || "AW-ID"}/LABEL&apos; &#125;)</code>. Events are dispatched only upon verified successful user actions.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
