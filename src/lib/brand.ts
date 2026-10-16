/** Official Astro Live TV domains — same backend, dedicated www deploy. */
export const BRAND_DOMAINS = [
  "astrolivetv.com",
  "www.astrolivetv.com",
] as const;

export const BRAND_PRIMARY_DOMAIN = "astrolivetv.com";

export function resolveBrandDomain(hostname?: string): string {
  const raw =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  const host = raw.replace(/^www\./i, "").toLowerCase();
  if ((BRAND_DOMAINS as readonly string[]).includes(host) || host === "astrolivetv.com") {
    return host;
  }
  if (host.endsWith(".astrolivetv.com")) {
    return host;
  }
  return BRAND_PRIMARY_DOMAIN;
}

export const BRAND_CONTACT = {
  PHONE: "9667687077",
  PHONE_DISPLAY: "+91 9667687077",
  EMAIL: "bd@alphamovil.com",
  ADDRESS: "B-123, SUNCITY, SECTOR-54, Gurgaon, Haryana, 122011",
  ADDRESS_SHORT: "B-123, SUNCITY, SECTOR-54, Gurgaon, Haryana, 122011",
} as const;

export const BRAND = {
  NAME: "Astro Live TV",
  TAGLINE: "Your Digital Gateway to Astrology Guidance",
  PRIMARY_DOMAIN: BRAND_PRIMARY_DOMAIN,
  DOMAINS: BRAND_DOMAINS,
  get DOMAIN() {
    return resolveBrandDomain();
  },
  COMPANY: "Alphamovil Digital Solutions",
  LOGO: "/logo.png",
  VIDEO_PRELOADER: "",
  AUDIO_BG: "",
  CONTACT: BRAND_CONTACT,
} as const;
