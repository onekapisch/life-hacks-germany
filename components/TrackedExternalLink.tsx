"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { trackEvent } from "@/lib/analyticsClient";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  lang: "en" | "de";
  context:
    | "guide_source"
    | "guide_body"
    | "guide_offer"
    | "app_official"
    | "app_store";
  guideSlug?: string;
  sponsored?: boolean;
};

function getHost(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return "";
  }
}

export default function TrackedExternalLink({
  href,
  lang,
  context,
  guideSlug,
  sponsored = false,
  onClick,
  rel,
  target,
  ...rest
}: Props) {
  const url = href ?? "";
  const isExternal = /^https?:\/\//i.test(url);

  const computedRel = sponsored
    ? [rel, "noopener", "noreferrer", "sponsored"].filter(Boolean).join(" ")
    : [rel, isExternal ? "noopener noreferrer" : ""].filter(Boolean).join(" ");

  const computedTarget = isExternal ? "_blank" : target;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isExternal && url) {
      trackEvent("outbound_click", {
        lang,
        context,
        guide: guideSlug ?? "n/a",
        host: getHost(url) || "unknown",
        sponsored,
      });
    }
    onClick?.(event);
  }

  return (
    <a
      {...rest}
      href={url}
      rel={computedRel || undefined}
      target={computedTarget}
      onClick={handleClick}
    />
  );
}
