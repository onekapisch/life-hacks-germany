import type { MetadataRoute } from "next";
import { pillars } from "@/lib/i18n";
import { getAllGuides } from "@/lib/guides";
import { getAllBlogPosts } from "@/lib/blog";

const BASE = "https://lifehacksgermany.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const langs = ["en", "de"] as const;
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    "",
    "/start-here",
    "/guides",
    "/tips",
    "/blog",
    "/tools",
    "/about",
    "/editorial-standards",
    "/legal/privacy",
    "/legal/impressum",
  ];

  for (const lang of langs) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE}/${lang}${page}`,
        lastModified: new Date("2026-02-08"),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : page === "/guides" ? 0.9 : 0.7,
        alternates: {
          languages: {
            en: `${BASE}/en${page}`,
            de: `${BASE}/de${page}`,
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
        lastModified: new Date("2026-02-08"),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE}/en/guides/${pillarKey}`,
            de: `${BASE}/de/guides/${pillarKey}`,
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
      entries.push({
        url: `${BASE}/${lang}/guides/${fm.pillar}/${fm.slug}`,
        lastModified: new Date(fm.updated),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${BASE}/en/guides/${fm.pillar}/${fm.slug}`,
            de: `${BASE}/de/guides/${fm.pillar}/${fm.slug}`,
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
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: {
            en: `${BASE}/en/blog/${post.frontmatter.slug}`,
            de: `${BASE}/de/blog/${post.frontmatter.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
