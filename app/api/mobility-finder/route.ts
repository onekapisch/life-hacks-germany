import { NextResponse } from "next/server";

type Lang = "en" | "de";
type Mode = "stations" | "last-train" | "weekend";
type RiskLevel = "low" | "medium" | "high";

type StationProducts = {
  nationalExpress?: boolean;
  national?: boolean;
  regionalExpress?: boolean;
  regional?: boolean;
  suburban?: boolean;
  bus?: boolean;
  ferry?: boolean;
  subway?: boolean;
  tram?: boolean;
};

type StationApi = {
  id?: string;
  name?: string;
  type?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  products?: StationProducts;
};

type StationRef = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type JourneyApi = {
  legs?: Array<{
    departure?: string;
    arrival?: string;
    line?: {
      name?: string;
      productName?: string;
    };
  }>;
  remarks?: Array<{
    type?: string;
  }>;
  price?: {
    amount?: number;
    currency?: string;
  };
};

type ParsedJourney = {
  departure: string;
  arrival: string;
  durationMinutes: number;
  transfers: number;
  lineLabel: string;
  priceAmount: number | null;
  currency: string;
  remarkCount: number;
};

type JourneyPage = {
  journeys: ParsedJourney[];
  laterRef: string | null;
};

const TRANSPORT_API_BASE = "https://v6.db.transport.rest";
const WEATHER_API_BASE = "https://api.open-meteo.com/v1/forecast";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function berlinDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

function nextSaturday(reference = new Date()): Date {
  const date = new Date(reference);
  date.setHours(10, 0, 0, 0);
  const day = date.getDay();
  const offset = (6 - day + 7) % 7;

  if (offset === 0 && reference.getHours() >= 13) {
    date.setDate(date.getDate() + 7);
    return date;
  }

  date.setDate(date.getDate() + offset);
  return date;
}

function withTime(base: Date, hour: number, minute: number): Date {
  const date = new Date(base);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function calculateRisk(transfers: number, remarkCount: number): RiskLevel {
  const index = transfers + remarkCount;
  if (index <= 1) return "low";
  if (index <= 3) return "medium";
  return "high";
}

function isTransportRelevant(products?: StationProducts): boolean {
  if (!products) return false;
  return Boolean(
    products.national ||
    products.nationalExpress ||
    products.regional ||
    products.regionalExpress ||
    products.suburban
  );
}

function parseStation(station: StationApi): StationRef | null {
  const id = station.id;
  const name = station.name;
  const latitude = station.location?.latitude;
  const longitude = station.location?.longitude;

  if (!id || !name) return null;
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (!isTransportRelevant(station.products)) return null;

  return {
    id,
    name,
    latitude,
    longitude,
  };
}

function parseJourney(journey: JourneyApi): ParsedJourney | null {
  const legs = Array.isArray(journey.legs) ? journey.legs : [];
  if (legs.length === 0) return null;

  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  if (!firstLeg?.departure || !lastLeg?.arrival) return null;

  const departureMs = Date.parse(firstLeg.departure);
  const arrivalMs = Date.parse(lastLeg.arrival);
  if (!Number.isFinite(departureMs) || !Number.isFinite(arrivalMs) || arrivalMs <= departureMs) {
    return null;
  }

  const durationMinutes = Math.round((arrivalMs - departureMs) / 60000);
  const lineLabel = firstLeg.line?.name || firstLeg.line?.productName || "Train";
  const amount = journey.price?.amount;
  const parsedAmount = typeof amount === "number" && Number.isFinite(amount) ? amount : null;

  return {
    departure: firstLeg.departure,
    arrival: lastLeg.arrival,
    durationMinutes,
    transfers: Math.max(legs.length - 1, 0),
    lineLabel,
    priceAmount: parsedAmount,
    currency: journey.price?.currency || "EUR",
    remarkCount: Array.isArray(journey.remarks) ? journey.remarks.length : 0,
  };
}

async function fetchStationsByQuery(query: string, limit: number): Promise<StationRef[]> {
  const url = new URL(`${TRANSPORT_API_BASE}/locations`);
  url.searchParams.set("query", query);
  url.searchParams.set("results", String(limit));

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "LifeHacksGermany/1.0 (+https://lifehacksgermany.com)" },
  });

  if (!response.ok) {
    throw new Error(`Station request failed (${response.status})`);
  }

  const payload = (await response.json()) as StationApi[];
  const unique = new Map<string, StationRef>();

  for (const item of payload) {
    if (item.type !== "station" && item.type !== "stop") continue;
    const parsed = parseStation(item);
    if (!parsed) continue;
    if (!unique.has(parsed.id)) unique.set(parsed.id, parsed);
  }

  return [...unique.values()];
}

