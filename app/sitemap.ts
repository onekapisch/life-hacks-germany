import type { MetadataRoute } from "next";
import { pillars, siteConfig } from "@/lib/i18n";
import { getAllGuides } from "@/lib/guides";
import { getAllBlogPosts } from "@/lib/blog";
import { getLatestSiteUpdateDate } from "@/lib/siteFreshness";

const BASE = siteConfig.domain;

export default function sitemap(): MetadataRoute.Sitemap {
  const langs = ["en", "de"] as const;
  const entries: MetadataRoute.Sitemap = [];
  const latestSiteUpdate = new Date(getLatestSiteUpdateDate());

  // Static pages — per-page lastmod dates
  const staticPages: { path: string; lastmod: Date }[] = [
    { path: "", lastmod: latestSiteUpdate }, // homepage: guides-driven
    { path: "/start-here", lastmod: new Date("2026-02-01") },
    { path: "/work-relocation", lastmod: new Date("2026-02-01") },
    { path: "/guides", lastmod: new Date("2026-02-01") },
    { path: "/tips", lastmod: new Date("2026-02-01") },
    { path: "/blog", lastmod: latestSiteUpdate }, // updates with new posts
    { path: "/offers", lastmod: new Date("2026-02-01") },
    { path: "/tools", lastmod: new Date("2026-02-01") },
    { path: "/tools/gross-net-salary-calculator", lastmod: new Date("2026-02-01") },
    { path: "/about", lastmod: new Date("2026-01-01") },
    { path: "/editorial-standards", lastmod: new Date("2026-01-01") },
    { path: "/legal/privacy", lastmod: new Date("2026-06-05") },
    { path: "/legal/impressum", lastmod: new Date("2026-01-01") },
  ];

  for (const lang of langs) {
    for (const { path: page, lastmod } of staticPages) {
      entries.push({
        url: `${BASE}/${lang}${page}`,
        lastModified: lastmod,
        alternates: {
          languages: {
            en: `${BASE}/en${page}`,
            de: `${BASE}/de${page}`,
            "x-default": `${BASE}/en${page}`,
          },
        },
      });
    }
  }

  // Pillar pages
  for (const lang of langs) {
    for (const pillarKey of Object.keys(pillars)) {
      entries.push({
        url: `${BASE}/${lang}/guides/${pillarKey}`,
        lastModified: new Date("2026-02-14"),
        alternates: {
          languages: {
            en: `${BASE}/en/guides/${pillarKey}`,
            de: `${BASE}/de/guides/${pillarKey}`,
            "x-default": `${BASE}/en/guides/${pillarKey}`,
          },
        },
      });
    }
  }

  // Guide pages
  for (const lang of langs) {
    const guides = getAllGuides(lang);
    for (const guide of guides) {
      const fm = guide.frontmatter;
      if (fm.draft) continue;
      entries.push({
        url: `${BASE}/${lang}/guides/${fm.pillar}/${fm.slug}`,
        lastModified: new Date(fm.updated),
        alternates: {
          languages: {
            en: `${BASE}/en/guides/${fm.pillar}/${fm.slug}`,
            de: `${BASE}/de/guides/${fm.pillar}/${fm.slug}`,
            "x-default": `${BASE}/en/guides/${fm.pillar}/${fm.slug}`,
          },
        },
      });
    }
  }

  // Blog pages
  for (const lang of langs) {
    const posts = getAllBlogPosts(lang);
    for (const post of posts) {
      entries.push({
        url: `${BASE}/${lang}/blog/${post.frontmatter.slug}`,
        lastModified: new Date(post.frontmatter.updated),
        alternates: {
          languages: {
            en: `${BASE}/en/blog/${post.frontmatter.slug}`,
            de: `${BASE}/de/blog/${post.frontmatter.slug}`,
            "x-default": `${BASE}/en/blog/${post.frontmatter.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
