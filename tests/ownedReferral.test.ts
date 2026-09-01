import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { withOwnedReferral } from "../lib/ownedReferral";

const root = process.cwd();

test("owned referrals use the shared Studio network contract", () => {
  const result = new URL(
    withOwnedReferral("https://www.skylocation.app", {
      targetProduct: "skylocation",
      surface: "home-companion",
      content: "skylocation-card",
    })
  );

  assert.deepEqual(Object.fromEntries(result.searchParams), {
    utm_source: "lifehacksgermany.com",
    utm_medium: "owned_referral",
    utm_campaign: "onekapisch_ecosystem",
    utm_content: "skylocation-card",
    source_product: "life-hacks-germany",
    surface: "home-companion",
    target_product: "skylocation",
    campaign: "studio-network",
    placement_version: "1",
  });
});

test("homepage limits the network to Tank Alert and SkyLocation", () => {
  const home = fs.readFileSync(path.join(root, "app/[lang]/page.tsx"), "utf8");

  assert.doesNotMatch(home, /name: "T-Minus AI"/);
  assert.equal((home.match(/name: "SkyLocation"/g) ?? []).length, 2);
  assert.equal((home.match(/name: "Tank Alert"/g) ?? []).length, 0);
  assert.equal((home.match(/targetProduct: "tank-alert"/g) ?? []).length, 1);
  assert.match(home, /Tank Alert is operated by Aeon GbR/);
  assert.match(home, /Tank Alert wird von Aeon GbR betrieben/);
});

test("footer places the Editorial Monogram directly below the brand", () => {
  const footer = fs.readFileSync(path.join(root, "components/Footer.tsx"), "utf8");
  const signature = footer.slice(
    footer.indexOf("href={studioPortfolioHref}"),
    footer.indexOf('t[lang].tagline'),
  );

  assert.match(footer, /\/brand\/onekapisch-signature-mark\.png/);
  assert.match(footer, /A <strong[^>]*>OneKapisch<\/strong> product/);
  assert.match(footer, /aria-label="A OneKapisch product — explore the studio"/);
  assert.doesNotMatch(
    signature,
    /target="_blank"|bg-gradient-to-b|shadow-\[0_0_|uppercase|tracking-\[0\.14em\]/,
  );
  assert.match(footer, /targetProduct: "onekapisch-portfolio"/);
  assert.match(footer, /"https:\/\/www\.onekapisch\.com\/"/);
  assert.doesNotMatch(footer, /onekapisch\.com\/products\//);
  assert.ok(footer.indexOf("A OneKapisch product") < footer.indexOf("t[lang].tagline"));
});
