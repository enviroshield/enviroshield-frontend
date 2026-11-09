import { getStoredConsent } from "@/lib/consent/consent-store";

export interface IAttributionCookies {
  fbp?: string;
  fbc?: string;
}

export interface IFrontendConversionContext {
  eventId: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  marketingConsent: boolean;
}

/**
 * Extracts a cookie value by name from document.cookie safely.
 */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : undefined;
}

/**
 * Reads _fbp and _fbc cookies ONLY when marketing consent has been granted.
 * Never fabricates _fbc when it does not exist.
 */
export function getAttributionCookies(): IAttributionCookies {
  if (typeof window === "undefined") return {};

  const consent = getStoredConsent();
  if (!consent.marketing) {
    return {};
  }

  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");

  const cookies: IAttributionCookies = {};
  if (fbp && fbp.trim().length > 0) {
    cookies.fbp = fbp.trim();
  }
  if (fbc && fbc.trim().length > 0) {
    cookies.fbc = fbc.trim();
  }

  return cookies;
}

/**
 * Generates a unique event ID for browser-server conversion deduplication.
 */
export function generateEventId(prefix = "evt"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `es_${prefix}_${timestamp}_${random}`;
}

/**
 * Prepares the complete conversion context payload for client-to-server requests.
 */
export function getConversionContext(
  prefix = "evt",
): IFrontendConversionContext {
  const consent = getStoredConsent();
  const cookies = getAttributionCookies();
  const eventId = generateEventId(prefix);

  const eventSourceUrl =
    typeof window !== "undefined" ? window.location.href : undefined;

  return {
    eventId,
    ...(cookies.fbp ? { fbp: cookies.fbp } : {}),
    ...(cookies.fbc ? { fbc: cookies.fbc } : {}),
    ...(eventSourceUrl ? { eventSourceUrl } : {}),
    marketingConsent: Boolean(consent.marketing),
  };
}
