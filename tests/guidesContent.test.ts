import assert from "node:assert/strict";
import test from "node:test";
import { getGuide } from "../lib/guides";

test("English learn-german guide exists with everyday classification", () => {
  const guide = getGuide("en", "learn-german-in-germany");

  assert.ok(guide, "expected English learn-german guide to exist");
  assert.equal(guide.frontmatter.pillar, "everyday");
  assert.equal(guide.frontmatter.slug, "learn-german-in-germany");
  assert.ok(
    guide.frontmatter.relatedGuides?.includes("first-14-days"),
    "expected English guide to link back to first-14-days",
  );
});

test("English learn-german guide includes required content structure and concepts", () => {
  const guide = getGuide("en", "learn-german-in-germany");

  assert.ok(guide, "expected English learn-german guide to exist");

  assert.match(guide.content, /textbook test prep/i);
  assert.match(guide.content, /streak-based apps/i);
  assert.match(guide.content, /just immerse/i);

  assert.match(guide.content, /### Phase 1: Sounds, spelling, and core phrases/);
  assert.match(guide.content, /### Phase 2: Survival vocabulary for Germany-specific life/);
  assert.match(guide.content, /### Phase 3: Guided input with short dialogues/);
  assert.match(guide.content, /### Phase 4: Targeted grammar/);
  assert.doesNotMatch(guide.content, /### Phase 5:/);
  assert.match(guide.content, /ignoring grammar entirely/i);
  assert.match(guide.content, /studying grammar in isolation before use/i);

  assert.match(guide.content, /pronouns/i);

  assert.match(guide.content, /only apps/i);
  assert.match(guide.content, /only classes/i);
  assert.match(guide.content, /delaying speaking until ready/i);
  assert.match(guide.content, /perfect pronunciation too early/i);
});
