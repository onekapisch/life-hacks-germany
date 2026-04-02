# Learn German In Germany Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual flagship guide about learning German in Germany, surface it on the site's highest-intent entry points, and keep project documentation aligned with the expanded guide inventory.

**Architecture:** Add two new MDX guides under `content/guides`, protect them with a small Node test suite that checks guide existence and surfacing, then thread the new guide through homepage, guide-index, and work-relocation entry points plus two related guides. Finish by updating repo documentation counts and running the full verification set.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, MDX content loaded with `gray-matter`, Node test runner with `tsx`.

---

## File Map

- Create `content/guides/en/learn-german-in-germany.mdx`
  - English flagship guide with frontmatter, official sources, and internal links.
- Create `content/guides/de/learn-german-in-germany.mdx`
  - German counterpart with the same structure and slug.
- Create `tests/guidesContent.test.ts`
  - Verifies the new guide exists in both languages with the expected pillar and related-guide wiring.
- Create `tests/guideSurface.test.ts`
  - Verifies the new slug is surfaced in the homepage, guide index, and work-relocation route files.
- Modify `app/[lang]/page.tsx`
  - Promote the new guide in `getWeeklyQuickRoutes`.
- Modify `app/[lang]/guides/page.tsx`
  - Add the new guide to the high-intent guide list.
- Modify `app/[lang]/work-relocation/page.tsx`
  - Add the new guide to the "best next guides" set for employer-sponsored movers.
- Modify `content/guides/en/first-14-days.mdx`
  - Add a direct internal link for readers whose next blocker is language.
- Modify `content/guides/de/first-14-days.mdx`
  - German counterpart of the same internal-link insertion.
- Modify `content/guides/en/doctor-appointment-booking-hack.mdx`
  - Add a medical-context link to the German-learning guide.
- Modify `content/guides/de/doctor-appointment-booking-hack.mdx`
  - German counterpart of the same internal-link insertion.
- Modify `README.md`
  - Update total guide counts after the new bilingual guide pair lands.
- Modify `AGENTS.md`
  - Update the guide inventory counts in the content model section.
- Modify `CHANGELOG.md`
  - Record the new flagship guide and discovery-surface updates.

Implementation note:

- The repo already has unrelated dirty files in the working tree. Do not revert or restage unrelated user changes while executing this plan.

### Task 1: Add English Guide And Content Smoke Test

**Files:**
- Create: `tests/guidesContent.test.ts`
- Create: `content/guides/en/learn-german-in-germany.mdx`

- [ ] **Step 1: Write the failing English-guide test**

Create `tests/guidesContent.test.ts` with this initial test:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test --import tsx tests/guidesContent.test.ts
```

Expected:

```text
not ok 1 - English learn-german guide exists with everyday classification
```

- [ ] **Step 3: Write the English guide**

Create `content/guides/en/learn-german-in-germany.mdx` with this exact frontmatter:

```mdx
---
title: "How To Learn German After Moving To Germany"
summary: "A survival-first plan for expats who need enough German for housing, appointments, work, and daily life without wasting months on the wrong method."
pillar: "everyday"
slug: "learn-german-in-germany"
updated: "2026-04-02"
forWho: "Expats, students, spouses, and workers who need practical German for life in Germany."
costs: "Core official resources such as Deutsche Welle and vhs-Lernportal are free; paid classes, integration courses, and exams vary by provider and city."
localNotes: "Progress speed depends on your work language, housing setup, social circle, and how much German you hear and use each week."
disclaimer: "Practical educational guidance, not academic language-pedagogy advice."
steps:
  - "Stop treating fluency as the immediate goal and build for daily-life function first."
  - "Use a phased system: sounds and core phrases, survival vocabulary, guided input, then targeted grammar."
  - "Focus first on German for housing, appointments, transport, work, and shopping."
  - "Use official or durable resources before adding optional tools."
  - "Follow a realistic 90-day routine that survives relocation stress and full-time work."
facts:
  - "CEFR levels such as A1, A2, and B1 are used by major German language institutions to describe language proficiency stages."
  - "Deutsche Welle and vhs-Lernportal both provide free German-learning resources that can support self-study."
mistakes:
  - "Treating exam preparation as a complete substitute for daily-life language use."
  - "Relying on passive watching alone as a total beginner."
  - "Ignoring grammar completely or obsessing over grammar before using the language."
