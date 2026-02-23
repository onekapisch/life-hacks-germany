import type { Metadata } from "next";
import { siteConfig } from "@/lib/i18n";

interface OgImageInput {
  title: string;
  subtitle: string;
  badge?: string;
}

export function createOgImageUrl({ title, subtitle, badge }: OgImageInput): string {
  const params = new URLSearchParams();
  params.set("title", title);
  params.set("subtitle", subtitle);
  if (badge) params.set("badge", badge);
  return `${siteConfig.domain}/api/og?${params.toString()}`;
}

export function createSocialMetadata({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const imageUrl = createOgImageUrl({
    title,
    subtitle: description,
    badge,
  });

  return {
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
