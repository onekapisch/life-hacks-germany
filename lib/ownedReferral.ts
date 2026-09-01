export type OwnedReferralTarget = "skylocation" | "tank-alert" | "onekapisch-portfolio";

type OwnedReferralOptions = {
  targetProduct: OwnedReferralTarget;
  surface: string;
  content: string;
};

export function withOwnedReferral(
  url: string,
  { targetProduct, surface, content }: OwnedReferralOptions
): string {
  try {
    const nextUrl = new URL(url);
    nextUrl.searchParams.set("utm_source", "lifehacksgermany.com");
    nextUrl.searchParams.set("utm_medium", "owned_referral");
    nextUrl.searchParams.set("utm_campaign", "onekapisch_ecosystem");
    nextUrl.searchParams.set("utm_content", content);
    nextUrl.searchParams.set("source_product", "life-hacks-germany");
    nextUrl.searchParams.set("surface", surface);
    nextUrl.searchParams.set("target_product", targetProduct);
    nextUrl.searchParams.set("campaign", "studio-network");
    nextUrl.searchParams.set("placement_version", "1");
    return nextUrl.toString();
  } catch {
    return url;
  }
}