sources:
  - label: "Goethe-Institut course and exam levels"
    url: "https://www.goethe.de/resources/files/pdf288/quartale_kurssystem-kompletten.pdf"
  - label: "Deutsche Welle Learn German / Nicos Weg"
    url: "https://static.dw.com/downloads/64698818/230203_DK_Broschuere_DINA5_en_Digital.pdf"
  - label: "BAMF integration course information sheet"
    url: "https://www.bamf.de/SharedDocs/Anlagen/EN/Integration/Integrationskurse/Kursteilnehmer/Merkblaetter/630-121_merkblatt-oeffnung-Integrationskurse.pdf?__blob=publicationFile&v=6"
  - label: "vhs-Lernportal information sheet"
    url: "https://www.vhs-lernportal.de/wws/bin/4007242-4008514-1-infoblatt_berufssprache_deutsch.pdf"
relatedGuides:
  - "first-14-days"
  - "anmeldung"
  - "doctor-appointment-booking-hack"
  - "health-insurance-basics"
  - "essential-germany-app-stack"
---
```

Write the body with these sections, in this order:

1. `## Why learning German in Germany still feels slower than it should`
   - Explain the trap between textbook test prep, streak-based apps, and vague "just immerse" advice.
   - Make the Germany-specific point: people need language for forms, landlords, transport, doctors, and work conversations before abstract fluency.

2. `## What level do you actually need in Germany?`
   - Define A1, A2, and B1 in practical terms.
   - Separate certificate level from real-life comprehension and speaking confidence.
   - End by naming B1 as the point where daily life usually starts feeling materially easier.

3. `## The survival-first roadmap from zero to B1`
   - Break the method into four phases:
     - sounds and sentence patterns
     - Germany survival vocabulary
     - guided input and controlled speaking
     - targeted grammar that unlocks function
   - Reject both bad extremes: "ignore grammar" and "study grammar in isolation first."

4. `## What to learn first if you already live in Germany`
   - Organize this as a domain list:
     - housing and landlord communication
     - registration and appointments
     - doctor, pharmacy, and insurance language
     - transport and station language
     - work basics
     - shopping and service interactions
   - Link to relevant existing guides where helpful.

5. `## How much grammar you actually need early`
   - Call out pronouns, articles, question forms, modal verbs, present tense of common verbs, and basic word order.
   - Mention accusative/dative awareness as a practical need, not a perfection target.

6. `## Resources that are worth your time`
   - Put official or durable resources first:
     - Deutsche Welle / Nicos Weg
     - vhs-Lernportal
     - BAMF integration-course path
     - Goethe-Institut
   - Optional tools can appear after that, but explicitly as secondary support rather than the core system.

7. `## A realistic weekly routine for busy expats`
   - Give a concrete routine built around short daily work and one weekly longer block.
   - Include listening, active recall, short speaking or shadowing, and one Germany-life simulation block.

8. `## Mistakes that keep expats stuck`
   - Include:
     - only apps
     - only classes
     - only exam prep
     - only passive watching
     - delaying speaking until ready
     - chasing perfect pronunciation too early

9. `## A 90-day plan`
   - Provide a practical month-by-month path:
     - first 30 days
     - days 31 to 60
     - days 61 to 90

10. `## What this guide does not promise`
    - Close by explicitly refusing fluency hype and reframing success as lower friction in Germany daily life.

- [ ] **Step 4: Run the English test to verify it passes**

Run:

```bash
node --test --import tsx tests/guidesContent.test.ts
```

Expected:

```text
ok 1 - English learn-german guide exists with everyday classification
```

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/guidesContent.test.ts content/guides/en/learn-german-in-germany.mdx
git commit -m "feat(content): add English learn-german guide"
```

### Task 2: Add German Guide And Language-Parity Test Coverage

**Files:**
- Modify: `tests/guidesContent.test.ts`
- Create: `content/guides/de/learn-german-in-germany.mdx`

- [ ] **Step 1: Extend the test file with German parity checks**

Append these tests to `tests/guidesContent.test.ts`:

```ts
import { getAllGuides } from "../lib/guides";

