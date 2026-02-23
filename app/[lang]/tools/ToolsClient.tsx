"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { subtractMonthsClamped } from "@/lib/permitDate";
import { trackEvent } from "@/lib/analyticsClient";
import LastTrainEscapeFinder from "@/components/LastTrainEscapeFinder";

type CalcResult = {
  kind: "success" | "error";
  message: string;
};

type TaxClass = "I" | "II" | "III" | "IV" | "V" | "VI";

type CityKey = "berlin" | "munich" | "hamburg" | "frankfurt" | "cologne";

type CityCosts = {
  rent: number;
  transport: number;
  groceries: number;
  utilities: number;
};

type LaneKey = "mobility" | "money" | "admin";

type NextAction = {
  label: string;
  href: string;
};

type ToolOutcome = {
  title: string;
  message: string;
  lane: LaneKey;
  actions: NextAction[];
};

const CITY_PRESETS: Record<CityKey, CityCosts> = {
  berlin: { rent: 1250, transport: 63, groceries: 340, utilities: 190 },
  munich: { rent: 1700, transport: 63, groceries: 360, utilities: 210 },
  hamburg: { rent: 1450, transport: 63, groceries: 350, utilities: 200 },
  frankfurt: { rent: 1550, transport: 63, groceries: 350, utilities: 200 },
  cologne: { rent: 1350, transport: 63, groceries: 340, utilities: 190 },
};

const CITY_ORDER: CityKey[] = ["berlin", "munich", "hamburg", "frankfurt", "cologne"];

function parseNumber(value: string): number {
  const cleaned = value.trim().replace(",", ".");
  return Number(cleaned);
}

