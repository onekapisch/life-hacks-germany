"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Persona = "expat" | "student" | "local";

export default function StartHereClient({ lang }: { lang: Lang }) {
  const [active, setActive] = useState<Persona | null>(null);
  const tr = t[lang].startHere;
  const base = `/${lang}`;

  const personas: { key: Persona; label: string }[] = [
    { key: "expat", label: tr.expat },
    { key: "student", label: tr.student },
    { key: "local", label: tr.local },
  ];

  const routes: Record<Persona, { title: string; links: { href: string; label: string }[] }> = {
    expat: {
      title: tr.expatPack,
      links: [
        { href: `${base}/guides/bureaucracy/anmeldung`, label: tr.anmeldungChecklist },
        { href: `${base}/guides/bureaucracy/steuer-id`, label: tr.getTaxId },
        { href: `${base}/guides/everyday/health-insurance-basics`, label: tr.healthBasics },
        { href: `${base}/guides/bureaucracy/first-14-days`, label: lang === "en" ? "First 14 Days Checklist" : "Erste 14 Tage Checkliste" },
      ],
    },
    student: {
      title: tr.studentPack,
      links: [
        { href: `${base}/guides/mobility/deutschlandticket`, label: "Deutschlandticket" },
        { href: `${base}/guides/housing/mietkaution`, label: lang === "en" ? "Rent deposit rules" : "Mietkaution Regeln" },
        { href: `${base}/guides/money-taxes/elster`, label: lang === "en" ? "ELSTER setup" : "ELSTER Setup" },
        { href: `${base}/guides/everyday/health-insurance-basics`, label: tr.healthBasics },
      ],
    },
    local: {
      title: tr.localPack,
      links: [
        { href: `${base}/guides/money-taxes/rundfunkbeitrag`, label: "Rundfunkbeitrag" },
        { href: `${base}/guides/housing/kuendigungsfrist-miete`, label: tr.noticePeriod },
        { href: `${base}/guides/money-taxes/tax-return-deadlines`, label: tr.taxDeadlines },
        { href: `${base}/guides/money-taxes/tax-return-setup`, label: lang === "en" ? "Tax return setup" : "Steuererklaerung vorbereiten" },
      ],
    },
  };

  return (
    <>
      <section className="pb-10">
        <div className="container-main">
          <h2 className="text-2xl font-black tracking-tight mb-5">
            {tr.chooseProfile}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {personas.map((p) => (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className={`persona-button py-4 px-5 border font-bold uppercase tracking-[0.08em] text-sm transition-all cursor-pointer ${
                  active === p.key
                    ? "persona-button-active"
                    : ""
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {active && (
            <div className="mt-8 content-shell animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-black tracking-tight mt-0 mb-4">
                {routes[active].title}
              </h3>
              <div className="flex flex-col gap-3">
                {routes[active].links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="glass-card-link p-4 transition-colors no-underline text-ink font-semibold text-sm flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-black text-accent w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                        {i + 1}
                      </span>
                      {link.label}
                    </span>
                    <span className="text-accent-2 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-14">
        <div className="container-main">
          <div className="highlight-band text-center py-8">
            <h2 className="text-2xl font-black tracking-tight mb-3 mt-0">
              {tr.nextBuild}
            </h2>
            <p className="text-ink-2 mb-5 max-w-xl mx-auto">{tr.nextBuildDesc}</p>
            <Link href={`${base}/guides`} className="btn btn-secondary">
              {tr.browseAll}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
