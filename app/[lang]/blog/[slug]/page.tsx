import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Lang } from "@/lib/i18n";
import { t, siteConfig } from "@/lib/i18n";
import { getBlogPost, getAllBlogPosts, getAllBlogSlugs } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import GuideShareActions from "@/components/GuideShareActions";
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

export async function generateStaticParams() {
  return getAllBlogSlugs();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const post = getBlogPost(l, slug);
  if (!post) return {};

  const social = createSocialMetadata({
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    badge: l === "en" ? "Blog" : "Blog",
  });

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    alternates: {
      canonical: `${siteConfig.domain}/${lang}/blog/${slug}`,
      languages: {
        en: `${siteConfig.domain}/en/blog/${slug}`,
        de: `${siteConfig.domain}/de/blog/${slug}`,
      },
    },
    openGraph: {
      ...social.openGraph,
      url: `${siteConfig.domain}/${lang}/blog/${slug}`,
      type: "article",
      publishedTime: post.frontmatter.published,
      modifiedTime: post.frontmatter.updated,
    },
    twitter: social.twitter,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const l = lang as Lang;
  const tr = t[l].blog;
  const post = getBlogPost(l, slug);
  if (!post) notFound();

  const base = `/${l}`;
  const canonicalUrl = `${siteConfig.domain}/${l}/blog/${slug}`;
  const related = getAllBlogPosts(l).filter((item) => item.frontmatter.slug !== slug).slice(0, 2);

  return (
    <>
      <JsonLd
        type="article"
        lang={l}
        data={{
          title: post.frontmatter.title,
          summary: post.frontmatter.summary,
          updated: post.frontmatter.updated,
          url: canonicalUrl,
        }}
      />
      <JsonLd
        type="breadcrumb"
        lang={l}
        data={{
          items: [
            { name: l === "en" ? "Home" : "Start", url: `${siteConfig.domain}/${l}` },
            { name: tr.title, url: `${siteConfig.domain}/${l}/blog` },
            { name: post.frontmatter.title, url: canonicalUrl },
          ],
        }}
      />

      <Breadcrumbs
        lang={l}
        items={[
          { label: tr.title, href: `${base}/blog` },
          { label: post.frontmatter.title },
        ]}
      />

      <section className="py-14 md:py-16">
        <div className="container-main max-w-4xl mx-auto">
          <span className="badge mb-5">{tr.monthlySeries}</span>
          <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-black leading-[1.08] tracking-tight mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed mb-4">{post.frontmatter.summary}</p>
          <p className="text-sm text-ink-3 mb-4">
            {formatDate(post.frontmatter.published, l)} · {post.frontmatter.audience}
          </p>
          <GuideShareActions lang={l} title={post.frontmatter.title} url={canonicalUrl} />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main max-w-4xl mx-auto">
          <div className="content-shell mb-6">
            <h2 className="text-xl font-black tracking-tight mt-0 mb-4">{tr.highlights}</h2>
            <div className="flex flex-col gap-2">
              {post.frontmatter.highlights.map((highlight) => (
                <p key={highlight} className="m-0 text-sm text-ink-2">
                  • {highlight}
                </p>
              ))}
            </div>
          </div>

          <article className="content-shell guide-prose mb-6">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
              components={{
                a: (props) => (
                  <a
                    {...props}
                    className="text-accent-2 underline underline-offset-4 hover:text-accent"
                    target={props.href?.startsWith("http") ? "_blank" : undefined}
                    rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  />
                ),
              }}
            />
          </article>

          <section className="content-shell mb-6">
            <h2 className="text-xl font-black tracking-tight mt-0 mb-4">{tr.officialSources}</h2>
            <div className="grid grid-cols-1 gap-3">
              {post.frontmatter.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-link p-4 text-sm font-semibold text-accent-2 transition-colors no-underline"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </section>

          <section className="content-shell">
            {related.length > 0 && (
              <>
                <h2 className="text-xl font-black tracking-tight mt-0 mb-4">{tr.latest}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {related.map((item) => (
                    <Link
                      key={item.frontmatter.slug}
                      href={`${base}/blog/${item.frontmatter.slug}`}
                      className="glass-card-link p-4 no-underline text-ink"
                    >
                      <span className="font-bold text-sm">{item.frontmatter.title}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <Link href={`${base}/blog`} className="btn btn-secondary">
              {tr.backToBlog}
            </Link>
          </section>
        </div>
      </section>
    </>
  );
}
