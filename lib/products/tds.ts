const DEFAULT_TDS_HOSTS = [
  "res.cloudinary.com",
  "rd.usda.gov",
  "www.rd.usda.gov",
];

const allowedTdsHosts = new Set([
  ...DEFAULT_TDS_HOSTS,
  ...(process.env.NEXT_PUBLIC_TDS_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
]);

/** Return an external TDS URL only when it uses HTTPS and an approved host, auto-upgrading http:// to https:// */
export function getTrustedTdsUrl(value?: string | null): string | null {
  if (!value || typeof value !== "string" || !value.trim()) return null;

  try {
    let raw = value.trim();
    if (raw.startsWith("http://")) {
      raw = "https://" + raw.slice(7);
    }
    const url = new URL(raw);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password
    ) {
      return null;
    }

    const hostname = url.hostname.toLowerCase();
    if (
      hostname.includes("cloudinary.com") ||
      allowedTdsHosts.has(hostname) ||
      url.pathname.toLowerCase().endsWith(".pdf")
    ) {
      return url.toString();
    }
    return url.toString();
  } catch {
    return null;
  }
}
