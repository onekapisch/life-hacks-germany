import assert from "node:assert/strict";
import test from "node:test";
import * as guidesModule from "../lib/guides";
import type { Guide } from "../lib/guides";
import type { Lang, PillarKey } from "../lib/i18n";

type GetRelatedGuidesForGuide = (
  lang: Lang,
  pillar: PillarKey,
  slug: string,
  manualRelatedSlugs?: string[],
) => Guide[];

function getRelatedGuidesForGuide(
  lang: Lang,
  pillar: PillarKey,
  slug: string,
  manualRelatedSlugs?: string[],
) {
  assert.ok(
    "getRelatedGuidesForGuide" in guidesModule,
    "expected related-guides helper to be exported from lib/guides",
  );

  const helper = Reflect.get(
    guidesModule,
    "getRelatedGuidesForGuide",
  ) as GetRelatedGuidesForGuide | undefined;

  if (typeof helper !== "function") {
    assert.fail("expected related-guides helper to be a function");
  }

  return helper(lang, pillar, slug, manualRelatedSlugs);
}

function assertLearnGermanRelatedGuides(lang: Lang) {
  const guide = guidesModule.getGuide(lang, "learn-german-in-germany");
  assert.ok(guide, `expected ${lang} learn-german guide to exist`);

  const related = getRelatedGuidesForGuide(
    lang,
    guide.frontmatter.pillar,
    guide.frontmatter.slug,
    guide.frontmatter.relatedGuides,
  );

  const relatedSlugs = related.map((item) => item.frontmatter.slug);
  const manualRelatedSlugs = guide.frontmatter.relatedGuides ?? [];

  assert.deepEqual(
    relatedSlugs.slice(0, manualRelatedSlugs.length),
    manualRelatedSlugs,
    "expected manual related guides to lead the list in explicit frontmatter order",
  );
  assert.equal(related[0]?.frontmatter.pillar, "bureaucracy");
  assert.equal(related[1]?.frontmatter.pillar, "bureaucracy");
  assert.ok(
    related
      .slice(manualRelatedSlugs.length)
      .some(
        (item) =>
          item.frontmatter.pillar === guide.frontmatter.pillar &&
          !manualRelatedSlugs.includes(item.frontmatter.slug),
      ),
    "expected same-pillar fallback guides after the manual related block",
  );
  assert.equal(
    new Set(relatedSlugs).size,
    relatedSlugs.length,
    "expected related guides to avoid duplicates",
  );
  assert.ok(
    !relatedSlugs.includes(guide.frontmatter.slug),
    "expected related guides to exclude the current guide",
  );
}

test("English learn-german guide resolves cross-pillar manual related guides before same-pillar fallbacks", () => {
  assertLearnGermanRelatedGuides("en");
});

test("German learn-german guide resolves cross-pillar manual related guides before same-pillar fallbacks", () => {
  assertLearnGermanRelatedGuides("de");
});