async function fetchStationById(id: string): Promise<StationRef | null> {
  const response = await fetch(
    `${TRANSPORT_API_BASE}/locations?query=${encodeURIComponent(id)}&results=8`,
    {
      headers: { "User-Agent": "LifeHacksGermany/1.0 (+https://lifehacksgermany.com)" },
    }
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as StationApi[];
  for (const station of payload) {
    const parsed = parseStation(station);
    if (parsed && parsed.id === id) return parsed;
  }

  for (const station of payload) {
    const parsed = parseStation(station);
    if (parsed) return parsed;
  }

  return null;
}

async function fetchJourneyPage(params: {
  fromId: string;
  toId: string;
  departureIso?: string;
  laterRef?: string;
  results: number;
}): Promise<JourneyPage> {
  const url = new URL(`${TRANSPORT_API_BASE}/journeys`);
  url.searchParams.set("from", params.fromId);
  url.searchParams.set("to", params.toId);
  url.searchParams.set("results", String(params.results));

  if (params.laterRef) {
    url.searchParams.set("laterThan", params.laterRef);
  } else if (params.departureIso) {
    url.searchParams.set("departure", params.departureIso);
  }

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "LifeHacksGermany/1.0 (+https://lifehacksgermany.com)" },
  });

  if (!response.ok) {
    throw new Error(`Journey request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    journeys?: JourneyApi[];
    laterRef?: string;
  };

  const journeys = (payload.journeys ?? [])
    .map(parseJourney)
    .filter((journey): journey is ParsedJourney => journey !== null);

  return {
    journeys,
    laterRef: payload.laterRef || null,
  };
}

async function fetchJourneys(
  from: StationRef,
  to: StationRef,
  departureIso: string,
  results = 8
): Promise<ParsedJourney[]> {
  const page = await fetchJourneyPage({
    fromId: from.id,
    toId: to.id,
    departureIso,
    results,
  });
  return page.journeys;
}

async function findLastDepartureForDay(params: {
  from: StationRef;
  to: StationRef;
  departureIso: string;
}): Promise<{ best: ParsedJourney | null; alternatives: ParsedJourney[] }> {
  const baseDeparture = new Date(params.departureIso);
  const targetDate = berlinDateKey(baseDeparture);
  const earliestTs = baseDeparture.getTime();
  const unique = new Map<string, ParsedJourney>();

  let page = await fetchJourneyPage({
    fromId: params.from.id,
    toId: params.to.id,
    departureIso: params.departureIso,
    results: 8,
  });

  const maxPages = 14;
  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    let crossedDayBoundary = false;

    for (const option of page.journeys) {
      const departureDate = new Date(option.departure);
      const departureTs = departureDate.getTime();
      const departureDay = berlinDateKey(departureDate);

      if (departureDay !== targetDate) {
        if (departureDay > targetDate) crossedDayBoundary = true;
        continue;
      }
      if (departureTs < earliestTs) continue;

      unique.set(`${option.departure}|${option.arrival}|${option.lineLabel}`, option);
    }

    if (crossedDayBoundary || !page.laterRef) break;

    page = await fetchJourneyPage({
      fromId: params.from.id,
      toId: params.to.id,
      laterRef: page.laterRef,
      results: 8,
    });
  }

  const sameDayJourneys = [...unique.values()].sort(
    (a, b) => Date.parse(a.departure) - Date.parse(b.departure)
  );

  if (sameDayJourneys.length === 0) {
    return { best: null, alternatives: [] };
  }

  return {
    best: sameDayJourneys[sameDayJourneys.length - 1],
    alternatives: sameDayJourneys.slice(Math.max(0, sameDayJourneys.length - 4), sameDayJourneys.length),
  };
}

async function fetchDailyWeather(
  latitude: number,
  longitude: number,
  targetDateIso: string
): Promise<{ tempMax: number | null; precipMax: number | null }> {
  const url = new URL(WEATHER_API_BASE);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "temperature_2m_max,precipitation_probability_max");
  url.searchParams.set("timezone", "Europe/Berlin");
  url.searchParams.set("forecast_days", "8");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "LifeHacksGermany/1.0 (+https://lifehacksgermany.com)" },
  });

  if (!response.ok) {
    return { tempMax: null, precipMax: null };
  }

  const payload = (await response.json()) as {
    daily?: {
      time?: string[];
      temperature_2m_max?: number[];
      precipitation_probability_max?: number[];
    };
  };

  const dates = payload.daily?.time ?? [];
  const index = dates.indexOf(targetDateIso);
  if (index === -1) {
    return { tempMax: null, precipMax: null };
  }

  const temp = payload.daily?.temperature_2m_max?.[index];
  const precip = payload.daily?.precipitation_probability_max?.[index];

  return {
    tempMax: typeof temp === "number" && Number.isFinite(temp) ? temp : null,
    precipMax: typeof precip === "number" && Number.isFinite(precip) ? precip : null,
  };
}

function scoreWeekendOption(params: {
  budget: number;
  maxHours: number;
  totalPrice: number | null;
  outboundDurationMinutes: number;
  transfers: number;
  precipitation: number | null;
}): number {
  const durationHours = params.outboundDurationMinutes / 60;
  const pricePenalty = params.totalPrice === null ? 12 : Math.max((params.totalPrice - params.budget) * 0.24, 0);
  const durationPenalty = Math.max((durationHours - params.maxHours) * 9, 0);
  const transferPenalty = params.transfers * 3;
  const weatherPenalty = params.precipitation === null ? 6 : clamp(params.precipitation * 0.18, 0, 16);

  const score = 100 - pricePenalty - durationPenalty - transferPenalty - weatherPenalty;
  return Math.round(clamp(score, 10, 100));
}

async function buildStationSearchResponse(params: URLSearchParams) {
  const query = (params.get("q") ?? "").trim();
  const limitRaw = Number.parseInt(params.get("limit") ?? "8", 10);
  const limit = Number.isFinite(limitRaw) ? clamp(limitRaw, 1, 15) : 8;

  if (query.length < 2) {
    return NextResponse.json({
      mode: "stations" as const,
      items: [],
    });
  }

  const stations = await fetchStationsByQuery(query, limit + 5);

  return NextResponse.json(
    {
      mode: "stations" as const,
      query,
      items: stations.slice(0, limit),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}

async function buildLastTrainResponse(params: URLSearchParams, lang: Lang) {
  const fromId = (params.get("fromId") ?? "").trim();
  const toId = (params.get("toId") ?? "").trim();
  const departureIso = params.get("departure");

  if (!fromId || !toId) {
    return NextResponse.json(
      { error: lang === "de" ? "Bitte Start- und Zielbahnhof waehlen." : "Please choose origin and destination stations." },
      { status: 400 }
    );
  }

  if (fromId === toId) {
    return NextResponse.json(
      { error: lang === "de" ? "Start und Ziel duerfen nicht identisch sein." : "Origin and destination must be different." },
      { status: 400 }
    );
  }

  const baseDeparture = departureIso && Number.isFinite(Date.parse(departureIso))
    ? new Date(departureIso)
    : new Date();

  const [from, to] = await Promise.all([fetchStationById(fromId), fetchStationById(toId)]);

  if (!from || !to) {
    return NextResponse.json(
      { error: lang === "de" ? "Bahnhof konnte nicht aufgeloest werden." : "Could not resolve selected station." },
      { status: 400 }
    );
  }

  const { best, alternatives } = await findLastDepartureForDay({
    from,
    to,
    departureIso: baseDeparture.toISOString(),
  });

  if (!best) {
    return NextResponse.json(
      { error: lang === "de" ? "Keine passende Verbindung bis Tagesende gefunden." : "No suitable same-day departure found." },
      { status: 404 }
    );
  }

  const weather = await fetchDailyWeather(
    to.latitude,
    to.longitude,
    toIsoDate(new Date(best.arrival))
  );

  return NextResponse.json(
    {
      mode: "last-train" as const,
      from: { id: from.id, name: from.name },
      to: { id: to.id, name: to.name },
      selectedDepartureIso: baseDeparture.toISOString(),
      bestJourney: {
        ...best,
        risk: calculateRisk(best.transfers, best.remarkCount),
      },
      alternatives,
      destinationWeather: weather,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=1200",
      },
    }
  );
}

async function buildWeekendResponse(params: URLSearchParams, lang: Lang) {
  const originId = (params.get("originId") ?? "").trim();
  if (!originId) {
    return NextResponse.json(
      { error: lang === "de" ? "Bitte Startbahnhof waehlen." : "Please select an origin station." },
      { status: 400 }
    );
  }

  const budgetRaw = Number.parseFloat(params.get("budget") ?? "140");
  const maxHoursRaw = Number.parseFloat(params.get("maxHours") ?? "4.5");
  const destinationQuery = (params.get("destinationQuery") ?? "Hbf").trim() || "Hbf";
  const destinationLimitRaw = Number.parseInt(params.get("destinationLimit") ?? "8", 10);

  const budget = Number.isFinite(budgetRaw) ? clamp(budgetRaw, 40, 500) : 140;
  const maxHours = Number.isFinite(maxHoursRaw) ? clamp(maxHoursRaw, 1, 10) : 4.5;
  const destinationLimit = Number.isFinite(destinationLimitRaw)
    ? clamp(destinationLimitRaw, 4, 10)
    : 8;

  const origin = await fetchStationById(originId);
  if (!origin) {
    return NextResponse.json(
      { error: lang === "de" ? "Startbahnhof konnte nicht geladen werden." : "Could not load origin station." },
      { status: 400 }
    );
  }

  const weekendStart = nextSaturday();
  const weekendEnd = new Date(weekendStart);
  weekendEnd.setDate(weekendEnd.getDate() + 1);

  const outboundDeparture = withTime(weekendStart, 8, 30).toISOString();
  const returnDeparture = withTime(weekendEnd, 17, 0).toISOString();
  const weekendStartIso = toIsoDate(weekendStart);
  const weekendEndIso = toIsoDate(weekendEnd);

  const candidatesPrimary = await fetchStationsByQuery(destinationQuery, destinationLimit + 10);
  let candidates = candidatesPrimary.filter((station) => station.id !== origin.id);

  if (candidates.length < destinationLimit && destinationQuery.toLowerCase() !== "hbf") {
    const fallback = await fetchStationsByQuery("Hbf", destinationLimit + 10);
    const unique = new Map<string, StationRef>();

    for (const station of [...candidates, ...fallback]) {
      if (station.id === origin.id) continue;
      unique.set(station.id, station);
    }
    candidates = [...unique.values()];
  }

  const destinationPool = candidates.slice(0, destinationLimit);

  const options = await Promise.all(destinationPool.map(async (destination) => {
    try {
      const [outboundJourneys, returnJourneys, weather] = await Promise.all([
        fetchJourneys(origin, destination, outboundDeparture, 4),
        fetchJourneys(destination, origin, returnDeparture, 4),
        fetchDailyWeather(destination.latitude, destination.longitude, weekendStartIso),
      ]);

      if (outboundJourneys.length === 0 || returnJourneys.length === 0) return null;

      const outbound = outboundJourneys[0];
      const inbound = returnJourneys[0];
      const totalPrice = outbound.priceAmount !== null && inbound.priceAmount !== null
        ? Math.round((outbound.priceAmount + inbound.priceAmount) * 100) / 100
        : null;
      const totalTransfers = outbound.transfers + inbound.transfers;
      const risk = calculateRisk(totalTransfers, outbound.remarkCount + inbound.remarkCount);
      const fitScore = scoreWeekendOption({
        budget,
        maxHours,
        totalPrice,
        outboundDurationMinutes: outbound.durationMinutes,
        transfers: totalTransfers,
        precipitation: weather.precipMax,
      });

      return {
        destination: {
          id: destination.id,
          name: destination.name,
        },
        outbound,
        inbound,
        totalPrice,
        risk,
        weather,
        fitScore,
      };
    } catch {
      return null;
    }
  }));

  const recommendations = options
    .filter((option): option is NonNullable<typeof option> => option !== null)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 4);

  if (recommendations.length === 0) {
    return NextResponse.json(
      { error: lang === "de" ? "Keine Wochenendoptionen gefunden. Bitte spaeter erneut versuchen." : "No weekend options found. Please try again later." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      mode: "weekend" as const,
      origin: { id: origin.id, name: origin.name },
      weekendWindow: { start: weekendStartIso, end: weekendEndIso },
      budget,
      maxHours,
      destinationQuery,
      candidatePool: destinationPool.length,
      recommendations,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") as Mode | null;
  const lang = (searchParams.get("lang") === "de" ? "de" : "en") as Lang;

  try {
    if (mode === "stations") {
      return await buildStationSearchResponse(searchParams);
    }
    if (mode === "last-train") {
      return await buildLastTrainResponse(searchParams, lang);
    }
    if (mode === "weekend") {
      return await buildWeekendResponse(searchParams, lang);
    }
    return NextResponse.json(
      { error: lang === "de" ? "Ungueltiger Modus." : "Invalid mode." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      {
        error: lang === "de"
          ? "Der Mobilitaetsdienst ist gerade ausgelastet. Bitte in 1-2 Minuten erneut versuchen."
          : "Mobility service is temporarily busy. Please retry in 1-2 minutes.",
      },
      { status: 502 }
    );
  }
}
