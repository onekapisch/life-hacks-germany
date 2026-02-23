import Link from "next/link";
import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import { getAllBlogPosts } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { createSocialMetadata } from "@/lib/seo";

function formatDate(date: string, lang: Lang): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(parsed);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].blog;
  const social = createSocialMetadata({
    title: tr.title,
    description: tr.subtitle,
    badge: l === "en" ? "Blog" : "Blog",
  });

  return {
    title: tr.title,
    description: tr.subtitle,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/blog`,
      languages: {
        en: `${siteConfig.domain}/en/blog`,
        de: `${siteConfig.domain}/de/blog`,
      },
    },
    ...social,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l = lang as Lang;
  const tr = t[l].blog;
  const posts = getAllBlogPosts(l);
  const base = `/${l}`;

  return (
    <>
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: tr.title, url: `${siteConfig.domain}/${l}/blog` },
          ],
        }}
      />

      <Breadcrumbs lang={l} items={[{ label: tr.title }]} />

      <section className="py-16 md:py-20">
        <div className="container-main max-w-5xl mx-auto text-center">
          <span className="badge mb-5">{tr.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-4">
            {tr.title}
          </h1>
          <p className="text-lg text-ink-2 max-w-4xl mx-auto">{tr.subtitle}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post, index) => (
              <Link
                key={post.frontmatter.slug}
                href={`${base}/blog/${post.frontmatter.slug}`}
                className="content-shell no-underline text-ink hover:border-[rgba(15,23,42,0.16)] transition-colors text-center"
              >
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  {index === 0 && <span className="badge-solid">{tr.latest}</span>}
                  <span className="text-xs uppercase tracking-[0.11em] text-ink-3 font-bold">
                    {formatDate(post.frontmatter.published, l)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-[2rem] leading-[1.1] tracking-tight font-black m-0 mb-3">
                  {post.frontmatter.title}
                </h2>
                <p className="text-ink-2 m-0 mb-4 max-w-3xl mx-auto">{post.frontmatter.summary}</p>
                <div className="flex flex-col gap-1.5 mb-4 max-w-3xl mx-auto">
                  {post.frontmatter.highlights.slice(0, 3).map((highlight) => (
                    <p key={highlight} className="m-0 text-sm text-ink-2">
                      • {highlight}
                    </p>
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-accent-2">
                  {tr.readPost} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
