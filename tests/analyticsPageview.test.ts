import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("GA4 emits one explicit initial page_view and leaves navigation to enhanced measurement", () => {
  const source = readFileSync(
    new URL("../components/AnalyticsPageview.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /window\.gtag\("event",\s*"page_view"/);
  assert.match(source, /didSendInitialGa4Pageview\.current/);
});
