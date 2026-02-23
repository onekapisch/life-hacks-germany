"use client";

import { useMemo } from "react";
import type { Lang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analyticsClient";

export default function GuideShareActions({
  lang,
  title,
  url,
}: {
  lang: Lang;
  title: string;
  url: string;
}) {
  const isEn = lang === "en";

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const xHref = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const labels = useMemo(
    () => ({
      heading: isEn ? "Share" : "Teilen",
      copy: isEn ? "Copy link" : "Link kopieren",
      copied: isEn ? "Copied" : "Kopiert",
      x: "X",
      linkedin: "LinkedIn",
    }),
    [isEn]
  );

  async function onCopyClick() {
    try {
      await navigator.clipboard.writeText(url);
      const button = document.getElementById("copy-guide-link");
      if (button) button.textContent = labels.copied;
      window.setTimeout(() => {
        const node = document.getElementById("copy-guide-link");
        if (node) node.textContent = labels.copy;
      }, 1500);
      trackEvent("guide_share", { channel: "copy_link", lang });
    } catch {
      trackEvent("guide_share_failed", { channel: "copy_link", lang });
    }
  }

  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-ink-3 mb-2">
        {labels.heading}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          id="copy-guide-link"
          type="button"
          onClick={onCopyClick}
          className="btn btn-secondary !px-3 !py-2 !text-xs"
        >
          {labels.copy}
        </button>
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary !px-3 !py-2 !text-xs no-underline"
          onClick={() => trackEvent("guide_share", { channel: "x", lang })}
        >
          {labels.x}
        </a>
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary !px-3 !py-2 !text-xs no-underline"
          onClick={() => trackEvent("guide_share", { channel: "linkedin", lang })}
        >
          {labels.linkedin}
        </a>
      </div>
    </div>
  );
}
