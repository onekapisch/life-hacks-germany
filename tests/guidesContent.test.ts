import assert from "node:assert/strict";
import test from "node:test";
import { getAllGuides, getGuide } from "../lib/guides";

function getLearnGermanGuide() {
  const guide = getGuide("en", "learn-german-in-germany");
  assert.ok(guide, "expected English learn-german guide to exist");
  return guide;
}

function getGermanLearnGermanGuide() {
  const guide = getGuide("de", "learn-german-in-germany");
  assert.ok(guide, "expected German learn-german guide to exist");
  return guide;
}

function getH2Headings(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
}

function getH3Headings(markdown: string) {
  return [...markdown.matchAll(/^### (.+)$/gm)].map((match) => match[1]);
}

function getSection(markdown: string, heading: string) {
  const headings = [...markdown.matchAll(/^## (.+)$/gm)];
  const index = headings.findIndex((match) => match[1] === heading);

  assert.notEqual(index, -1, `expected section "${heading}" to exist`);

  const start = headings[index].index ?? 0;
  const end = headings[index + 1]?.index ?? markdown.length;
  const block = markdown.slice(start, end);
  const firstNewline = block.indexOf("\n");

  return firstNewline === -1 ? "" : block.slice(firstNewline + 1);
}

test("English learn-german guide frontmatter matches the required contract", () => {
  const guide = getLearnGermanGuide();

  assert.equal(guide.frontmatter.title, "How To Learn German After Moving To Germany");
  assert.equal(
    guide.frontmatter.summary,
    "A survival-first plan for expats who need enough German for housing, appointments, work, and daily life without wasting months on the wrong method.",
  );
  assert.equal(guide.frontmatter.pillar, "everyday");
  assert.equal(guide.frontmatter.slug, "learn-german-in-germany");
  assert.equal(guide.frontmatter.updated, "2026-04-02");
  assert.equal(
    guide.frontmatter.forWho,
    "Expats, students, spouses, and workers who need practical German for life in Germany.",
  );
  assert.equal(
    guide.frontmatter.costs,
    "Core official resources such as Deutsche Welle and vhs-Lernportal are free; paid classes, integration courses, and exams vary by provider and city.",
  );
  assert.equal(
    guide.frontmatter.localNotes,
    "Progress speed depends on your work language, housing setup, social circle, and how much German you hear and use each week.",
  );
  assert.equal(
    guide.frontmatter.disclaimer,
    "Practical educational guidance, not academic language-pedagogy advice.",
  );

  assert.deepEqual(guide.frontmatter.steps, [
    "Stop treating fluency as the immediate goal and build for daily-life function first.",
    "Use a phased system: sounds and core phrases, survival vocabulary, guided input, then targeted grammar.",
    "Focus first on German for housing, appointments, transport, work, and shopping.",
    "Use official or durable resources before adding optional tools.",
    "Follow a realistic 90-day routine that survives relocation stress and full-time work.",
  ]);

  assert.deepEqual(guide.frontmatter.facts, [
    "CEFR levels such as A1, A2, and B1 are used by major German language institutions to describe language proficiency stages.",
    "Deutsche Welle and vhs-Lernportal both provide free German-learning resources that can support self-study.",
  ]);

  assert.deepEqual(guide.frontmatter.mistakes, [
    "Treating exam preparation as a complete substitute for daily-life language use.",
    "Relying on passive watching alone as a total beginner.",
    "Ignoring grammar completely or obsessing over grammar before using the language.",
  ]);

  assert.deepEqual(guide.frontmatter.sources, [
    {
      label: "Goethe-Institut course and exam levels",
      url: "https://www.goethe.de/resources/files/pdf288/quartale_kurssystem-kompletten.pdf",
    },
    {
      label: "Deutsche Welle Learn German / Nicos Weg",
      url: "https://static.dw.com/downloads/64698818/230203_DK_Broschuere_DINA5_en_Digital.pdf",
    },
    {
      label: "BAMF integration course information sheet",
      url: "https://www.bamf.de/SharedDocs/Anlagen/EN/Integration/Integrationskurse/Kursteilnehmer/Merkblaetter/630-121_merkblatt-oeffnung-Integrationskurse.pdf?__blob=publicationFile&v=6",
    },
    {
      label: "vhs-Lernportal information sheet",
      url: "https://www.vhs-lernportal.de/wws/bin/4007242-4008514-1-infoblatt_berufssprache_deutsch.pdf",
    },
  ]);

  assert.deepEqual(guide.frontmatter.relatedGuides, [
    "first-14-days",
    "anmeldung",
    "doctor-appointment-booking-hack",
    "health-insurance-basics",
    "essential-germany-app-stack",
  ]);
});

test("English learn-german guide keeps the required section structure and plan-critical concepts", () => {
  const guide = getLearnGermanGuide();
  const headings = getH2Headings(guide.content);

  assert.deepEqual(headings, [
    "Why learning German in Germany still feels slower than it should",
    "What level do you actually need in Germany?",
    "The survival-first roadmap from zero to B1",
    "What to learn first if you already live in Germany",
    "How much grammar you actually need early",
    "Resources that are worth your time",
    "A realistic weekly routine for busy expats",
    "Mistakes that keep expats stuck",
    "A 90-day plan",
    "What this guide does not promise",
  ]);

  const roadmapSection = getSection(guide.content, "The survival-first roadmap from zero to B1");
  assert.deepEqual(getH3Headings(roadmapSection), [
    "Phase 1: Sounds, spelling, and core phrases",
    "Phase 2: Survival vocabulary for Germany-specific life",
    "Phase 3: Guided input with short dialogues",
    "Phase 4: Targeted grammar",
  ]);
  assert.match(roadmapSection, /ignor\w+\s+grammar entirely/i);
  assert.match(roadmapSection, /grammar in isolation before use/i);

  const firstSection = getSection(
    guide.content,
    "Why learning German in Germany still feels slower than it should",
  );
  assert.match(firstSection, /textbook/i);
  assert.match(firstSection, /(test|exam)\s+prep/i);
  assert.match(firstSection, /streak/i);
  assert.match(firstSection, /apps?/i);
  assert.match(firstSection, /immers/i);

  const grammarSection = getSection(guide.content, "How much grammar you actually need early");
  assert.match(grammarSection, /\bpronouns?\b/i);

  const mistakesSection = getSection(guide.content, "Mistakes that keep expats stuck");
  assert.match(mistakesSection, /only apps|apps alone/i);
  assert.match(mistakesSection, /only classes|classes alone/i);
  assert.match(mistakesSection, /delay\w+\s+speaking\s+until\s+ready/i);
  assert.match(mistakesSection, /perfect pronunciation too early|accent perfection/i);
});

test("German learn-german guide frontmatter matches the required contract", () => {
  const guide = getGermanLearnGermanGuide();

  assert.equal(
    guide.frontmatter.title,
    "Deutsch lernen nach dem Umzug nach Deutschland",
  );
  assert.equal(
    guide.frontmatter.summary,
    "Ein Survival-Plan für Expats, die genug Deutsch für Wohnung, Termine, Arbeit und Alltag brauchen, ohne Monate an die falsche Methode zu verlieren.",
  );
  assert.equal(guide.frontmatter.pillar, "everyday");
  assert.equal(guide.frontmatter.slug, "learn-german-in-germany");
  assert.equal(guide.frontmatter.updated, "2026-04-02");
  assert.equal(
    guide.frontmatter.forWho,
    "Expats, Studierende, Partnerinnen und Partner sowie Arbeitnehmende, die praktisches Deutsch für den Alltag in Deutschland brauchen.",
  );
  assert.equal(
    guide.frontmatter.costs,
    "Zentrale offizielle Angebote wie Deutsche Welle und vhs-Lernportal sind kostenlos; Kurse, Integrationskurse und Prüfungen unterscheiden sich je nach Anbieter und Stadt.",
  );
  assert.equal(
    guide.frontmatter.localNotes,
    "Dein Tempo hängt stark davon ab, wie viel Deutsch du bei Arbeit, Wohnen, Behörden, Einkaufen und im sozialen Umfeld wirklich hörst und nutzt.",
  );
  assert.equal(
    guide.frontmatter.disclaimer,
    "Praktische Lernhilfe, keine wissenschaftliche Sprachdidaktik-Beratung.",
  );

  assert.deepEqual(guide.frontmatter.steps, [
    "Setze nicht fließendes Deutsch als Sofortziel, sondern baue zuerst Alltagstauglichkeit auf.",
    "Arbeite in Phasen: Laute und Satzmuster, Survival-Wortschatz, geführter Input und dann gezielte Grammatik.",
    "Lerne zuerst Deutsch für Wohnung, Termine, Transport, Arbeit und Einkaufen.",
    "Starte mit offiziellen oder belastbaren Ressourcen und nutze Zusatztools nur als Unterstützung.",
    "Folge einem realistischen 90-Tage-System, das auch mit Umzugsstress und Vollzeitjob tragfähig bleibt.",
  ]);

  assert.deepEqual(guide.frontmatter.facts, [
    "CEFR-Stufen wie A1, A2 und B1 werden von großen Sprachinstitutionen in Deutschland zur Einordnung von Sprachstand verwendet.",
    "Deutsche Welle und vhs-Lernportal stellen kostenlose Deutschlernangebote bereit, die sich für selbstständiges Lernen eignen.",
  ]);

  assert.deepEqual(guide.frontmatter.mistakes, [
    "Prüfungsvorbereitung mit alltagstauglichem Deutsch gleichsetzen.",
    "Als kompletter Anfänger nur passiv zu konsumieren.",
    "Grammatik komplett zu ignorieren oder sie vor jeder echten Nutzung perfektionieren zu wollen.",
  ]);

  assert.deepEqual(guide.frontmatter.sources, [
    {
      label: "Goethe-Institut Kurs- und Prüfungsstufen",
      url: "https://www.goethe.de/resources/files/pdf288/quartale_kurssystem-kompletten.pdf",
    },
    {
      label: "Deutsche Welle Deutsch lernen / Nicos Weg",
      url: "https://static.dw.com/downloads/64698818/230203_DK_Broschuere_DINA5_en_Digital.pdf",
    },
    {
      label: "BAMF Merkblatt Integrationskurs",
      url: "https://www.bamf.de/SharedDocs/Anlagen/EN/Integration/Integrationskurse/Kursteilnehmer/Merkblaetter/630-121_merkblatt-oeffnung-Integrationskurse.pdf?__blob=publicationFile&v=6",
    },
    {
      label: "vhs-Lernportal Infoblatt",
      url: "https://www.vhs-lernportal.de/wws/bin/4007242-4008514-1-infoblatt_berufssprache_deutsch.pdf",
    },
  ]);

  assert.deepEqual(guide.frontmatter.relatedGuides, [
    "first-14-days",
    "anmeldung",
    "doctor-appointment-booking-hack",
    "health-insurance-basics",
    "essential-germany-app-stack",
  ]);
});

test("German learn-german guide keeps the required section structure", () => {
  const guide = getGermanLearnGermanGuide();
  const headings = getH2Headings(guide.content);

  assert.deepEqual(headings, [
    "Warum Deutschlernen in Deutschland trotzdem langsam wirken kann",
    "Welches Niveau du in Deutschland wirklich brauchst",
    "Der Survival-Plan von Null bis B1",
    "Was du zuerst lernen solltest, wenn du schon in Deutschland lebst",
    "Wie viel Grammatik du früh wirklich brauchst",
    "Ressourcen, die deine Zeit wirklich wert sind",
    "Eine realistische Wochenroutine für beschäftigte Expats",
    "Fehler, die Expats festhängen lassen",
    "Ein 90-Tage-Plan",
    "Was dieser Guide dir bewusst nicht verspricht",
  ]);
});

test("learn-german guide remains available in both languages exactly once", () => {
  const enGuides = getAllGuides("en").filter(
    (guide) => guide.frontmatter.slug === "learn-german-in-germany",
  );
  const deGuides = getAllGuides("de").filter(
    (guide) => guide.frontmatter.slug === "learn-german-in-germany",
  );

  assert.equal(enGuides.length, 1);
  assert.equal(deGuides.length, 1);
  assert.equal(enGuides[0]?.frontmatter.slug, "learn-german-in-germany");
  assert.equal(deGuides[0]?.frontmatter.slug, "learn-german-in-germany");
});
