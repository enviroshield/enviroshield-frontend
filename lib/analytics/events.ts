import { getStoredConsent } from "@/lib/consent/consent-store";
import { defaultSettingsValues, ISettings } from "@/types/settings.type";

export type ConversionAction =
  | "contact_form_submitted"
  | "quote_request_submitted"
  | "consultation_booking_submitted"
  | "phone_number_clicked"
  | "email_link_clicked"
  | "whatsapp_link_clicked"
  | "purchase";

export interface TrackConversionOptions {
  eventId?: string;
}

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (
    command: string,
    actionOrConfig: string,
    params?: Record<string, unknown>,
  ) => void;
  fbq?: {
    (
      command: "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string },
    ): void;
    (command: "consent", action: "grant" | "revoke"): void;
    (command: "init", pixelId: string): void;
  };
};

let clientSettingsCache: ISettings = defaultSettingsValues;

export function setClientTrackingSettings(settings: ISettings) {
  clientSettingsCache = settings;
}

export function trackConversion(
  action: ConversionAction,
  metadata?: Record<string, unknown>,
  options?: TrackConversionOptions,
) {
  if (typeof window === "undefined") return;

  const currentWindow = window as TrackingWindow;
  const consent = getStoredConsent();
  const consentConfig = clientSettingsCache.consent;

  // Determine permissions
  const consentActive = Boolean(consentConfig?.enabled);
  const allowAnalytics =
    !consentActive || !consentConfig.requireAnalyticsConsent || consent.analytics;
  const allowMarketing =
    !consentActive || !consentConfig.requireMarketingConsent || consent.marketing;

  // Clean non-PII payload
  const safePayload: Record<string, unknown> = {
    event_category: action === "purchase" ? "ecommerce" : "lead_generation",
    event_label: action,
    page_location: window.location.pathname,
    ...(options?.eventId ? { event_id: options.eventId } : {}),
    ...(metadata || {}),
  };

  const fbqOptions = options?.eventId ? { eventID: options.eventId } : undefined;

  // 1. Google Analytics & GTM dataLayer
  if (allowAnalytics) {
    if (Array.isArray(currentWindow.dataLayer)) {
      currentWindow.dataLayer.push({
        event: action,
        ...safePayload,
      });
    }

    if (typeof currentWindow.gtag === "function") {
      currentWindow.gtag("event", action, safePayload);
    }
  }

  // 2. Marketing Integrations (Meta Pixel & Google Ads)
  if (allowMarketing) {
    if (typeof currentWindow.fbq === "function") {
      switch (action) {
        case "contact_form_submitted":
        case "quote_request_submitted":
          currentWindow.fbq(
            "track",
            "Lead",
            {
              content_name: action,
              ...safePayload,
            },
            fbqOptions,
          );
          break;
        case "consultation_booking_submitted":
          currentWindow.fbq(
            "track",
            "Schedule",
            {
              content_name: action,
              ...safePayload,
            },
            fbqOptions,
          );
          break;
        case "purchase":
          currentWindow.fbq(
            "track",
            "Purchase",
            {
              ...safePayload,
            },
            fbqOptions,
          );
          break;
        case "phone_number_clicked":
        case "email_link_clicked":
        case "whatsapp_link_clicked":
          currentWindow.fbq(
            "track",
            "Contact",
            {
              content_name: action,
              ...safePayload,
            },
            fbqOptions,
          );
          break;
        default:
          currentWindow.fbq("trackCustom", action, safePayload);
      }
    }

    // Google Ads Conversion Action
    const googleAds = clientSettingsCache.marketing?.googleAds;
    if (googleAds?.enabled && googleAds.conversionId) {
      let label: string | undefined;

      switch (action) {
        case "contact_form_submitted":
          label = googleAds.conversionLabels?.contactForm;
          break;
        case "quote_request_submitted":
          label = googleAds.conversionLabels?.quoteRequest;
          break;
        case "consultation_booking_submitted":
          label = googleAds.conversionLabels?.consultationRequest;
          break;
        case "phone_number_clicked":
          label = googleAds.conversionLabels?.phoneClick;
          break;
        case "email_link_clicked":
          label = googleAds.conversionLabels?.emailClick;
          break;
        case "whatsapp_link_clicked":
          label = googleAds.conversionLabels?.whatsappClick;
          break;
      }

      // STRICT: Only fire if a conversion label was explicitly configured
      if (
        label &&
        label.trim().length > 0 &&
        typeof currentWindow.gtag === "function"
      ) {
        const sendTo = `${googleAds.conversionId.replace(/\/$/, "")}/${label.trim()}`;
        currentWindow.gtag("event", "conversion", {
          send_to: sendTo,
          ...safePayload,
        });
      }
    }
  }
}
