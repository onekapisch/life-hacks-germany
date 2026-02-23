"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { trackEvent } from "@/lib/analyticsClient";

type Mode = "last-train" | "weekend";
type RiskLevel = "low" | "medium" | "high";

type StationOption = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type JourneyView = {
  departure: string;
  arrival: string;
  durationMinutes: number;
  transfers: number;
  lineLabel: string;
  priceAmount: number | null;
  currency: string;
};

type LastTrainPayload = {
  mode: "last-train";
  from: { id: string; name: string };
  to: { id: string; name: string };
  selectedDepartureIso: string;
  bestJourney: JourneyView & { risk: RiskLevel };
  alternatives: JourneyView[];
  destinationWeather: { tempMax: number | null; precipMax: number | null };
};

type WeekendRecommendation = {
  destination: { id: string; name: string };
  outbound: JourneyView;
  inbound: JourneyView;
  totalPrice: number | null;
  risk: RiskLevel;
  weather: { tempMax: number | null; precipMax: number | null };
  fitScore: number;
};

type WeekendPayload = {
  mode: "weekend";
  origin: { id: string; name: string };
  weekendWindow: { start: string; end: string };
  budget: number;
  maxHours: number;
  destinationQuery: string;
  candidatePool: number;
  recommendations: WeekendRecommendation[];
};

type ErrorPayload = { error?: string };
type StationSearchPayload = { mode: "stations"; items: StationOption[] };

type FinderInsight = {
  title: string;
  message: string;
  actions: Array<{ label: string; href: string }>;
};

const DEFAULT_STATIONS = {
  from: { id: "8011160", name: "Berlin Hbf", latitude: 52.524925, longitude: 13.369629 },
  to: { id: "8010205", name: "Leipzig Hbf", latitude: 51.34508, longitude: 12.381167 },
  weekend: { id: "8011160", name: "Berlin Hbf", latitude: 52.524925, longitude: 13.369629 },
} as const;

function formatDuration(minutes: number, lang: Lang): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (lang === "de") return `${hours}h ${mins}min`;
  return `${hours}h ${mins}m`;
}

function formatRisk(risk: RiskLevel, lang: Lang): string {
  if (risk === "low") return lang === "de" ? "Niedriges Risiko" : "Low risk";
  if (risk === "medium") return lang === "de" ? "Mittleres Risiko" : "Medium risk";
  return lang === "de" ? "Hoeheres Risiko" : "Higher risk";
}

