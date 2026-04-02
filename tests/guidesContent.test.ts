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
