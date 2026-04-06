import type { Lang } from "@/lib/i18n";
import { siteConfig } from "@/lib/i18n";
import { getAllBlogPosts } from "@/lib/blog";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(
  _request: Request,
  context: { params: Promise<{ lang: string }> }
) {
  return context.params.then(({ lang }) => {
    const l = (lang === "de" ? "de" : "en") as Lang;
    const posts = getAllBlogPosts(l);
    const feedTitle =
      l === "en"
        ? "Life Hacks Germany RSS Feed"
        : "Life Hacks Germany RSS-Feed";
    const feedDescription =
      l === "en"
        ? "Verified monthly Germany updates, practical guides, and launch-ready content."
        : "Verifizierte Monatsupdates, praktische Guides und redaktionell gepflegte Inhalte für Deutschland.";
    const feedUrl = `${siteConfig.domain}/${l}/rss.xml`;
    const siteUrl = `${siteConfig.domain}/${l}`;

    const items = posts
      .map((post) => {
        const url = `${siteConfig.domain}/${l}/blog/${post.frontmatter.slug}`;
        const pubDate = new Date(post.frontmatter.published).toUTCString();

        return `
      <item>
        <title>${escapeXml(post.frontmatter.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(post.frontmatter.summary)}</description>
        <pubDate>${pubDate}</pubDate>
      </item>`;
      })
      .join("");

    const latest = posts[0]?.frontmatter.updated ?? new Date().toISOString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>${l === "en" ? "en-US" : "de-DE"}</language>
    <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  });
}
