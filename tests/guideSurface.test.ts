import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertIncludes(haystack: string, needle: string, label: string) {
  assert.ok(haystack.includes(needle), `Expected ${label} to include:\n${needle}`);
}

test("homepage surfaces the learn-german quick route in German and English", () => {
  const home = read("app/[lang]/page.tsx");

  assertIncludes(
    home,
    `{
        href: "/de/guides/everyday/learn-german-in-germany",
        title: "Deutsch lernen in Deutschland",
        note: "Alltagsfähig von Null bis B1 statt in App-Chaos stecken zu bleiben",
      }`,
    "homepage German quick route"
  );
  assertIncludes(
    home,
    `{
      href: "/en/guides/everyday/learn-german-in-germany",
      title: "Learn German In Germany",
      note: "A survival-first route from zero to B1 for real daily-life use",
    }`,
    "homepage English quick route"
  );
});

test("guide index promotes learn-german in high-intent slots and removes offline gps", () => {
  const guidesIndex = read("app/[lang]/guides/page.tsx");

  assertIncludes(
    guidesIndex,
    `const highIntentGuideSlugs = l === "en"
    ? [
        "anmeldung",
        "elster",
        "learn-german-in-germany",
        "tax-return-deadlines",
        "family-benefits-kindergeld-elterngeld",
        "kuendigungsfrist-miete",
      ]
    : [
        "anmeldung",
        "elster",
        "learn-german-in-germany",
        "tax-return-deadlines",
        "family-benefits-kindergeld-elterngeld",
        "kuendigungsfrist-miete",
      ];`,
    "guide index highIntentGuideSlugs contract"
  );
  assert.doesNotMatch(
    guidesIndex,
    /highIntentGuideSlugs[\s\S]*offline-gps-safety-hack/,
    "highIntentGuideSlugs should not include offline-gps-safety-hack"
  );
});

test("work-relocation surfaces the learn-german guide card in German and English", () => {
  const workRelocation = read("app/[lang]/work-relocation/page.tsx");

  assertIncludes(
    workRelocation,
    `{
          title: "Deutsch lernen in Deutschland",
          body: "Relevant, wenn Sprache zum nächsten Bottleneck bei Terminen, Wohnung, Arzt oder Job-Alltag wird.",
          href: \`\${base}/guides/everyday/learn-german-in-germany\`,
        }`,
    "work-relocation German guide card"
  );
  assertIncludes(
    workRelocation,
    `{
        title: "Learn German in Germany",
        body: "Use this when language becomes the next bottleneck in appointments, housing, healthcare, or work life.",
        href: \`\${base}/guides/everyday/learn-german-in-germany\`,
      }`,
    "work-relocation English guide card"
  );
});

test("guide mdx cross-links include the learn-german path and preserve first-14-days placement", () => {
  const first14DaysEn = read("content/guides/en/first-14-days.mdx");
  const first14DaysDe = read("content/guides/de/first-14-days.mdx");
  const doctorEn = read("content/guides/en/doctor-appointment-booking-hack.mdx");
  const doctorDe = read("content/guides/de/doctor-appointment-booking-hack.mdx");

  const first14DaysEnParagraph =
    "If German is the next blocker after your first admin setup, use [How To Learn German After Moving To Germany](/en/guides/everyday/learn-german-in-germany) as your next operating guide. It is built for people who need German for appointments, landlords, transport, and daily life, not just for classes or exams.";
  const first14DaysDeParagraph =
    "Wenn Deutsch nach dem ersten Admin-Setup dein nächster Engpass ist, nutze [Deutsch lernen nach dem Umzug nach Deutschland](/de/guides/everyday/learn-german-in-germany) als nächsten Arbeitsguide. Er ist für Menschen gebaut, die Deutsch für Termine, Vermieter, Transport und Alltag brauchen und nicht nur für Unterricht oder Prüfungen.";
  const doctorEnChecklist =
    "- [ ] If language is slowing you down, build a medical-survival vocabulary track with [How To Learn German After Moving To Germany](/en/guides/everyday/learn-german-in-germany)";
  const doctorDeChecklist =
    "- [ ] Wenn Sprache dich ausbremst, baue parallel medizinisches Survival-Deutsch mit [Deutsch lernen nach dem Umzug nach Deutschland](/de/guides/everyday/learn-german-in-germany) auf";

  assertIncludes(
    first14DaysEn,
    `${first14DaysEnParagraph}\n\n## Risk controls for the full sequence`,
    "English first-14-days paragraph immediately before risk controls"
  );
  assertIncludes(
    first14DaysDe,
    `${first14DaysDeParagraph}\n\n## Risikokontrollen für die gesamte Sequenz`,
    "German first-14-days paragraph immediately before risk controls"
  );
  assertIncludes(doctorEn, doctorEnChecklist, "English doctor guide checklist item");
  assertIncludes(doctorDe, doctorDeChecklist, "German doctor guide checklist item");
});
