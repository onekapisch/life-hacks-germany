import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang, PillarKey } from "./i18n";

const CONTENT_DIR = path.join(process.cwd(), "content", "guides");

export interface GuideSource {
  label: string;
  url: string;
}

export interface GuideOffer {
  label: string;
  url: string;
  note?: string;
  sponsored?: boolean;
}

export interface GuideFrontmatter {
  title: string;
  summary: string;
  pillar: PillarKey;
  slug: string;
  updated: string;
  forWho: string;
  costs: string;
  localNotes: string;
  disclaimer: string;
  steps: string[];
  facts: string[];
  mistakes: string[];
  sources: GuideSource[];
  offers?: GuideOffer[];
  relatedGuides?: string[];
}

export interface Guide {
  frontmatter: GuideFrontmatter;
  content: string;
}

export function getGuide(lang: Lang, slug: string): Guide | null {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  // gray-matter parses YYYY-MM-DD as Date objects; coerce to string
  if (data.updated instanceof Date) {
    data.updated = data.updated.toISOString().split("T")[0];
  }
  return { frontmatter: data as GuideFrontmatter, content };
}

export function getAllGuides(lang: Lang): Guide[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      return getGuide(lang, slug);
    })
    .filter(Boolean) as Guide[];
}

export function getGuidesByPillar(lang: Lang, pillar: PillarKey): Guide[] {
  return getAllGuides(lang).filter((g) => g.frontmatter.pillar === pillar);
}

export function getAllGuideSlugs(): { lang: Lang; slug: string; pillar: PillarKey }[] {
  const results: { lang: Lang; slug: string; pillar: PillarKey }[] = [];
  for (const lang of ["en", "de"] as Lang[]) {
    const guides = getAllGuides(lang);
    for (const guide of guides) {
      results.push({
        lang,
        slug: guide.frontmatter.slug,
        pillar: guide.frontmatter.pillar,
      });
    }
  }
  return results;
}