test("German learn-german guide exists with everyday classification", () => {
  const guide = getGuide("de", "learn-german-in-germany");

  assert.ok(guide, "expected German learn-german guide to exist");
  assert.equal(guide.frontmatter.pillar, "everyday");
  assert.equal(guide.frontmatter.slug, "learn-german-in-germany");
  assert.ok(
    guide.frontmatter.relatedGuides?.includes("first-14-days"),
    "expected German guide to link back to first-14-days",
  );
});

test("guide inventories stay language-balanced after adding the new guide", () => {
  const enSlugs = new Set(getAllGuides("en").map((guide) => guide.frontmatter.slug));
  const deSlugs = new Set(getAllGuides("de").map((guide) => guide.frontmatter.slug));

  assert.ok(enSlugs.has("learn-german-in-germany"));
  assert.ok(deSlugs.has("learn-german-in-germany"));
  assert.deepEqual(
    [...enSlugs].filter((slug) => !deSlugs.has(slug)),
    [],
  );
  assert.deepEqual(
    [...deSlugs].filter((slug) => !enSlugs.has(slug)),
    [],
  );
});
```

- [ ] **Step 2: Run the test file to verify the new cases fail**

Run:

```bash
node --test --import tsx tests/guidesContent.test.ts
```

Expected:

```text
not ok 2 - German learn-german guide exists with everyday classification
```

- [ ] **Step 3: Write the German guide**

Create `content/guides/de/learn-german-in-germany.mdx` with this exact frontmatter:

```mdx
---
title: "Deutsch lernen nach dem Umzug nach Deutschland"
summary: "Ein Survival-Plan fuer Expats, die genug Deutsch fuer Wohnung, Termine, Arbeit und Alltag brauchen, ohne Monate an die falsche Methode zu verlieren."
pillar: "everyday"
slug: "learn-german-in-germany"
updated: "2026-04-02"
forWho: "Expats, Studierende, Partnerinnen und Partner sowie Arbeitnehmende, die praktisches Deutsch fuer den Alltag in Deutschland brauchen."
costs: "Zentrale offizielle Angebote wie Deutsche Welle und vhs-Lernportal sind kostenlos; Kurse, Integrationskurse und Pruefungen unterscheiden sich je nach Anbieter und Stadt."
localNotes: "Dein Tempo haengt stark davon ab, wie viel Deutsch du bei Arbeit, Wohnen, Behoerden, Einkaufen und im sozialen Umfeld wirklich hoerst und nutzt."
disclaimer: "Praktische Lernhilfe, keine wissenschaftliche Sprachdidaktik-Beratung."
steps:
  - "Setze nicht Fluency als Sofortziel, sondern baue zuerst Alltagstauglichkeit auf."
  - "Arbeite in Phasen: Laute und Satzmuster, Survival-Wortschatz, gefuehrter Input und dann gezielte Grammatik."
  - "Lerne zuerst Deutsch fuer Wohnung, Termine, Transport, Arbeit und Einkaufen."
  - "Starte mit offiziellen oder belastbaren Ressourcen und nutze Zusatztools nur als Unterstuetzung."
  - "Folge einem realistischen 90-Tage-System, das auch mit Umzugsstress und Vollzeitjob tragfaehig bleibt."
facts:
  - "CEFR-Stufen wie A1, A2 und B1 werden von grossen Sprachinstitutionen in Deutschland zur Einordnung von Sprachstand verwendet."
  - "Deutsche Welle und vhs-Lernportal stellen kostenlose Deutschlernangebote bereit, die sich fuer selbststaendiges Lernen eignen."
mistakes:
  - "Pruefungsvorbereitung mit alltagstauglichem Deutsch gleichsetzen."
  - "Als kompletter Anfaenger nur passiv zu konsumieren."
  - "Grammatik komplett zu ignorieren oder sie vor jeder echten Nutzung perfektionieren zu wollen."
sources:
  - label: "Goethe-Institut Kurs- und Pruefungsstufen"
    url: "https://www.goethe.de/resources/files/pdf288/quartale_kurssystem-kompletten.pdf"
  - label: "Deutsche Welle Deutsch lernen / Nicos Weg"
    url: "https://static.dw.com/downloads/64698818/230203_DK_Broschuere_DINA5_en_Digital.pdf"
  - label: "BAMF Merkblatt Integrationskurs"
    url: "https://www.bamf.de/SharedDocs/Anlagen/EN/Integration/Integrationskurse/Kursteilnehmer/Merkblaetter/630-121_merkblatt-oeffnung-Integrationskurse.pdf?__blob=publicationFile&v=6"
  - label: "vhs-Lernportal Infoblatt"
    url: "https://www.vhs-lernportal.de/wws/bin/4007242-4008514-1-infoblatt_berufssprache_deutsch.pdf"
