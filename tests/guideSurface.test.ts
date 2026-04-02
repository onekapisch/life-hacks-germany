import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("learn-german guide is surfaced in homepage, guide index, and work-relocation route", () => {
  const home = read("app/[lang]/page.tsx");
  const guidesIndex = read("app/[lang]/guides/page.tsx");
  const workRelocation = read("app/[lang]/work-relocation/page.tsx");

  assert.match(home, /learn-german-in-germany/);
  assert.match(guidesIndex, /learn-german-in-germany/);
  assert.match(workRelocation, /learn-german-in-germany/);
});