export default function ToolsClient({ lang }: { lang: Lang }) {
  const tr = t[lang].tools;
  const isEn = lang === "en";
  const base = `/${lang}`;

  const locale = isEn ? "en-GB" : "de-DE";
  const euro = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Warmmiete Ratio
  const [rentIncome, setRentIncome] = useState("");
  const [rentWarm, setRentWarm] = useState("");
  const [rentResult, setRentResult] = useState<CalcResult | null>(null);

  // Ticket Comparison
  const [ticketSingle, setTicketSingle] = useState("");
  const [ticketTrips, setTicketTrips] = useState("");
  const [ticketPass, setTicketPass] = useState("63");
  const [ticketResult, setTicketResult] = useState<CalcResult | null>(null);

  // Tax Savings Estimator
  const [taxIncome, setTaxIncome] = useState("");
  const [taxCommute, setTaxCommute] = useState("");
  const [taxExtra, setTaxExtra] = useState("");
  const [taxResult, setTaxResult] = useState<CalcResult | null>(null);

  // Move-In Budget Planner
  const [moveColdRent, setMoveColdRent] = useState("");
  const [moveWarmRent, setMoveWarmRent] = useState("");
  const [moveDepositMonths, setMoveDepositMonths] = useState("3");
  const [moveFurniture, setMoveFurniture] = useState("");
  const [moveOtherCosts, setMoveOtherCosts] = useState("");
  const [moveResult, setMoveResult] = useState<CalcResult | null>(null);

  // Blocked Account Planner
  const [blockedMonthly, setBlockedMonthly] = useState("992");
  const [blockedMonths, setBlockedMonths] = useState("12");
  const [blockedSavings, setBlockedSavings] = useState("");
  const [blockedResult, setBlockedResult] = useState<CalcResult | null>(null);

  // Emergency Fund Runway
  const [runwaySavings, setRunwaySavings] = useState("");
  const [runwaySpend, setRunwaySpend] = useState("");
  const [runwayResult, setRunwayResult] = useState<CalcResult | null>(null);

  // Permit Timeline Planner
  const [permitExpiry, setPermitExpiry] = useState("");
  const [permitBuffer, setPermitBuffer] = useState("4");
  const [permitResult, setPermitResult] = useState<CalcResult | null>(null);

  // Gross-to-net + City Surplus
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

  const invalidMessage = isEn
    ? "Please enter valid positive numbers in all required fields."
    : "Bitte gib in allen Pflichtfeldern gueltige positive Zahlen ein.";

  const cityLabels: Record<CityKey, string> = isEn
    ? {
        berlin: "Berlin",
        munich: "Munich",
        hamburg: "Hamburg",
        frankfurt: "Frankfurt",
        cologne: "Cologne",
      }
    : {
        berlin: "Berlin",
        munich: "Muenchen",
        hamburg: "Hamburg",
        frankfurt: "Frankfurt",
        cologne: "Koeln",
      };

  const [activeLane, setActiveLane] = useState<LaneKey>("mobility");
  const [latestOutcome, setLatestOutcome] = useState<ToolOutcome | null>(null);

  const publishOutcome = (outcome: ToolOutcome) => {
    setLatestOutcome(outcome);
    setActiveLane(outcome.lane);
  };

  const jumpToTool = (toolId: string, lane: LaneKey) => {
    setActiveLane(lane);
    trackEvent("tools_intent_click", { lang, tool: toolId, lane });
    if (typeof window === "undefined") return;
    const el = document.getElementById(toolId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setCityAndPreset = (target: "A" | "B", city: CityKey) => {
    const preset = CITY_PRESETS[city];
    if (target === "A") {
      setCityA(city);
      setCostsA(preset);
      return;
    }
    setCityB(city);
    setCostsB(preset);
  };

  const getTaxClassFactor = (taxClass: TaxClass) => {
    switch (taxClass) {
      case "II":
        return 0.95;
      case "III":
        return 0.72;
      case "IV":
        return 1;
      case "V":
        return 1.35;
      case "VI":
        return 1.45;
      case "I":
      default:
        return 1;
    }
  };

  const calculateIncomeTaxApprox = (taxableIncome: number) => {
    if (taxableIncome <= 12000) return 0;
    if (taxableIncome <= 20000) return (taxableIncome - 12000) * 0.14;
    if (taxableIncome <= 66000) return 1120 + (taxableIncome - 20000) * 0.3;
    if (taxableIncome <= 278000) return 14920 + (taxableIncome - 66000) * 0.42;
    return 103960 + (taxableIncome - 278000) * 0.45;
  };

  const calculateRent = () => {
    trackEvent("tool_calculate", { tool: "rent_ratio", lang });
    const income = parseNumber(rentIncome);
    const warm = parseNumber(rentWarm);

    if (!Number.isFinite(income) || !Number.isFinite(warm) || income <= 0 || warm <= 0) {
      setRentResult({ kind: "error", message: invalidMessage });
      return;
    }

    const ratio = (warm / income) * 100;
    const status = ratio <= 30
      ? (isEn ? "Healthy range" : "Gesunder Bereich")
      : ratio <= 40
        ? (isEn ? "Caution range" : "Achtung")
        : (isEn ? "High-risk range" : "Hohes Risiko");

    const message = isEn
      ? `Warm rent is ${numberFormatter.format(ratio)}% of your net income. ${status}.`
      : `Warmmiete entspricht ${numberFormatter.format(ratio)}% deines Nettoeinkommens. ${status}.`;

    setRentResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Warm rent check completed" : "Warmmiete-Check abgeschlossen",
      message,
      lane: "money",
      actions: [
        { label: isEn ? "Open housing guides" : "Wohn-Guides oeffnen", href: `${base}/guides/housing` },
        { label: isEn ? "Plan move-in budget" : "Einzugsbudget planen", href: "#move-in-budget" },
      ],
    });
  };

  const calculateTicket = () => {
    trackEvent("tool_calculate", { tool: "ticket_compare", lang });
    const single = parseNumber(ticketSingle);
    const trips = parseNumber(ticketTrips);
    const pass = parseNumber(ticketPass);

    if (
      !Number.isFinite(single) ||
      !Number.isFinite(trips) ||
      !Number.isFinite(pass) ||
      single <= 0 ||
      trips <= 0 ||
      pass <= 0
    ) {
      setTicketResult({ kind: "error", message: invalidMessage });
      return;
    }

    const monthlySingles = single * trips;
    const difference = monthlySingles - pass;

    if (difference > 0) {
      const message = isEn
        ? `Single tickets: ${euro.format(monthlySingles)} / month. Pass: ${euro.format(pass)}. You save ${euro.format(difference)} per month with the pass.`
        : `Einzeltickets: ${euro.format(monthlySingles)} pro Monat. Abo: ${euro.format(pass)}. Du sparst ${euro.format(difference)} pro Monat mit dem Abo.`;
      setTicketResult({
        kind: "success",
        message,
      });
      publishOutcome({
        title: isEn ? "Ticket strategy ready" : "Ticket-Strategie bereit",
        message,
        lane: "mobility",
        actions: [
          { label: isEn ? "Use Last Train Finder" : "Last Train Finder nutzen", href: "#last-train-weekend-escape" },
          { label: "Deutschlandticket guide", href: `${base}/guides/mobility/deutschlandticket` },
        ],
      });
      return;
    }

    const message = isEn
      ? `Single tickets are cheaper by ${euro.format(Math.abs(difference))} per month for this route pattern.`
      : `Einzeltickets sind bei diesem Fahrprofil ${euro.format(Math.abs(difference))} pro Monat guenstiger.`;
    setTicketResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Ticket strategy ready" : "Ticket-Strategie bereit",
      message,
      lane: "mobility",
      actions: [
        { label: isEn ? "Try Weekend Escape Finder" : "Weekend Escape Finder starten", href: "#last-train-weekend-escape" },
        { label: "Deutschlandticket guide", href: `${base}/guides/mobility/deutschlandticket` },
      ],
    });
  };

  const calculateTax = () => {
    trackEvent("tool_calculate", { tool: "tax_savings", lang });
    const income = parseNumber(taxIncome);
    const commute = parseNumber(taxCommute);
    const extra = taxExtra.trim() === "" ? 0 : parseNumber(taxExtra);

    if (
      !Number.isFinite(income) ||
      !Number.isFinite(commute) ||
      !Number.isFinite(extra) ||
      income <= 0 ||
      commute < 0 ||
      extra < 0
    ) {
      setTaxResult({ kind: "error", message: invalidMessage });
      return;
    }

    const commuteDeduction = commute * 220 * 0.3;
    const baseDeduction = 1230;
    const totalDeduction = Math.max(baseDeduction, commuteDeduction) + extra;

    const marginalRate = income <= 15000
      ? 0.14
      : income <= 30000
        ? 0.24
        : income <= 60000
          ? 0.32
          : income <= 90000
            ? 0.38
            : 0.42;

    const estimatedRefund = totalDeduction * marginalRate * 0.8;
    const message = isEn
      ? `Estimated deductible amount: ${euro.format(totalDeduction)}. Potential refund: about ${euro.format(estimatedRefund)} (rough estimate).`
      : `Geschaetzter absetzbarer Betrag: ${euro.format(totalDeduction)}. Moegliche Erstattung: etwa ${euro.format(estimatedRefund)} (grobe Schaetzung).`;

    setTaxResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Tax estimate ready" : "Steuer-Schaetzung bereit",
      message,
      lane: "money",
      actions: [
        { label: isEn ? "Open money guides" : "Geld-Guides oeffnen", href: `${base}/guides/money-taxes` },
        { label: isEn ? "Search tax content" : "Steuer-Inhalte suchen", href: `${base}/search?q=tax` },
      ],
    });
  };

  const calculateMoveBudget = () => {
    trackEvent("tool_calculate", { tool: "move_in_budget", lang });
    const coldRent = parseNumber(moveColdRent);
    const warmRent = parseNumber(moveWarmRent);
    const depositMonths = parseNumber(moveDepositMonths);
    const furniture = moveFurniture.trim() === "" ? 0 : parseNumber(moveFurniture);
    const other = moveOtherCosts.trim() === "" ? 0 : parseNumber(moveOtherCosts);

    if (
      !Number.isFinite(coldRent) ||
      !Number.isFinite(warmRent) ||
      !Number.isFinite(depositMonths) ||
      !Number.isFinite(furniture) ||
      !Number.isFinite(other) ||
      coldRent <= 0 ||
      warmRent <= 0 ||
      depositMonths <= 0 ||
      furniture < 0 ||
      other < 0
    ) {
      setMoveResult({ kind: "error", message: invalidMessage });
      return;
    }

    const deposit = coldRent * depositMonths;
    const total = deposit + warmRent + furniture + other;
    const message = isEn
      ? `Estimated move-in total: ${euro.format(total)} (deposit ${euro.format(deposit)} + first warm rent ${euro.format(warmRent)} + setup ${euro.format(furniture + other)}).`
      : `Geschaetzte Einzugssumme: ${euro.format(total)} (Kaution ${euro.format(deposit)} + erste Warmmiete ${euro.format(warmRent)} + Einrichtung/Sonstiges ${euro.format(furniture + other)}).`;

    setMoveResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Move-in budget ready" : "Einzugsbudget bereit",
      message,
      lane: "admin",
      actions: [
        { label: isEn ? "Open housing guides" : "Wohn-Guides oeffnen", href: `${base}/guides/housing` },
        { label: isEn ? "Check rental deposit rules" : "Mietkaution-Regeln", href: `${base}/guides/housing/mietkaution` },
      ],
    });
  };

  const calculateBlockedAccount = () => {
    trackEvent("tool_calculate", { tool: "blocked_account", lang });
    const monthly = parseNumber(blockedMonthly);
    const months = parseNumber(blockedMonths);
    const savings = blockedSavings.trim() === "" ? 0 : parseNumber(blockedSavings);

    if (
      !Number.isFinite(monthly) ||
      !Number.isFinite(months) ||
      !Number.isFinite(savings) ||
      monthly <= 0 ||
      months <= 0 ||
      savings < 0
    ) {
      setBlockedResult({ kind: "error", message: invalidMessage });
      return;
    }

    const required = monthly * months;
    const gap = Math.max(required - savings, 0);
    const message = gap > 0
      ? (isEn
        ? `Required total: ${euro.format(required)}. You still need ${euro.format(gap)}.`
        : `Benoetigte Gesamtsumme: ${euro.format(required)}. Es fehlen noch ${euro.format(gap)}.`)
      : (isEn
        ? `Required total: ${euro.format(required)}. You are already fully funded.`
        : `Benoetigte Gesamtsumme: ${euro.format(required)}. Du bist bereits voll gedeckt.`);

    setBlockedResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Blocked account plan ready" : "Sperrkonto-Plan bereit",
      message,
      lane: "admin",
      actions: [
        { label: isEn ? "Compare providers" : "Anbieter vergleichen", href: `${base}/guides/money-taxes/blocked-account-comparison` },
        { label: isEn ? "Open permit guide" : "Aufenthalts-Guide", href: `${base}/guides/bureaucracy/blue-card-work-permit` },
      ],
    });
  };

  const calculateRunway = () => {
    trackEvent("tool_calculate", { tool: "emergency_runway", lang });
    const savings = parseNumber(runwaySavings);
    const spend = parseNumber(runwaySpend);

    if (!Number.isFinite(savings) || !Number.isFinite(spend) || savings < 0 || spend <= 0) {
      setRunwayResult({ kind: "error", message: invalidMessage });
      return;
    }

    const months = savings / spend;
    const status = months >= 6
      ? (isEn ? "Strong safety buffer" : "Starker Sicherheitspuffer")
      : months >= 3
        ? (isEn ? "Moderate buffer" : "Mittlerer Puffer")
        : (isEn ? "Tight buffer" : "Knapp kalkuliert");

    const message = isEn
      ? `Your emergency runway is about ${numberFormatter.format(months)} months. ${status}.`
      : `Deine finanzielle Notfall-Reichweite liegt bei etwa ${numberFormatter.format(months)} Monaten. ${status}.`;

    setRunwayResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Runway estimate ready" : "Notfallfonds-Schaetzung bereit",
      message,
      lane: "money",
      actions: [
        { label: isEn ? "Open money guides" : "Geld-Guides oeffnen", href: `${base}/guides/money-taxes` },
        { label: isEn ? "Recalculate salary surplus" : "Brutto-Netto neu rechnen", href: "#gross-net-city-surplus" },
      ],
    });
  };

  const calculatePermitTimeline = () => {
    trackEvent("tool_calculate", { tool: "permit_timeline", lang });
    if (!permitExpiry) {
      setPermitResult({
        kind: "error",
        message: isEn
          ? "Please choose your permit expiry date."
          : "Bitte waehle das Ablaufdatum deiner Aufenthaltserlaubnis.",
      });
      return;
    }

    const expiryDate = new Date(`${permitExpiry}T12:00:00`);
    const buffer = parseNumber(permitBuffer);

    if (!Number.isFinite(buffer) || buffer <= 0 || !Number.isInteger(buffer)) {
      setPermitResult({ kind: "error", message: invalidMessage });
      return;
    }

    const latestStart = subtractMonthsClamped(expiryDate, buffer);
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysLeft = Math.ceil((latestStart.getTime() - today.getTime()) / msPerDay);

    if (daysLeft < 0) {
      const message = isEn
        ? `You should have started around ${dateFormatter.format(latestStart)}. Book an appointment urgently.`
        : `Du haettest spaetestens um den ${dateFormatter.format(latestStart)} starten sollen. Bitte dringend Termin buchen.`;
      setPermitResult({
        kind: "error",
        message,
      });
      publishOutcome({
        title: isEn ? "Permit timeline warning" : "Aufenthaltsfrist Warnung",
        message,
        lane: "admin",
        actions: [
          { label: isEn ? "Open permit guide" : "Aufenthalts-Guide oeffnen", href: `${base}/guides/bureaucracy/blue-card-work-permit` },
          { label: isEn ? "Open bureaucracy guides" : "Buerokratie-Guides", href: `${base}/guides/bureaucracy` },
        ],
      });
      return;
    }

    const message = isEn
      ? `Target start date: ${dateFormatter.format(latestStart)} (${daysLeft} days left).`
      : `Empfohlener Starttermin: ${dateFormatter.format(latestStart)} (noch ${daysLeft} Tage).`;
    setPermitResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "Permit timeline ready" : "Aufenthalts-Zeitplan bereit",
      message,
      lane: "admin",
      actions: [
        { label: isEn ? "Open permit guide" : "Aufenthalts-Guide oeffnen", href: `${base}/guides/bureaucracy/blue-card-work-permit` },
        { label: isEn ? "Open deadlines guide" : "Fristen-Guide", href: `${base}/guides/bureaucracy/bureaucracy-deadline-tracker-hack` },
      ],
    });
  };

  const calculateGrossNetAndSurplus = () => {
    trackEvent("tool_calculate", { tool: "gross_net_city_surplus", lang });
    const gross = parseNumber(salaryGross);
    const healthRate = parseNumber(salaryHealthRate);

    const allCosts = [...Object.values(costsA), ...Object.values(costsB)];
    if (
      !Number.isFinite(gross) ||
      !Number.isFinite(healthRate) ||
      gross <= 0 ||
      healthRate <= 0 ||
      healthRate > 30 ||
      allCosts.some((v) => !Number.isFinite(v) || v < 0)
    ) {
      setSalaryResult({ kind: "error", message: invalidMessage });
      return;
    }

    const pension = gross * 0.093;
    const unemployment = gross * 0.013;
    const health = gross * ((healthRate / 100) / 2);
    const care = gross * (salaryChildless ? 0.024 : 0.018);
    const socialContributions = pension + unemployment + health + care;

    const taxable = Math.max(gross - socialContributions - 12000, 0);
    const estimatedTaxBase = calculateIncomeTaxApprox(taxable);
    const incomeTax = estimatedTaxBase * getTaxClassFactor(salaryTaxClass);
    const solidarity = incomeTax > 18000 ? incomeTax * 0.055 : 0;
    const churchTax = salaryChurchTax ? incomeTax * 0.09 : 0;

    const annualNet = Math.max(gross - socialContributions - incomeTax - solidarity - churchTax, 0);
    const monthlyNet = annualNet / 12;

    const totalA = costsA.rent + costsA.transport + costsA.groceries + costsA.utilities;
    const totalB = costsB.rent + costsB.transport + costsB.groceries + costsB.utilities;
    const surplusA = monthlyNet - totalA;
    const surplusB = monthlyNet - totalB;

    const betterCity = surplusA === surplusB ? null : surplusA > surplusB ? cityLabels[cityA] : cityLabels[cityB];
    const betterDifference = Math.abs(surplusA - surplusB);
    const message = isEn
      ? `Estimated monthly net: ${euro.format(monthlyNet)}. ${cityLabels[cityA]} surplus: ${euro.format(surplusA)}. ${cityLabels[cityB]} surplus: ${euro.format(surplusB)}.${betterCity ? ` Better monthly balance in ${betterCity} by ${euro.format(betterDifference)}.` : ""}`
      : `Geschaetztes monatliches Netto: ${euro.format(monthlyNet)}. Ueberschuss in ${cityLabels[cityA]}: ${euro.format(surplusA)}. Ueberschuss in ${cityLabels[cityB]}: ${euro.format(surplusB)}.${betterCity ? ` Besseres Monatsplus in ${betterCity} mit ${euro.format(betterDifference)} Unterschied.` : ""}`;

    setSalaryResult({
      kind: "success",
      message,
    });
    publishOutcome({
      title: isEn ? "City surplus snapshot ready" : "Stadt-Ueberschuss bereit",
      message,
      lane: "money",
      actions: [
        { label: isEn ? "Open cost guides" : "Kosten-Guides oeffnen", href: `${base}/guides/money-taxes` },
        { label: isEn ? "Compare housing costs" : "Wohnkosten vergleichen", href: "#move-in-budget" },
      ],
    });
  };

  return (
    <div className="tools-studio-shell">
      <div className="content-shell tools-command-shell">
        <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
          {isEn ? "Decision Studio" : "Decision Studio"}
        </p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-3">
          {isEn ? "What do you want to solve today?" : "Was willst du heute loesen?"}
        </h2>
        <p className="text-ink-2 m-0 mb-5">
          {isEn
            ? "Pick an intent and jump directly to the right tool lane. No browsing maze, just action."
            : "Waehle eine Absicht und spring direkt in die passende Tool-Lane. Kein Suchchaos, nur Aktion."}
        </p>
        <div className="tools-intent-grid">
          <button type="button" className="tools-intent-chip" onClick={() => jumpToTool("last-train-weekend-escape", "mobility")}>
            {isEn ? "Get Home Tonight" : "Heute Nacht heim"}
          </button>
          <button type="button" className="tools-intent-chip" onClick={() => jumpToTool("last-train-weekend-escape", "mobility")}>
            {isEn ? "Plan Weekend" : "Wochenende planen"}
          </button>
          <button type="button" className="tools-intent-chip" onClick={() => jumpToTool("gross-net-city-surplus", "money")}>
            {isEn ? "Cut Monthly Costs" : "Monatliche Kosten senken"}
          </button>
          <button type="button" className="tools-intent-chip" onClick={() => jumpToTool("move-in-budget", "admin")}>
            {isEn ? "Move-In Planning" : "Einzug planen"}
          </button>
          <button type="button" className="tools-intent-chip" onClick={() => jumpToTool("permit-timeline", "admin")}>
            {isEn ? "Deadlines & Permits" : "Fristen & Aufenthalt"}
          </button>
        </div>
      </div>

      <div className="tools-studio-layout">
        <div className="tools-studio-main">
          <section id="lane-mobility" className={`tools-lane ${activeLane === "mobility" ? "tools-lane-active" : ""}`}>
            <div className="tools-lane-header">
              <span className="badge">{isEn ? "Lane 1" : "Lane 1"}</span>
              <h3 className="text-2xl font-black tracking-tight m-0">{isEn ? "Mobility Now" : "Mobilitaet jetzt"}</h3>
              <p className="text-sm text-ink-2 m-0">
                {isEn
                  ? "Real-time travel choices for late returns and weekend escapes."
                  : "Live-Reiseentscheidungen fuer spaete Heimfahrten und Wochenendtrips."}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LastTrainEscapeFinder
                lang={lang}
                onInsight={(insight) =>
                  publishOutcome({
                    ...insight,
                    lane: "mobility",
                  })}
              />

              <div id="ticket-cost-comparison" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{tr.ticketTitle}</h2>
                <p className="text-sm text-ink-2 mb-5">{tr.ticketSummary}</p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.ticketSingle}</label>
                    <input
                      type="number"
                      value={ticketSingle}
                      onChange={(e) => setTicketSingle(e.target.value)}
                      className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                      placeholder="3.20"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.ticketTrips}</label>
                    <input
                      type="number"
                      value={ticketTrips}
                      onChange={(e) => setTicketTrips(e.target.value)}
                      className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                      placeholder="40"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                      {isEn ? "Monthly pass price (EUR)" : "Monatsabo-Preis (EUR)"}
                    </label>
                    <input
                      type="number"
                      value={ticketPass}
                      onChange={(e) => setTicketPass(e.target.value)}
                      className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                      placeholder="63"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button onClick={calculateTicket} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {ticketResult && (
                    <div className={`tool-result ${ticketResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {ticketResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section id="lane-money" className={`tools-lane ${activeLane === "money" ? "tools-lane-active" : ""}`}>
            <div className="tools-lane-header">
              <span className="badge">{isEn ? "Lane 2" : "Lane 2"}</span>
              <h3 className="text-2xl font-black tracking-tight m-0">{isEn ? "Money & Cost Planning" : "Geld & Kostenplanung"}</h3>
              <p className="text-sm text-ink-2 m-0">
                {isEn
                  ? "Estimate net income, rent pressure, tax upside, and runway in one sequence."
                  : "Nettoeinkommen, Mietdruck, Steuerpotenzial und Notfallpuffer in einer Reihenfolge."}
              </p>
            </div>

            <div id="gross-net-city-surplus" className="content-shell scroll-mt-28 text-center">
              <h2 className="text-xl font-black tracking-tight mt-0 mb-2">
                {isEn ? "Gross-to-Net + City Surplus Calculator" : "Brutto-Netto + Stadt-Ueberschuss Rechner"}
              </h2>
              <p className="text-sm text-ink-2 mb-5">
                {isEn
                  ? "Estimate monthly net income and compare your remaining monthly budget across two German cities. Presets are editable planning values."
                  : "Schaetze dein monatliches Nettoeinkommen und vergleiche dein Monatsplus in zwei deutschen Staedten. Die Presets sind editierbare Planungswerte."}
              </p>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Annual gross salary (EUR)" : "Jahresbrutto (EUR)"}</label>
                    <input type="number" value={salaryGross} onChange={(e) => setSalaryGross(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="65000" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Tax class" : "Steuerklasse"}</label>
                    <select value={salaryTaxClass} onChange={(e) => setSalaryTaxClass(e.target.value as TaxClass)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors">
                      {(["I", "II", "III", "IV", "V", "VI"] as TaxClass[]).map((taxClass) => (
                        <option key={taxClass} value={taxClass}>{taxClass}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Public health rate (%)" : "GKV-Beitragssatz (%)"}</label>
                    <input type="number" value={salaryHealthRate} onChange={(e) => setSalaryHealthRate(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="17.1" min="0" max="30" step="0.1" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ink-2">
                    <input type="checkbox" checked={salaryChurchTax} onChange={(e) => setSalaryChurchTax(e.target.checked)} />
                    {isEn ? "Apply church tax estimate" : "Kirchensteuer abschaetzen"}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-2">
                    <input type="checkbox" checked={salaryChildless} onChange={(e) => setSalaryChildless(e.target.checked)} />
                    {isEn ? "Childless (care contribution surcharge)" : "Kinderlos (Pflege-Zuschlag)"}
                  </label>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "City A" : "Stadt A"}</label>
                    <select value={cityA} onChange={(e) => setCityAndPreset("A", e.target.value as CityKey)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors">
                      {CITY_ORDER.map((city) => (
                        <option key={city} value={city}>{cityLabels[city]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Warm rent (EUR)" : "Warmmiete (EUR)"}</label>
                    <input type="number" value={costsA.rent} onChange={(e) => setCostsA((prev) => ({ ...prev, rent: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="number" value={costsA.transport} onChange={(e) => setCostsA((prev) => ({ ...prev, transport: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Transport" : "Transport"} />
                    <input type="number" value={costsA.groceries} onChange={(e) => setCostsA((prev) => ({ ...prev, groceries: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Groceries" : "Lebensmittel"} />
                    <input type="number" value={costsA.utilities} onChange={(e) => setCostsA((prev) => ({ ...prev, utilities: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Utilities" : "Nebenkosten"} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "City B" : "Stadt B"}</label>
                    <select value={cityB} onChange={(e) => setCityAndPreset("B", e.target.value as CityKey)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors">
                      {CITY_ORDER.map((city) => (
                        <option key={city} value={city}>{cityLabels[city]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Warm rent (EUR)" : "Warmmiete (EUR)"}</label>
                    <input type="number" value={costsB.rent} onChange={(e) => setCostsB((prev) => ({ ...prev, rent: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="number" value={costsB.transport} onChange={(e) => setCostsB((prev) => ({ ...prev, transport: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Transport" : "Transport"} />
                    <input type="number" value={costsB.groceries} onChange={(e) => setCostsB((prev) => ({ ...prev, groceries: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Groceries" : "Lebensmittel"} />
                    <input type="number" value={costsB.utilities} onChange={(e) => setCostsB((prev) => ({ ...prev, utilities: parseNumber(e.target.value) || 0 }))} className="glass-input w-full px-3 py-2.5 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" placeholder={isEn ? "Utilities" : "Nebenkosten"} />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <button onClick={calculateGrossNetAndSurplus} className="btn btn-primary w-full sm:w-auto" type="button">{tr.calculate}</button>
                {salaryResult && (
                  <div className={`tool-result ${salaryResult.kind === "error" ? "tool-result-error" : ""}`}>
                    {salaryResult.message}
                  </div>
                )}
                <p className="text-xs text-ink-3 m-0">
                  {isEn
                    ? "Orientation only. Tax and net income are estimated with simplified assumptions and do not replace payroll or tax advisor calculations."
                    : "Nur zur Orientierung. Steuer und Netto werden mit vereinfachten Annahmen geschaetzt und ersetzen keine Lohnabrechnung oder Steuerberatung."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div id="warmmiete-ratio" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{tr.rentTitle}</h2>
                <p className="text-sm text-ink-2 mb-5">{tr.rentSummary}</p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.rentIncome}</label>
                    <input type="number" value={rentIncome} onChange={(e) => setRentIncome(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="2500" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.rentWarm}</label>
                    <input type="number" value={rentWarm} onChange={(e) => setRentWarm(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="850" min="0" />
                  </div>
                  <button onClick={calculateRent} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {rentResult && (
                    <div className={`tool-result ${rentResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {rentResult.message}
                    </div>
                  )}
                </div>
              </div>

              <div id="tax-return-savings" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{tr.taxTitle}</h2>
                <p className="text-sm text-ink-2 mb-5">{tr.taxSummary}</p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.taxIncome}</label>
                    <input type="number" value={taxIncome} onChange={(e) => setTaxIncome(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="45000" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{tr.taxCommute}</label>
                    <input type="number" value={taxCommute} onChange={(e) => setTaxCommute(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="15" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                      {isEn ? "Extra deductible costs (EUR, optional)" : "Zusatzkosten fuer Absetzungen (EUR, optional)"}
                    </label>
                    <input type="number" value={taxExtra} onChange={(e) => setTaxExtra(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="450" min="0" />
                  </div>
                  <button onClick={calculateTax} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {taxResult && (
                    <div className={`tool-result ${taxResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {taxResult.message}
                    </div>
                  )}
                </div>
              </div>

              <div id="emergency-fund-runway" className="content-shell scroll-mt-28 text-center lg:col-span-2">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{isEn ? "Emergency Fund Runway" : "Notfallfonds-Reichweite"}</h2>
                <p className="text-sm text-ink-2 mb-5">
                  {isEn ? "Check how many months your savings can cover essentials." : "Pruefe, wie viele Monate deine Ersparnisse die Fixkosten tragen koennen."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Available savings (EUR)" : "Verfuegbare Ersparnisse (EUR)"}</label>
                    <input type="number" value={runwaySavings} onChange={(e) => setRunwaySavings(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="6000" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Monthly essentials (EUR)" : "Monatliche Fixkosten (EUR)"}</label>
                    <input type="number" value={runwaySpend} onChange={(e) => setRunwaySpend(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="1400" min="0" />
                  </div>
                  <button onClick={calculateRunway} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                </div>
                {runwayResult && (
                  <div className={`tool-result mt-4 ${runwayResult.kind === "error" ? "tool-result-error" : ""}`}>
                    {runwayResult.message}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="lane-admin" className={`tools-lane ${activeLane === "admin" ? "tools-lane-active" : ""}`}>
            <div className="tools-lane-header">
              <span className="badge">{isEn ? "Lane 3" : "Lane 3"}</span>
              <h3 className="text-2xl font-black tracking-tight m-0">{isEn ? "Admin & Deadline Safety" : "Verwaltung & Fristensicherheit"}</h3>
              <p className="text-sm text-ink-2 m-0">
                {isEn
                  ? "Plan move-in costs, permits, and mandatory account requirements without missing deadlines."
                  : "Plane Einzugskosten, Aufenthalt und Pflichtkonten ohne Fristen zu verpassen."}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div id="move-in-budget" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{isEn ? "Move-In Budget Planner" : "Einzugsbudget-Planer"}</h2>
                <p className="text-sm text-ink-2 mb-5">
                  {isEn ? "Estimate your upfront housing cash need: deposit, first month, and setup." : "Schaetze deinen Startbedarf fuer Wohnung: Kaution, erste Miete und Einrichtung."}
                </p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Cold rent (EUR)" : "Kaltmiete (EUR)"}</label>
                    <input type="number" value={moveColdRent} onChange={(e) => setMoveColdRent(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="700" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "First warm rent (EUR)" : "Erste Warmmiete (EUR)"}</label>
                    <input type="number" value={moveWarmRent} onChange={(e) => setMoveWarmRent(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="920" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Deposit in rent months" : "Kaution in Monatsmieten"}</label>
                    <input type="number" value={moveDepositMonths} onChange={(e) => setMoveDepositMonths(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="3" min="0" step="1" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Furniture/setup (EUR, optional)" : "Moebel/Setup (EUR, optional)"}</label>
                    <input type="number" value={moveFurniture} onChange={(e) => setMoveFurniture(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="1200" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Other admin/moving costs (EUR, optional)" : "Sonstige Verwaltungs-/Umzugskosten (EUR, optional)"}</label>
                    <input type="number" value={moveOtherCosts} onChange={(e) => setMoveOtherCosts(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="350" min="0" />
                  </div>
                  <button onClick={calculateMoveBudget} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {moveResult && (
                    <div className={`tool-result ${moveResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {moveResult.message}
                    </div>
                  )}
                </div>
              </div>

              <div id="permit-timeline" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{isEn ? "Permit Timeline Planner" : "Aufenthaltstitel-Zeitplaner"}</h2>
                <p className="text-sm text-ink-2 mb-5">
                  {isEn ? "Set your latest safe start date for renewal appointments." : "Setze deinen spaetesten sicheren Starttermin fuer Verlaengerungstermine."}
                </p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Permit expiry date" : "Ablaufdatum Aufenthaltstitel"}</label>
                    <input type="date" value={permitExpiry} onChange={(e) => setPermitExpiry(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Buffer months before expiry" : "Puffer-Monate vor Ablauf"}</label>
                    <input type="number" value={permitBuffer} onChange={(e) => setPermitBuffer(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="1" step="1" />
                  </div>
                  <button onClick={calculatePermitTimeline} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {permitResult && (
                    <div className={`tool-result ${permitResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {permitResult.message}
                    </div>
                  )}
                </div>
              </div>

              <div id="blocked-account" className="content-shell scroll-mt-28 text-center">
                <h2 className="text-lg font-black tracking-tight mt-0 mb-2">{isEn ? "Blocked Account Planner" : "Sperrkonto-Planer"}</h2>
                <p className="text-sm text-ink-2 mb-5">
                  {isEn ? "Helpful for student visa prep: estimate required amount and funding gap." : "Hilfreich fuer studentische Visa-Vorbereitung: benoetigte Summe und Luecke schaetzen."}
                </p>
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Required monthly amount (EUR)" : "Monatlich geforderter Betrag (EUR)"}</label>
                    <input type="number" value={blockedMonthly} onChange={(e) => setBlockedMonthly(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Number of months" : "Anzahl Monate"}</label>
                    <input type="number" value={blockedMonths} onChange={(e) => setBlockedMonths(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" min="0" step="1" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">{isEn ? "Current savings (EUR, optional)" : "Aktuelle Ersparnisse (EUR, optional)"}</label>
                    <input type="number" value={blockedSavings} onChange={(e) => setBlockedSavings(e.target.value)} className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors" placeholder="5000" min="0" />
                  </div>
                  <button onClick={calculateBlockedAccount} className="btn btn-primary w-full" type="button">{tr.calculate}</button>
                  {blockedResult && (
                    <div className={`tool-result ${blockedResult.kind === "error" ? "tool-result-error" : ""}`}>
                      {blockedResult.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="notice text-center">
            {isEn
              ? "These tools provide orientation only and do not replace legal, tax, or immigration advice."
              : "Diese Tools dienen nur der Orientierung und ersetzen keine Rechts-, Steuer- oder Migrationsberatung."}
          </div>
        </div>

        <aside className="content-shell tools-action-rail">
          <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
            {isEn ? "Tool map" : "Tool-Navigation"}
          </p>
          <div className="flex flex-col gap-2 mb-5">
            <button type="button" className={`tools-rail-link ${activeLane === "mobility" ? "tools-rail-link-active" : ""}`} onClick={() => jumpToTool("lane-mobility", "mobility")}>
              {isEn ? "Mobility now" : "Mobilitaet jetzt"}
            </button>
            <button type="button" className={`tools-rail-link ${activeLane === "money" ? "tools-rail-link-active" : ""}`} onClick={() => jumpToTool("lane-money", "money")}>
              {isEn ? "Money & cost planning" : "Geld & Kostenplanung"}
            </button>
            <button type="button" className={`tools-rail-link ${activeLane === "admin" ? "tools-rail-link-active" : ""}`} onClick={() => jumpToTool("lane-admin", "admin")}>
              {isEn ? "Admin & deadlines" : "Verwaltung & Fristen"}
            </button>
          </div>

          <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
            {isEn ? "Latest result" : "Letztes Ergebnis"}
          </p>
          {latestOutcome ? (
            <div className="tools-latest-outcome">
              <h4 className="text-base font-black mt-0 mb-2">{latestOutcome.title}</h4>
              <p className="text-sm text-ink-2 mt-0 mb-3">{latestOutcome.message}</p>
              <div className="flex flex-col gap-2">
                {latestOutcome.actions.map((action) => (
                  action.href.startsWith("#") ? (
                    <button
                      key={action.href + action.label}
                      type="button"
                      className="btn btn-secondary w-full"
                      onClick={() => jumpToTool(action.href.replace("#", ""), latestOutcome.lane)}
                    >
                      {action.label}
                    </button>
                  ) : (
                    <a
                      key={action.href + action.label}
                      href={action.href}
                      target={action.href.startsWith("http") ? "_blank" : undefined}
                      rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="btn btn-secondary w-full text-center"
                    >
                      {action.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="notice text-sm m-0">
              {isEn ? "Run any tool and we will pin the best next actions here." : "Starte ein Tool und wir pinnen hier die besten naechsten Schritte."}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