relatedGuides:
  - "first-14-days"
  - "anmeldung"
  - "doctor-appointment-booking-hack"
  - "health-insurance-basics"
  - "essential-germany-app-stack"
---
```

Write the German body with the same section structure as the English guide, but keep it natural German rather than a literal translation:

- `## Warum Deutschlernen in Deutschland trotzdem langsam wirken kann`
- `## Welches Niveau du in Deutschland wirklich brauchst`
- `## Der Survival-Plan von Null bis B1`
- `## Was du zuerst lernen solltest, wenn du schon in Deutschland lebst`
- `## Wie viel Grammatik du frueh wirklich brauchst`
- `## Ressourcen, die deine Zeit wirklich wert sind`
- `## Eine realistische Wochenroutine fuer beschaeftigte Expats`
- `## Fehler, die Expats festhaengen lassen`
- `## Ein 90-Tage-Plan`
- `## Was dieser Guide dir bewusst nicht verspricht`

- [ ] **Step 4: Run the expanded test file to verify it passes**

Run:

```bash
node --test --import tsx tests/guidesContent.test.ts
```

Expected:

```text
ok 1 - English learn-german guide exists with everyday classification
ok 2 - German learn-german guide exists with everyday classification
ok 3 - guide inventories stay language-balanced after adding the new guide
```

- [ ] **Step 5: Commit**

Run:

```bash
git add tests/guidesContent.test.ts content/guides/de/learn-german-in-germany.mdx
git commit -m "feat(content): add German learn-german guide"
```

### Task 3: Surface The Guide In High-Intent Entry Points And Add Cross-Links

**Files:**
- Create: `tests/guideSurface.test.ts`
- Modify: `app/[lang]/page.tsx`
- Modify: `app/[lang]/guides/page.tsx`
- Modify: `app/[lang]/work-relocation/page.tsx`
- Modify: `content/guides/en/first-14-days.mdx`
- Modify: `content/guides/de/first-14-days.mdx`
- Modify: `content/guides/en/doctor-appointment-booking-hack.mdx`
- Modify: `content/guides/de/doctor-appointment-booking-hack.mdx`

- [ ] **Step 1: Write the failing surfacing test**

Create `tests/guideSurface.test.ts` with this file-read smoke test:

```ts
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
```

- [ ] **Step 2: Run the surfacing test to verify it fails**

Run:

```bash
node --test --import tsx tests/guideSurface.test.ts
```

Expected:

```text
not ok 1 - learn-german guide is surfaced in homepage, guide index, and work-relocation route
```

- [ ] **Step 3: Promote the guide on the homepage and guide index**

Update `app/[lang]/page.tsx` inside `getWeeklyQuickRoutes` so the fourth quick route becomes the new guide in both languages:

```ts
    {
      href: "/de/guides/everyday/learn-german-in-germany",
      title: "Deutsch lernen in Deutschland",
      note: "Alltagsfaehig von Null bis B1 statt in App-Chaos stecken zu bleiben",
    },
```

```ts
    {
      href: "/en/guides/everyday/learn-german-in-germany",
      title: "Learn German In Germany",
      note: "A survival-first route from zero to B1 for real daily-life use",
    },
```

Update `app/[lang]/guides/page.tsx` so `highIntentGuideSlugs` includes the new slug and drops the weaker offline-GPS slot:

```ts
  const highIntentGuideSlugs = l === "en"
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
      ];
```

- [ ] **Step 4: Add the guide to the work-relocation page and related guides**

Insert this card into both the German and English `guides` arrays in `app/[lang]/work-relocation/page.tsx` directly after the health-insurance card:

```ts
        {
          title: "Deutsch lernen in Deutschland",
          body: "Relevant, wenn Sprache zum naechsten Bottleneck bei Terminen, Wohnung, Arzt oder Job-Alltag wird.",
          href: `${base}/guides/everyday/learn-german-in-germany`,
        },
```

```ts
        {
          title: "Learn German in Germany",
          body: "Use this when language becomes the next bottleneck in appointments, housing, healthcare, or work life.",
          href: `${base}/guides/everyday/learn-german-in-germany`,
        },
```

