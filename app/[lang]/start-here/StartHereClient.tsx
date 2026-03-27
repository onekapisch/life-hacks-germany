"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Persona = "work" | "expat" | "student" | "local";

const PERSONA_EMOJI: Record<Persona, string> = {
  work: "💼",
  expat: "🌍",
  student: "🎓",
  local: "🏠",
};

type RouteLink = { href: string; label: string; note: string };
type RouteDefinition = {
  label: string;
  kicker: string;
  summary: string;
  links: RouteLink[];
};

export default function StartHereClient({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<Persona>("work");
  const tr = t[lang].startHere;
  const base = `/${lang}`;
  const isEn = lang === "en";

  const routes: Record<Persona, RouteDefinition> = {
    work: {
      label: tr.work,
      kicker: isEn ? "Employer-sponsored move" : "Employer-sponsored Umzug",
      summary: isEn
        ? "Your job is tied to the move. Use this for payroll setup, permit timing, and parallel family admin."
        : "Dein Umzug ist an deinen Job gebunden. Fuer Payroll-Setup, Permit-Timing und Familien-Admin.",
      links: [
        {
          href: `${base}/work-relocation`,
          label: tr.workRelocationGuide,
          note: isEn
            ? "The dedicated corporate-expat route"
            : "Die eigene Route fuer Corporate Expats",
        },
        {
          href: `${base}/guides/bureaucracy/first-14-days`,
          label: tr.first14Days,
          note: isEn
            ? "The sequence that unlocks everything else"
            : "Die Reihenfolge, die alles Weitere entsperrt",
        },
        {
          href: `${base}/tools/gross-net-salary-calculator`,
          label: tr.salaryCheck,
          note: isEn
            ? "Check net pay before salary shock hits"
            : "Netto pruefen, bevor der Gehaltsschock kommt",
        },
        {
          href: `${base}/guides/bureaucracy/blue-card-work-permit`,
          label: tr.workPermit,
          note: isEn
            ? "Permit path, documents, and delay points"
            : "Permit-Pfad, Unterlagen und Verzoegerungen",
        },
      ],
    },
    expat: {
      label: tr.expat,
      kicker: isEn ? "General Germany setup" : "Allgemeiner Deutschland-Start",
      summary: isEn
        ? "Self-managed move. The core Germany admin stack in the right order."
        : "Selbst organisierter Umzug. Der Deutschland-Admin-Stack in der richtigen Reihenfolge.",
      links: [
        {
          href: `${base}/guides/bureaucracy/anmeldung`,
          label: tr.anmeldungChecklist,
          note: isEn
            ? "The legal deadline and address registration flow"
            : "Die Frist und der Ablauf der Adressanmeldung",
        },
        {
          href: `${base}/guides/bureaucracy/steuer-id`,
          label: tr.getTaxId,
          note: isEn
            ? "How your tax ID is issued and where it is used"
            : "Wie die Steuer-ID kommt und wo du sie brauchst",
        },
        {
          href: `${base}/guides/everyday/health-insurance-basics`,
          label: tr.healthBasics,
          note: isEn
            ? "Choose the right insurance path early"
            : "Den richtigen Versicherungsweg frueh waehlen",
        },
        {
          href: `${base}/guides/bureaucracy/first-14-days`,
          label: tr.first14Days,
          note: isEn
            ? "The practical newcomer sequence"
            : "Die praktische Neuankommenden-Reihenfolge",
        },
      ],
    },
    student: {
      label: tr.student,
      kicker: isEn ? "Campus and city life" : "Campus und Stadtleben",
      summary: isEn
        ? "Rent deposit, transport, health insurance, and finance setup — in the order you actually need them."
        : "Kaution, Mobilitaet, Krankenversicherung und Finanz-Setup — in der Reihenfolge, in der du sie brauchst.",
      links: [
        {
          href: `${base}/guides/everyday/university-reality-check-hack`,
          label: isEn ? "University reality check" : "Uni-Realitaetscheck",
          note: isEn
            ? "Use StudyCheck + official data before you commit"
            : "StudyCheck + offizielle Daten vor der Zusage nutzen",
        },
        {
          href: `${base}/guides/mobility/deutschlandticket`,
          label: "Deutschlandticket",
          note: isEn
            ? "When the monthly pass is actually worth it"
            : "Wann sich das Monatsticket wirklich lohnt",
        },
        {
          href: `${base}/guides/housing/mietkaution`,
          label: isEn ? "Rent deposit rules" : "Mietkaution Regeln",
          note: isEn
            ? "Know upfront housing costs before you commit"
            : "Wohnkosten kennen, bevor du zusagst",
        },
        {
          href: `${base}/guides/money-taxes/elster`,
          label: isEn ? "ELSTER setup" : "ELSTER Setup",
          note: isEn
            ? "Set up the tax portal early, even if filing comes later"
            : "Steuerportal frueh einrichten, auch wenn die Abgabe spaeter kommt",
        },
        {
          href: `${base}/guides/everyday/health-insurance-basics`,
          label: tr.healthBasics,
          note: isEn
            ? "Do not let insurance be a hidden blocker"
            : "Versicherung nicht zum versteckten Blocker werden lassen",
        },
      ],
    },
    local: {
      label: tr.local,
      kicker: isEn ? "You already live here" : "Du lebst schon hier",
      summary: isEn
        ? "Already settled. The highest-value recurring rules, deadlines, and annual admin wins."
        : "Schon angekommen. Die wichtigsten Regeln, Fristen und wiederkehrenden Admin-Themen.",
      links: [
        {
          href: `${base}/guides/money-taxes/rundfunkbeitrag`,
          label: "Rundfunkbeitrag",
          note: isEn
            ? "Avoid late fees and understand the household logic"
            : "Spaetgebuehren vermeiden, Haushaltslogik verstehen",
        },
        {
          href: `${base}/guides/housing/kuendigungsfrist-miete`,
          label: tr.noticePeriod,
          note: isEn
            ? "How cancellation timing really works"
            : "Wie Kuendigungsfristen wirklich laufen",
        },
        {
          href: `${base}/guides/money-taxes/tax-return-deadlines`,
          label: tr.taxDeadlines,
          note: isEn
            ? "Stay ahead of timing instead of reacting late"
            : "Fristen voraus sein statt spaet reagieren",
        },
        {
          href: `${base}/guides/money-taxes/tax-return-setup`,
          label: isEn ? "Tax return setup" : "Steuererklaerung vorbereiten",
          note: isEn
            ? "Build a cleaner recurring filing workflow"
            : "Saubereren Filing-Ablauf aufbauen",
        },
      ],
    },
  };

  const personaOrder: Persona[] = ["work", "expat", "student", "local"];
  const activeRoute = routes[active];

  return (
    <>
      <section className="pb-14">
        <div className="container-main">
          <div className="sh-layout">
            {/* ── Left: persona picker ── */}
            <nav className="sh-nav" aria-label={tr.chooseProfile}>
              {personaOrder.map((persona) => {
                const route = routes[persona];
                const selected = active === persona;
                return (
                  <button
                    key={persona}
                    type="button"
                    onClick={() => setActive(persona)}
                    aria-pressed={selected}
                    className={`sh-btn ${selected ? "sh-btn-active" : ""}`}
                  >
                    <span className="sh-btn-emoji" aria-hidden="true">
                      {PERSONA_EMOJI[persona]}
                    </span>
                    <span className="sh-btn-body">
                      <span className="sh-btn-kicker">{route.kicker}</span>
                      <span className="sh-btn-label">{route.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* ── Right: content panel ── */}
            <div
              key={active}
              className="sh-panel animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="sh-panel-head">
                <span className="sh-panel-emoji" aria-hidden="true">
                  {PERSONA_EMOJI[active]}
                </span>
                <div>
                  <h2 className="sh-panel-title">{activeRoute.label}</h2>
                  <p className="sh-panel-summary">{activeRoute.summary}</p>
                </div>
              </div>

              <ol className="sh-steps" aria-label={isEn ? "Action steps" : "Schritte"}>
                {activeRoute.links.map((link, index) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sh-step">
                      <span className="sh-step-num" aria-label={`${index + 1}.`}>
                        {index + 1}
                      </span>
                      <span className="sh-step-body">
                        <span className="sh-step-title">{link.label}</span>
                        <span className="sh-step-note">{link.note}</span>
                      </span>
                      <span className="sh-step-arrow" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
          <div className="content-shell text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-3">
              {tr.nextBuild}
            </h2>
            <p className="text-ink-2 mb-5 max-w-2xl mx-auto">{tr.nextBuildDesc}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={`${base}/guides`} className="btn btn-secondary">
                {tr.browseAll}
              </Link>
              <Link href={`${base}/tools`} className="btn btn-primary">
                {isEn ? "Open practical tools" : "Praktische Tools oeffnen"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
