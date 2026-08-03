import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("GA4 navigation emits an explicit page_view event", () => {
  const source = readFileSync(
    new URL("../components/AnalyticsPageview.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /window\.gtag\("event",\s*"page_view"/);
});