Add this paragraph near the end of `content/guides/en/first-14-days.mdx`, immediately before `## Risk controls for the full sequence`:

```mdx
If German is the next blocker after your first admin setup, use [How To Learn German After Moving To Germany](/en/guides/everyday/learn-german-in-germany) as your next operating guide. It is built for people who need German for appointments, landlords, transport, and daily life, not just for classes or exams.
```

Add the German counterpart in `content/guides/de/first-14-days.mdx` at the same location:

```mdx
Wenn Deutsch nach dem ersten Admin-Setup dein naechster Engpass ist, nutze [Deutsch lernen nach dem Umzug nach Deutschland](/de/guides/everyday/learn-german-in-germany) als naechsten Arbeitsguide. Er ist fuer Menschen gebaut, die Deutsch fuer Termine, Vermieter, Transport und Alltag brauchen und nicht nur fuer Unterricht oder Pruefungen.
```

Add this checklist item near the end of `content/guides/en/doctor-appointment-booking-hack.mdx`, after the last checkbox bullet:

```mdx
- [ ] If language is slowing you down, build a medical-survival vocabulary track with [How To Learn German After Moving To Germany](/en/guides/everyday/learn-german-in-germany)
```

Add the German counterpart in `content/guides/de/doctor-appointment-booking-hack.mdx` at the same position:

```mdx
- [ ] Wenn Sprache dich ausbremst, baue parallel medizinisches Survival-Deutsch mit [Deutsch lernen nach dem Umzug nach Deutschland](/de/guides/everyday/learn-german-in-germany) auf
```

- [ ] **Step 5: Run the surfacing tests to verify they pass**

Run:

```bash
node --test --import tsx tests/guideSurface.test.ts
```

Expected:

```text
ok 1 - learn-german guide is surfaced in homepage, guide index, and work-relocation route
```

- [ ] **Step 6: Commit**

Run:

```bash
git add tests/guideSurface.test.ts 'app/[lang]/page.tsx' 'app/[lang]/guides/page.tsx' 'app/[lang]/work-relocation/page.tsx' content/guides/en/first-14-days.mdx content/guides/de/first-14-days.mdx content/guides/en/doctor-appointment-booking-hack.mdx content/guides/de/doctor-appointment-booking-hack.mdx
git commit -m "feat(discovery): surface learn-german guide across entry points"
```

### Task 4: Update Documentation And Run Full Verification

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Update the repo docs to match the new guide inventory**

In `README.md`, replace the guide count line with:

```md
- 78 MDX guides total: 39 English, 39 German
```

In `AGENTS.md`, replace the inventory lines with:

```md
- 39 English guides
- 39 German guides
```

Append this entry at the top of `CHANGELOG.md`:

```md
## 2026-04-02

- Added a new flagship bilingual guide on learning German in Germany for expats, students, workers, and spouses who need a survival-first path from zero to B1.
- Surfaced the new guide on the homepage, guides index, work-relocation page, and related admin and healthcare guides.
- Added Node smoke tests that verify the guide exists in both languages and appears on the intended discovery surfaces.
```

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected:

```text
0 problems
```

- [ ] **Step 3: Run the TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected:

```text
no output
```

- [ ] **Step 4: Run the test suite**

Run:

```bash
npm run test
```

Expected:

```text
# pass
```

- [ ] **Step 5: Run the production build**

Run:

```bash
npm run build
```

Expected:

```text
Compiled successfully
```

- [ ] **Step 6: Commit**

Run:

```bash
git add README.md AGENTS.md CHANGELOG.md
git commit -m "docs(content): update guide inventory and changelog"
```

## Self-Review

Spec coverage:

- bilingual flagship guide: covered in Tasks 1 and 2
- homepage promotion: covered in Task 3
- guides index promotion: covered in Task 3
- work-relocation promotion: covered in Task 3
- first-14-days and doctor-guide internal linking: covered in Task 3
- documentation updates and verification: covered in Task 4

Placeholder scan:

- no `TODO`, `TBD`, or vague "add error handling"-style placeholders remain
- each file path is explicit
- each code-changing task includes concrete snippets or frontmatter
- each verification step includes an exact command

Type consistency:

- slug is consistently `learn-german-in-germany`
- pillar is consistently `everyday`
- both tests and content references use the same slug and route shape

