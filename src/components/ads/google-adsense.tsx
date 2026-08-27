import Script from "next/script";

/** AdSense publisher client ID (ca-pub-…). Public by design — appears in page HTML. */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-3404035796600718";

/**
 * Loads the Google AdSense script site-wide.
 * Premium gating can wrap/skip this later; for now ads load for all visitors.
 */
export function GoogleAdSense() {
  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
