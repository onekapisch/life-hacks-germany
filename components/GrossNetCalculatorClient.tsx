"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analyticsClient";
import {
  calculateGrossNetComparison,
  CITY_ORDER,
  CITY_PRESETS,
  parseLocalizedNumber,
  type CityCosts,
  type CityKey,
  type TaxClass,
} from "@/lib/grossNetCalculator";
type CalcResult = { kind: "success" | "error"; message: string };

export default function GrossNetCalculatorClient({ lang }: { lang: Lang }) {
  const isEn = lang === "en";
  const locale = isEn ? "en-GB" : "de-DE";

  const euro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

  const [salaryGross, setSalaryGross] = useState("");
  const [salaryTaxClass, setSalaryTaxClass] = useState<TaxClass>("I");
  const [salaryHealthRate, setSalaryHealthRate] = useState("17.1");
  const [salaryChurchTax, setSalaryChurchTax] = useState(false);
  const [salaryChildless, setSalaryChildless] = useState(true);
  const [salaryResult, setSalaryResult] = useState<CalcResult | null>(null);

  const [cityA, setCityA] = useState<CityKey>("berlin");
  const [cityB, setCityB] = useState<CityKey>("munich");
  const [costsA, setCostsA] = useState<CityCosts>(CITY_PRESETS.berlin);
  const [costsB, setCostsB] = useState<CityCosts>(CITY_PRESETS.munich);

  const cityLabels: Record<CityKey, string> = isEn
    ? { berlin: "Berlin", munich: "Munich", hamburg: "Hamburg", frankfurt: "Frankfurt", cologne: "Cologne" }
    : { berlin: "Berlin", munich: "München", hamburg: "Hamburg", frankfurt: "Frankfurt", cologne: "Köln" };

  const invalidMessage = isEn
    ? "Please enter valid positive numbers in all required fields."
    : "Bitte gib in allen Pflichtfeldern gültige positive Zahlen ein.";

  const setCityAndPreset = (target: "A" | "B", city: CityKey) => {
    const preset = CITY_PRESETS[city];
    if (target === "A") { setCityA(city); setCostsA(preset); }
    else { setCityB(city); setCostsB(preset); }
  };

  const [breakdown, setBreakdown] = useState<null | {
    gross: number;
    pension: number;
    unemployment: number;
    health: number;
    care: number;
    incomeTax: number;
    solidarity: number;
    churchTax: number;
    monthlyNet: number;
    surplusA: number;
    surplusB: number;
  }>(null);

  const calculate = () => {
    trackEvent("tool_calculate", { tool: "gross_net_city_surplus_standalone", lang });
    const gross = parseLocalizedNumber(salaryGross);
    const comparison = calculateGrossNetComparison({
      grossAnnual: gross,
      taxClass: salaryTaxClass,
      healthRate: parseLocalizedNumber(salaryHealthRate),
      churchTax: salaryChurchTax,
      childlessCare: salaryChildless,
      cityA: costsA,
      cityB: costsB,
    });

    if (!comparison) {
      setSalaryResult({ kind: "error", message: invalidMessage });
      setBreakdown(null);
      return;
    }

    const betterCity =
      comparison.betterCity === null
        ? null
        : comparison.betterCity === "A"
          ? cityLabels[cityA]
          : cityLabels[cityB];

    const message = isEn
      ? `Estimated monthly net: ${euro.format(comparison.monthlyNet)}. ${cityLabels[cityA]} surplus: ${euro.format(comparison.surplusA)}. ${cityLabels[cityB]} surplus: ${euro.format(comparison.surplusB)}.${betterCity ? ` Better monthly balance in ${betterCity} by ${euro.format(comparison.diff)}.` : ""}`
      : `Gesch. monatl. Netto: ${euro.format(comparison.monthlyNet)}. ${cityLabels[cityA]} Überschuss: ${euro.format(comparison.surplusA)}. ${cityLabels[cityB]} Überschuss: ${euro.format(comparison.surplusB)}.${betterCity ? ` Besseres Plus in ${betterCity} um ${euro.format(comparison.diff)}.` : ""}`;

    setSalaryResult({ kind: "success", message });
    setBreakdown({
      gross,
      pension: comparison.pension,
      unemployment: comparison.unemployment,
      health: comparison.health,
      care: comparison.care,
      incomeTax: comparison.incomeTax,
      solidarity: comparison.solidarity,
      churchTax: comparison.churchTax,
      monthlyNet: comparison.monthlyNet,
      surplusA: comparison.surplusA,
      surplusB: comparison.surplusB,
    });
  };

  return (
    <div className="content-shell text-center">
      <h2 className="text-xl font-black tracking-tight mt-0 mb-2">
        {isEn ? "Gross-to-Net + City Surplus Calculator" : "Brutto-Netto + Stadt-Überschuss Rechner"}
      </h2>
      <p className="text-sm text-ink-2 mb-6">
        {isEn
          ? "Estimate your monthly net income after all German taxes and social contributions, then compare your remaining budget in two cities."
          : "Schätze dein monatliches Netto nach allen Steuern und Sozialabgaben und vergleiche dein verbleibendes Budget in zwei Städten."}
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left mb-5">
        {/* Income inputs */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold m-0">
            {isEn ? "Your income" : "Dein Einkommen"}
          </p>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Annual gross salary (EUR)" : "Jahresbrutto (EUR)"}
            </label>
            <input
              type="number"
              value={salaryGross}
              onChange={(e) => setSalaryGross(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              placeholder="65000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Tax class (Steuerklasse)" : "Steuerklasse"}
            </label>
            <select
              value={salaryTaxClass}
              onChange={(e) => setSalaryTaxClass(e.target.value as TaxClass)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
            >
              {(["I", "II", "III", "IV", "V", "VI"] as TaxClass[]).map((tc) => (
                <option key={tc} value={tc}>{tc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Public health rate, % (GKV Beitragssatz)" : "GKV-Beitragssatz (%)"}
            </label>
            <input
              type="number"
              value={salaryHealthRate}
              onChange={(e) => setSalaryHealthRate(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              placeholder="17.1"
              min="0"
              max="30"
              step="0.1"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer">
            <input
              type="checkbox"
              checked={salaryChurchTax}
              onChange={(e) => setSalaryChurchTax(e.target.checked)}
              className="rounded"
            />
            {isEn ? "Apply church tax estimate" : "Kirchensteuer abschätzen"}
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer">
            <input
              type="checkbox"
              checked={salaryChildless}
              onChange={(e) => setSalaryChildless(e.target.checked)}
              className="rounded"
            />
            {isEn ? "Childless (care contribution surcharge)" : "Kinderlos (Pflege-Zuschlag)"}
          </label>
        </div>

        {/* City A */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold m-0">
            {isEn ? "City A — monthly costs" : "Stadt A — Monatskosten"}
          </p>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "City A" : "Stadt A"}
            </label>
            <select
              value={cityA}
              onChange={(e) => setCityAndPreset("A", e.target.value as CityKey)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
            >
              {CITY_ORDER.map((city) => (
                <option key={city} value={city}>{cityLabels[city]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Warm rent (EUR)" : "Warmmiete (EUR)"}
            </label>
            <input
              type="number"
              value={costsA.rent}
              onChange={(e) => setCostsA((prev) => ({ ...prev, rent: parseLocalizedNumber(e.target.value) || 0 }))}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              min="0"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Transport" : "Transport"}</label>
              <input
                type="number"
                value={costsA.transport}
                onChange={(e) => setCostsA((prev) => ({ ...prev, transport: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Groceries" : "Lebensm."}</label>
              <input
                type="number"
                value={costsA.groceries}
                onChange={(e) => setCostsA((prev) => ({ ...prev, groceries: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Utilities" : "Nebenk."}</label>
              <input
                type="number"
                value={costsA.utilities}
                onChange={(e) => setCostsA((prev) => ({ ...prev, utilities: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* City B */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold m-0">
            {isEn ? "City B — monthly costs" : "Stadt B — Monatskosten"}
          </p>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "City B" : "Stadt B"}
            </label>
            <select
              value={cityB}
              onChange={(e) => setCityAndPreset("B", e.target.value as CityKey)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
            >
              {CITY_ORDER.map((city) => (
                <option key={city} value={city}>{cityLabels[city]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Warm rent (EUR)" : "Warmmiete (EUR)"}
            </label>
            <input
              type="number"
              value={costsB.rent}
              onChange={(e) => setCostsB((prev) => ({ ...prev, rent: parseLocalizedNumber(e.target.value) || 0 }))}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              min="0"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Transport" : "Transport"}</label>
              <input
                type="number"
                value={costsB.transport}
                onChange={(e) => setCostsB((prev) => ({ ...prev, transport: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Groceries" : "Lebensm."}</label>
              <input
                type="number"
                value={costsB.groceries}
                onChange={(e) => setCostsB((prev) => ({ ...prev, groceries: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-3 mb-1 font-bold">{isEn ? "Utilities" : "Nebenk."}</label>
              <input
                type="number"
                value={costsB.utilities}
                onChange={(e) => setCostsB((prev) => ({ ...prev, utilities: parseLocalizedNumber(e.target.value) || 0 }))}
                className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <button onClick={calculate} className="btn btn-primary w-full sm:w-auto" type="button">
          {isEn ? "Calculate net income & city surplus" : "Netto und Stadtplus berechnen"}
        </button>

        {salaryResult && (
          <div className={`tool-result w-full ${salaryResult.kind === "error" ? "tool-result-error" : ""}`}>
            {salaryResult.message}
          </div>
        )}

        {breakdown && (
          <div className="w-full text-left grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="content-shell">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-3">
                {isEn ? "Annual deductions breakdown" : "Jährliche Abzüge"}
              </p>
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Pension (9.3%)" : "Rente (9,3%)"}</span><span className="font-bold">{euro.format(breakdown.pension)}</span></div>
                <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Unemployment (1.3%)" : "Arbeitslosigkeit (1,3%)"}</span><span className="font-bold">{euro.format(breakdown.unemployment)}</span></div>
                <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Health insurance" : "Krankenversicherung"}</span><span className="font-bold">{euro.format(breakdown.health)}</span></div>
                <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Care insurance" : "Pflegeversicherung"}</span><span className="font-bold">{euro.format(breakdown.care)}</span></div>
                <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Income tax (est.)" : "Einkommensteuer (gesch.)"}</span><span className="font-bold">{euro.format(breakdown.incomeTax)}</span></div>
                {breakdown.solidarity > 0 && <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Solidarity surcharge" : "Soli"}</span><span className="font-bold">{euro.format(breakdown.solidarity)}</span></div>}
                {breakdown.churchTax > 0 && <div className="flex justify-between"><span className="text-ink-2">{isEn ? "Church tax (est.)" : "Kirchensteuer (gesch.)"}</span><span className="font-bold">{euro.format(breakdown.churchTax)}</span></div>}
                <div className="flex justify-between pt-2 border-t border-[rgba(15,23,42,0.08)] mt-1">
                  <span className="font-black">{isEn ? "Monthly net" : "Monatl. Netto"}</span>
                  <span className="font-black text-accent-2">{euro.format(breakdown.monthlyNet)}</span>
                </div>
              </div>
            </div>
            <div className="content-shell">
              <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-3">
                {isEn ? "City surplus comparison" : "Stadtplus-Vergleich"}
              </p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{cityLabels[cityA]}</span>
                  <span className={`font-black text-base ${breakdown.surplusA >= 0 ? "text-accent-2" : "text-red-500"}`}>
                    {euro.format(breakdown.surplusA)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">{cityLabels[cityB]}</span>
                  <span className={`font-black text-base ${breakdown.surplusB >= 0 ? "text-accent-2" : "text-red-500"}`}>
                    {euro.format(breakdown.surplusB)}
                  </span>
                </div>
                <p className="text-xs text-ink-3 mt-2 m-0">
                  {isEn ? "Surplus = monthly net minus rent, transport, groceries, and utilities." : "Überschuss = Monatsnetto minus Miete, Transport, Lebensmittel und Nebenkosten."}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-ink-3 m-0 max-w-2xl">
          {isEn
            ? "Orientation only. Tax and net income are estimated with simplified assumptions and do not replace payroll or tax advisor calculations. City cost presets are planning estimates."
            : "Nur zur Orientierung. Steuer und Netto werden mit vereinfachten Annahmen geschätzt und ersetzen keine Lohnabrechnung oder Steuerberatung. Stadtkosten sind Planungsschätzungen."}
        </p>
      </div>
    </div>
  );
}
