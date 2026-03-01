import type { Lang } from "./i18n";
import { getAllBlogPosts } from "./blog";
import { getAllGuides } from "./guides";
import { getAllOffers } from "./offers";

let cachedLatestDate: string | null = null;

function parseDateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getLatestSiteUpdateDate(): string {
  if (cachedLatestDate) return cachedLatestDate;

  let latest = 0;

  for (const lang of ["en", "de"] as Lang[]) {
    for (const guide of getAllGuides(lang)) {
      latest = Math.max(latest, parseDateValue(guide.frontmatter.updated));
    }

    for (const post of getAllBlogPosts(lang)) {
      latest = Math.max(
        latest,
        parseDateValue(post.frontmatter.updated),
        parseDateValue(post.frontmatter.published)
      );
    }

    for (const offer of getAllOffers(lang)) {
      latest = Math.max(latest, parseDateValue(offer.verifiedAt));
    }
  }

  cachedLatestDate =
    latest > 0
      ? new Date(latest).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  return cachedLatestDate;
}