function riskClass(risk: RiskLevel): string {
  if (risk === "low") return "text-accent-4";
  if (risk === "medium") return "text-accent-2";
  return "text-accent";
}

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function toDbDateTime(isoDateTime: string): string {
  const match = isoDateTime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (match) return `${match[1]}T${match[2]}:00`;

  const parsed = new Date(isoDateTime);
  if (!Number.isFinite(parsed.getTime())) return new Date().toISOString().slice(0, 19);

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function buildDbBookingUrl(params: {
  lang: Lang;
  fromName: string;
  toName: string;
  departureIso: string;
}): string {
  const base = params.lang === "de"
    ? "https://www.bahn.de/buchung/fahrplan/suche"
    : "https://int.bahn.de/en/buchung/fahrplan/suche";

  const hash = new URLSearchParams({
    sts: "true",
    so: params.fromName,
    zo: params.toName,
    kl: "2",
    hd: toDbDateTime(params.departureIso),
    hza: "D",
    hz: "[]",
    ar: "false",
    s: "true",
    d: "false",
    vm: "00,01,02,03,04,05,06,07,08,09",
    fm: "false",
    bp: "false",
  });

  return `${base}#${hash.toString()}`;
}

export default function LastTrainEscapeFinder({
  lang,
  onInsight,
}: {
  lang: Lang;
  onInsight?: (insight: FinderInsight) => void;
}) {
  const isEn = lang === "en";
  const locale = isEn ? "en-GB" : "de-DE";
  const currencyFormatter = useMemo(() => new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }), [locale]);
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }), [locale]);
  const shortDateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }), [locale]);

  const now = new Date();
  const defaultDate = toInputDate(now);
  const defaultTime = "20:30";

  const [mode, setMode] = useState<Mode>("last-train");

  const [fromQuery, setFromQuery] = useState<string>(DEFAULT_STATIONS.from.name);
  const [toQuery, setToQuery] = useState<string>(DEFAULT_STATIONS.to.name);
  const [weekendOriginQuery, setWeekendOriginQuery] = useState<string>(DEFAULT_STATIONS.weekend.name);

  const [fromStation, setFromStation] = useState<StationOption>(DEFAULT_STATIONS.from);
  const [toStation, setToStation] = useState<StationOption>(DEFAULT_STATIONS.to);
  const [weekendOriginStation, setWeekendOriginStation] = useState<StationOption>(DEFAULT_STATIONS.weekend);

  const [fromSuggestions, setFromSuggestions] = useState<StationOption[]>([]);
  const [toSuggestions, setToSuggestions] = useState<StationOption[]>([]);
  const [weekendSuggestions, setWeekendSuggestions] = useState<StationOption[]>([]);

  const [fromSearchLoading, setFromSearchLoading] = useState(false);
  const [toSearchLoading, setToSearchLoading] = useState(false);
  const [weekendSearchLoading, setWeekendSearchLoading] = useState(false);

  const [departDate, setDepartDate] = useState(defaultDate);
  const [departTime, setDepartTime] = useState(defaultTime);

  const [weekendBudget, setWeekendBudget] = useState("160");
  const [weekendMaxHours, setWeekendMaxHours] = useState("4.5");
  const [weekendDestinationQuery, setWeekendDestinationQuery] = useState("Hbf");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTrainResult, setLastTrainResult] = useState<LastTrainPayload | null>(null);
  const [weekendResult, setWeekendResult] = useState<WeekendPayload | null>(null);

  const readErrorMessage = (
    payload: LastTrainPayload | WeekendPayload | ErrorPayload,
    fallback: string
  ): string => {
    if ("error" in payload && typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
    return fallback;
  };

  const fetchStationSuggestions = useCallback(async (
    query: string,
    setSuggestions: (items: StationOption[]) => void,
    setSearchLoading: (value: boolean) => void
  ) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams({
        mode: "stations",
        lang,
        q: query.trim(),
        limit: "8",
      });
      const response = await fetch(`/api/mobility-finder?${params.toString()}`);
      const payload = await response.json() as StationSearchPayload;
      if (!response.ok || !Array.isArray(payload.items)) {
        setSuggestions([]);
        return;
      }
      setSuggestions(payload.items);
    } catch {
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (fromQuery.trim() === fromStation.name) {
        setFromSuggestions([]);
        return;
      }
      fetchStationSuggestions(fromQuery, setFromSuggestions, setFromSearchLoading);
    }, 240);

    return () => clearTimeout(id);
  }, [fromQuery, fromStation.name, fetchStationSuggestions]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (toQuery.trim() === toStation.name) {
        setToSuggestions([]);
        return;
      }
      fetchStationSuggestions(toQuery, setToSuggestions, setToSearchLoading);
    }, 240);

    return () => clearTimeout(id);
  }, [toQuery, toStation.name, fetchStationSuggestions]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (weekendOriginQuery.trim() === weekendOriginStation.name) {
        setWeekendSuggestions([]);
        return;
      }
      fetchStationSuggestions(weekendOriginQuery, setWeekendSuggestions, setWeekendSearchLoading);
    }, 240);

    return () => clearTimeout(id);
  }, [weekendOriginQuery, weekendOriginStation.name, fetchStationSuggestions]);

  const validateSelectedStation = (
    query: string,
    selected: StationOption | null,
    fallback: string
  ): StationOption => {
    if (!selected || query.trim() !== selected.name) {
      throw new Error(fallback);
    }
    return selected;
  };

  const launchLastTrain = async () => {
    setLoading(true);
    setError(null);
    setLastTrainResult(null);

    try {
      const from = validateSelectedStation(
        fromQuery,
        fromStation,
        isEn ? "Choose origin station from suggestions." : "Bitte Startbahnhof aus Vorschlaegen waehlen."
      );
      const to = validateSelectedStation(
        toQuery,
        toStation,
        isEn ? "Choose destination station from suggestions." : "Bitte Zielbahnhof aus Vorschlaegen waehlen."
      );

      if (from.id === to.id) {
        throw new Error(isEn ? "Origin and destination cannot be the same." : "Start und Ziel duerfen nicht gleich sein.");
      }

      const departureIso = new Date(`${departDate}T${departTime}:00`).toISOString();

      trackEvent("tool_calculate", {
        tool: "last_train_home",
        lang,
        from_station: from.id,
        to_station: to.id,
      });

      const params = new URLSearchParams({
        mode: "last-train",
        lang,
        fromId: from.id,
        toId: to.id,
        departure: departureIso,
      });

      const response = await fetch(`/api/mobility-finder?${params.toString()}`);
      const payload = await response.json() as LastTrainPayload | ErrorPayload;
      if (!response.ok || !("mode" in payload && payload.mode === "last-train")) {
        throw new Error(readErrorMessage(payload, isEn ? "Could not fetch route." : "Route konnte nicht geladen werden."));
      }

      setLastTrainResult(payload);
      onInsight?.({
        title: isEn ? "Last train route ready" : "Letzte Zugverbindung bereit",
        message: isEn
          ? `Latest departure found: ${payload.from.name} to ${payload.to.name}, ${payload.bestJourney.lineLabel}.`
          : `Spaeteste Abfahrt gefunden: ${payload.from.name} nach ${payload.to.name}, ${payload.bestJourney.lineLabel}.`,
        actions: [
          {
            label: isEn ? "Book on DB" : "Bei DB buchen",
            href: buildDbBookingUrl({
              lang,
              fromName: payload.from.name,
              toName: payload.to.name,
              departureIso: payload.bestJourney.departure,
            }),
          },
          {
            label: isEn ? "View mobility guides" : "Mobilitaets-Guides",
            href: `${lang === "en" ? "/en" : "/de"}/guides/mobility`,
          },
        ],
      });
    } catch (err) {
      const fallback = err instanceof Error ? err.message : "";
      setError(fallback || (isEn ? "Could not load train data right now." : "Zugdaten konnten gerade nicht geladen werden."));
    } finally {
      setLoading(false);
    }
  };

  const launchWeekendFinder = async () => {
    setLoading(true);
    setError(null);
    setWeekendResult(null);

    try {
      const origin = validateSelectedStation(
        weekendOriginQuery,
        weekendOriginStation,
        isEn ? "Choose origin station from suggestions." : "Bitte Startbahnhof aus Vorschlaegen waehlen."
      );

      trackEvent("tool_calculate", {
        tool: "weekend_escape_finder",
        lang,
        origin_station: origin.id,
      });

      const params = new URLSearchParams({
        mode: "weekend",
        lang,
        originId: origin.id,
        budget: weekendBudget,
        maxHours: weekendMaxHours,
        destinationQuery: weekendDestinationQuery.trim() || "Hbf",
      });

      const response = await fetch(`/api/mobility-finder?${params.toString()}`);
      const payload = await response.json() as WeekendPayload | ErrorPayload;
      if (!response.ok || !("mode" in payload && payload.mode === "weekend")) {
        throw new Error(readErrorMessage(payload, isEn ? "Could not load weekend options." : "Wochenendoptionen konnten nicht geladen werden."));
      }

      setWeekendResult(payload);
      if (payload.recommendations.length > 0) {
        const best = payload.recommendations[0];
        onInsight?.({
          title: isEn ? "Weekend options ranked" : "Wochenendoptionen sortiert",
          message: isEn
            ? `Top option: ${best.destination.name} with fit score ${best.fitScore}.`
            : `Top-Option: ${best.destination.name} mit Fit-Score ${best.fitScore}.`,
          actions: [
            {
              label: isEn ? "Book top option on DB" : "Top-Option bei DB buchen",
              href: buildDbBookingUrl({
                lang,
                fromName: payload.origin.name,
                toName: best.destination.name,
                departureIso: best.outbound.departure,
              }),
            },
            {
              label: isEn ? "Open travel tips" : "Reise-Tipps oeffnen",
              href: `${lang === "en" ? "/en" : "/de"}/tips`,
            },
          ],
        });
      }
    } catch (err) {
      const fallback = err instanceof Error ? err.message : "";
      setError(fallback || (isEn ? "Could not load weekend options right now." : "Wochenendoptionen konnten gerade nicht geladen werden."));
    } finally {
      setLoading(false);
    }
  };

  const stationSearchField = (params: {
    label: string;
    query: string;
    setQuery: (value: string) => void;
    selected: StationOption;
    setSelected: (value: StationOption) => void;
    suggestions: StationOption[];
    setSuggestions: (value: StationOption[]) => void;
    searching: boolean;
    placeholder: string;
  }) => {
    return (
      <div className="relative">
        <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
          {params.label}
        </label>
        <input
          type="text"
          value={params.query}
          onChange={(event) => {
            const value = event.target.value;
            params.setQuery(value);
            if (value.trim() !== params.selected.name) {
              params.setSuggestions([]);
            }
          }}
          onBlur={() => setTimeout(() => params.setSuggestions([]), 120)}
          className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
          placeholder={params.placeholder}
          autoComplete="off"
        />
        {params.searching && (
          <span className="absolute right-3 top-[2.75rem] text-[0.68rem] text-ink-3">
            {isEn ? "searching" : "suche"}
          </span>
        )}
        {params.suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-[rgba(15,23,42,0.15)] bg-paper shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
            {params.suggestions.map((station) => (
              <button
                key={station.id}
                type="button"
                className="w-full border-0 bg-transparent px-3 py-2 text-left text-sm text-ink hover:bg-[rgba(15,23,42,0.06)]"
                onClick={() => {
                  params.setSelected(station);
                  params.setQuery(station.name);
                  params.setSuggestions([]);
                }}
              >
                {station.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="last-train-weekend-escape" className="content-shell lg:col-span-2 scroll-mt-28">
      <div className="highlight-band mb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge mb-4">{isEn ? "Featured mobility tool" : "Neues Mobilitaets-Tool"}</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-0 mb-3">
              {isEn ? "Last Train Home + Weekend Escape Finder" : "Last Train Home + Weekend Escape Finder"}
            </h2>
            <p className="text-ink-2 max-w-3xl m-0">
              {isEn
                ? "Built for students, young professionals, and locals: find your safest late return option and discover weekend trips ranked by time, weather, and practical budget fit."
                : "Fuer Studierende, Young Professionals und Locals: Finde den spaetesten sicheren Heimweg und entdecke Wochenendtrips nach Zeit, Wetter und Budget-Fit."}
            </p>
          </div>
          <div className="notice !px-4 !py-3 max-w-sm text-sm">
            {isEn
              ? "Live feeds: DB transport graph (transport.rest) + Open-Meteo forecast."
              : "Live-Feeds: DB-Transportgraph (transport.rest) + Open-Meteo Wetterprognose."}
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          className={`persona-button px-4 py-2 text-sm font-semibold ${mode === "last-train" ? "persona-button-active" : ""}`}
          onClick={() => setMode("last-train")}
        >
          {isEn ? "Last Train Home" : "Letzter Zug nach Hause"}
        </button>
        <button
          type="button"
          className={`persona-button px-4 py-2 text-sm font-semibold ${mode === "weekend" ? "persona-button-active" : ""}`}
          onClick={() => setMode("weekend")}
        >
          {isEn ? "Weekend Escape Finder" : "Wochenendtrip Finder"}
        </button>
      </div>

      {mode === "last-train" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end mb-5">
          {stationSearchField({
            label: isEn ? "From station (where you are now)" : "Von Bahnhof (wo du gerade bist)",
            query: fromQuery,
            setQuery: setFromQuery,
            selected: fromStation,
            setSelected: setFromStation,
            suggestions: fromSuggestions,
            setSuggestions: setFromSuggestions,
            searching: fromSearchLoading,
            placeholder: isEn ? "Type city or station" : "Stadt oder Bahnhof eingeben",
          })}

          {stationSearchField({
            label: isEn ? "To station (home)" : "Nach Bahnhof (Ziel)",
            query: toQuery,
            setQuery: setToQuery,
            selected: toStation,
            setSelected: setToStation,
            suggestions: toSuggestions,
            setSuggestions: setToSuggestions,
            searching: toSearchLoading,
            placeholder: isEn ? "Type city or station" : "Stadt oder Bahnhof eingeben",
          })}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                {isEn ? "Date" : "Datum"}
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(event) => setDepartDate(event.target.value)}
                className="glass-input w-full px-3 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                {isEn ? "After" : "Ab"}
              </label>
              <input
                type="time"
                value={departTime}
                onChange={(event) => setDepartTime(event.target.value)}
                className="glass-input w-full px-3 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={launchLastTrain}
            disabled={loading}
          >
            {loading
              ? (isEn ? "Loading..." : "Laedt...")
              : (isEn ? "Find true last train" : "Echten letzten Zug finden")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end mb-5">
          {stationSearchField({
            label: isEn ? "Starting station" : "Startbahnhof",
            query: weekendOriginQuery,
            setQuery: setWeekendOriginQuery,
            selected: weekendOriginStation,
            setSelected: setWeekendOriginStation,
            suggestions: weekendSuggestions,
            setSuggestions: setWeekendSuggestions,
            searching: weekendSearchLoading,
            placeholder: isEn ? "Type city or station" : "Stadt oder Bahnhof eingeben",
          })}

          <div>
            <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
              {isEn ? "Round-trip budget (EUR)" : "Budget Hin+Rueck (EUR)"}
            </label>
            <input
              type="number"
              value={weekendBudget}
              onChange={(event) => setWeekendBudget(event.target.value)}
              className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
              min="40"
              max="500"
              step="1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                {isEn ? "Max one-way duration (hours)" : "Max. Fahrzeit einfach (Std.)"}
              </label>
              <input
                type="number"
                value={weekendMaxHours}
                onChange={(event) => setWeekendMaxHours(event.target.value)}
                className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                min="1"
                max="10"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-ink-2 mb-1.5 font-bold">
                {isEn ? "Destination focus" : "Ziel-Fokus"}
              </label>
              <input
                type="text"
                value={weekendDestinationQuery}
                onChange={(event) => setWeekendDestinationQuery(event.target.value)}
                className="glass-input w-full px-4 py-3 text-sm focus:border-accent-3/80 focus:outline-none transition-colors"
                placeholder={isEn ? "e.g. Hbf, Bavaria, Rhine" : "z. B. Hbf, Bayern, Rhein"}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={launchWeekendFinder}
            disabled={loading}
          >
            {loading
              ? (isEn ? "Loading..." : "Laedt...")
              : (isEn ? "Find weekend escapes" : "Wochenendtrips finden")}
          </button>
        </div>
      )}

      {error && (
        <div className="tool-result tool-result-error mb-4">{error}</div>
      )}

      {lastTrainResult && mode === "last-train" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="card xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-2">
              {isEn ? "Latest same-day departure found" : "Spaeteste Verbindung am selben Tag gefunden"}
            </p>
            <h3 className="text-xl font-black mt-0 mb-2">
              {lastTrainResult.from.name} {"->"} {lastTrainResult.to.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="glass-card-link p-3">
                <span className="block text-[0.68rem] uppercase tracking-[0.1em] text-ink-3 mb-1">
                  {isEn ? "Departure" : "Abfahrt"}
                </span>
                <strong className="text-base font-black">
                  {dateFormatter.format(new Date(lastTrainResult.bestJourney.departure))}
                </strong>
              </div>
              <div className="glass-card-link p-3">
                <span className="block text-[0.68rem] uppercase tracking-[0.1em] text-ink-3 mb-1">
                  {isEn ? "Arrival" : "Ankunft"}
                </span>
                <strong className="text-base font-black">
                  {dateFormatter.format(new Date(lastTrainResult.bestJourney.arrival))}
                </strong>
              </div>
              <div className="glass-card-link p-3">
                <span className="block text-[0.68rem] uppercase tracking-[0.1em] text-ink-3 mb-1">
                  {isEn ? "Duration" : "Dauer"}
                </span>
                <strong className="text-base font-black">
                  {formatDuration(lastTrainResult.bestJourney.durationMinutes, lang)}
                </strong>
              </div>
            </div>
            <p className="text-sm text-ink-2 m-0">
              <strong>{lastTrainResult.bestJourney.lineLabel}</strong>
              {" · "}
              {lastTrainResult.bestJourney.transfers} {isEn ? "transfer(s)" : "Umstieg(e)"}
              {" · "}
              <span className={riskClass(lastTrainResult.bestJourney.risk)}>
                {formatRisk(lastTrainResult.bestJourney.risk, lang)}
              </span>
              {lastTrainResult.bestJourney.priceAmount !== null && (
                <>
                  {" · "}
                  {currencyFormatter.format(lastTrainResult.bestJourney.priceAmount)}
                </>
              )}
            </p>
            <div className="mt-4">
              <a
                href={buildDbBookingUrl({
                  lang,
                  fromName: lastTrainResult.from.name,
                  toName: lastTrainResult.to.name,
                  departureIso: lastTrainResult.bestJourney.departure,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                onClick={() => trackEvent("tool_db_booking_click", {
                  tool: "last_train_home",
                  lang,
                  from_station: lastTrainResult.from.id,
                  to_station: lastTrainResult.to.id,
                })}
              >
                {isEn ? "Book on DB" : "Bei DB buchen"}
              </a>
            </div>
          </div>

          <div className="content-shell">
            <h4 className="text-sm uppercase tracking-[0.1em] text-ink-3 mt-0 mb-3">
              {isEn ? "Arrival weather hint" : "Wetter-Hinweis zur Ankunft"}
            </h4>
            <p className="text-sm m-0">
              {lastTrainResult.destinationWeather.tempMax !== null
                ? `${isEn ? "Max temp" : "Max Temp"}: ${Math.round(lastTrainResult.destinationWeather.tempMax)}C`
                : (isEn ? "Temperature unavailable." : "Temperatur nicht verfuegbar.")}
            </p>
            <p className="text-sm m-0 mt-1">
              {lastTrainResult.destinationWeather.precipMax !== null
                ? `${isEn ? "Rain probability" : "Regenwahrscheinlichkeit"}: ${Math.round(lastTrainResult.destinationWeather.precipMax)}%`
                : (isEn ? "Rain probability unavailable." : "Regenwahrscheinlichkeit nicht verfuegbar.")}
            </p>
            {lastTrainResult.alternatives.length > 1 && (
              <p className="text-xs text-ink-3 mt-3 mb-0">
                {isEn
                  ? `Checked ${lastTrainResult.alternatives.length} late departures for this route.`
                  : `${lastTrainResult.alternatives.length} spaete Verbindungen fuer diese Route geprueft.`}
              </p>
            )}
          </div>
        </div>
      )}

      {weekendResult && mode === "weekend" && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-ink-2 m-0">
              {isEn
                ? `Weekend window: ${shortDateFormatter.format(new Date(weekendResult.weekendWindow.start))} - ${shortDateFormatter.format(new Date(weekendResult.weekendWindow.end))} · Origin: ${weekendResult.origin.name} · Pool: ${weekendResult.candidatePool}`
                : `Wochenendfenster: ${shortDateFormatter.format(new Date(weekendResult.weekendWindow.start))} - ${shortDateFormatter.format(new Date(weekendResult.weekendWindow.end))} · Start: ${weekendResult.origin.name} · Pool: ${weekendResult.candidatePool}`}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {weekendResult.recommendations.map((item) => (
              <article key={item.destination.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em] text-ink-3 font-bold mt-0 mb-1">
                      {isEn ? "Weekend escape" : "Wochenendtrip"}
                    </p>
                    <h3 className="text-xl font-black mt-0 mb-1">{item.destination.name}</h3>
                  </div>
                  <span className="badge-solid text-[0.7rem] px-2.5 py-1.5">
                    {isEn ? "Fit score" : "Fit-Score"} {item.fitScore}
                  </span>
                </div>

                <p className="text-sm text-ink-2 mt-0 mb-2">
                  {isEn ? "Outbound" : "Hinfahrt"}: {dateFormatter.format(new Date(item.outbound.departure))} · {formatDuration(item.outbound.durationMinutes, lang)} · {item.outbound.transfers} {isEn ? "transfer(s)" : "Umstieg(e)"}
                </p>
                <p className="text-sm text-ink-2 mt-0 mb-2">
                  {isEn ? "Return" : "Rueckfahrt"}: {dateFormatter.format(new Date(item.inbound.departure))} · {formatDuration(item.inbound.durationMinutes, lang)} · {item.inbound.transfers} {isEn ? "transfer(s)" : "Umstieg(e)"}
                </p>
                <p className={`text-sm font-semibold mt-0 mb-2 ${riskClass(item.risk)}`}>
                  {formatRisk(item.risk, lang)}
                </p>
                <p className="text-sm mt-0 mb-2">
                  {item.totalPrice !== null
                    ? `${isEn ? "Indicative fare" : "Richtpreis"}: ${currencyFormatter.format(item.totalPrice)}`
                    : (isEn ? "Fare not available in feed." : "Preis im Feed nicht verfuegbar.")}
                </p>
                <p className="text-sm mt-0 mb-0 text-ink-2">
                  {item.weather.tempMax !== null
                    ? `${isEn ? "Weather" : "Wetter"}: ${Math.round(item.weather.tempMax)}C`
                    : `${isEn ? "Weather" : "Wetter"}: ${isEn ? "n/a" : "k. A."}`}
                  {item.weather.precipMax !== null ? ` · ${isEn ? "Rain" : "Regen"} ${Math.round(item.weather.precipMax)}%` : ""}
                </p>
                <div className="mt-4">
                  <a
                    href={buildDbBookingUrl({
                      lang,
                      fromName: weekendResult.origin.name,
                      toName: item.destination.name,
                      departureIso: item.outbound.departure,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    onClick={() => trackEvent("tool_db_booking_click", {
                      tool: "weekend_escape_finder",
                      lang,
                      from_station: weekendResult.origin.id,
                      to_station: item.destination.id,
                    })}
                  >
                    {isEn ? "Book on DB" : "Bei DB buchen"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="notice mt-6 text-center text-sm">
        {isEn
          ? "Journey and fare data comes from live transit feeds. Prices are indicative and can change at booking checkout."
          : "Verbindungs- und Preisdaten kommen aus Live-Transit-Feeds. Preise sind Richtwerte und koennen sich beim Buchen aendern."}
      </div>
    </div>
  );
}
