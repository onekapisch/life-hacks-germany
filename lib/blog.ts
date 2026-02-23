import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "./i18n";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogSource {
  label: string;
  url: string;
}

export interface BlogFrontmatter {
  title: string;
  summary: string;
  slug: string;
  published: string;
  updated: string;
  audience: string;
  highlights: string[];
  sources: BlogSource[];
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
}

function normalizeDateValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return String(value ?? "");
}

export function getBlogPost(lang: Lang, slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, lang, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const normalized: BlogFrontmatter = {
    ...(data as BlogFrontmatter),
    published: normalizeDateValue(data.published),
    updated: normalizeDateValue(data.updated),
  };

  return { frontmatter: normalized, content };
}

export function getAllBlogPosts(lang: Lang): BlogPost[] {
  const dir = path.join(BLOG_DIR, lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => getBlogPost(lang, file.replace(/\.mdx$/, "")))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const byPublished =
        new Date(b.frontmatter.published).getTime() -
        new Date(a.frontmatter.published).getTime();
      if (byPublished !== 0) return byPublished;
      return (
        new Date(b.frontmatter.updated).getTime() -
        new Date(a.frontmatter.updated).getTime()
      );
    });
}

export function getAllBlogSlugs(): { lang: Lang; slug: string }[] {
  const out: { lang: Lang; slug: string }[] = [];

  for (const lang of ["en", "de"] as Lang[]) {
    const dir = path.join(BLOG_DIR, lang);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      out.push({ lang, slug: file.replace(/\.mdx$/, "") });
    }
  }

  return out;
}
