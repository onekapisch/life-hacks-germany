export type TaxClass = "I" | "II" | "III" | "IV" | "V" | "VI";
export type CityKey = "berlin" | "munich" | "hamburg" | "frankfurt" | "cologne";

export type CityCosts = {
  rent: number;
  transport: number;
  groceries: number;
  utilities: number;
};

export const CITY_PRESETS: Record<CityKey, CityCosts> = {
  berlin: { rent: 1250, transport: 63, groceries: 340, utilities: 190 },
  munich: { rent: 1700, transport: 63, groceries: 360, utilities: 210 },
  hamburg: { rent: 1450, transport: 63, groceries: 350, utilities: 200 },
  frankfurt: { rent: 1550, transport: 63, groceries: 350, utilities: 200 },
  cologne: { rent: 1350, transport: 63, groceries: 340, utilities: 190 },
};

export const CITY_ORDER: CityKey[] = ["berlin", "munich", "hamburg", "frankfurt", "cologne"];

export type GrossNetComparisonInput = {
  grossAnnual: number;
  taxClass: TaxClass;
  healthRate: number;
  churchTax: boolean;
  childlessCare: boolean;
  cityA: CityCosts;
  cityB: CityCosts;
};

export type GrossNetComparisonResult = {
  gross: number;
  pension: number;
  unemployment: number;
  health: number;
  care: number;
  incomeTax: number;
  solidarity: number;
  churchTax: number;
  monthlyNet: number;
  totalA: number;
  totalB: number;
  surplusA: number;
  surplusB: number;
  diff: number;
  betterCity: "A" | "B" | null;
};

export function parseLocalizedNumber(value: string): number {
  return Number(value.trim().replace(",", "."));
}

function getTaxClassFactor(taxClass: TaxClass): number {
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
}

function calculateIncomeTaxApprox(taxableIncome: number): number {
  if (taxableIncome <= 12000) return 0;
  if (taxableIncome <= 20000) return (taxableIncome - 12000) * 0.14;
  if (taxableIncome <= 66000) return 1120 + (taxableIncome - 20000) * 0.3;
  if (taxableIncome <= 278000) return 14920 + (taxableIncome - 66000) * 0.42;
  return 103960 + (taxableIncome - 278000) * 0.45;
}

export function calculateGrossNetComparison(
  input: GrossNetComparisonInput
): GrossNetComparisonResult | null {
  const { grossAnnual, healthRate, cityA, cityB, churchTax, childlessCare, taxClass } = input;
  const allCosts = [...Object.values(cityA), ...Object.values(cityB)];

  if (
    !Number.isFinite(grossAnnual) ||
    !Number.isFinite(healthRate) ||
    grossAnnual <= 0 ||
    healthRate <= 0 ||
    healthRate > 30 ||
    allCosts.some((value) => !Number.isFinite(value) || value < 0)
  ) {
    return null;
  }

  const pension = grossAnnual * 0.093;
  const unemployment = grossAnnual * 0.013;
  const health = grossAnnual * ((healthRate / 100) / 2);
  const care = grossAnnual * (childlessCare ? 0.024 : 0.018);
  const socialContributions = pension + unemployment + health + care;

  const taxable = Math.max(grossAnnual - socialContributions - 12000, 0);
  const estimatedTaxBase = calculateIncomeTaxApprox(taxable);
  const incomeTax = estimatedTaxBase * getTaxClassFactor(taxClass);
  const solidarity = incomeTax > 18000 ? incomeTax * 0.055 : 0;
  const churchTaxAmount = churchTax ? incomeTax * 0.09 : 0;

  const annualNet = Math.max(
    grossAnnual - socialContributions - incomeTax - solidarity - churchTaxAmount,
    0
  );
  const monthlyNet = annualNet / 12;

  const totalA = cityA.rent + cityA.transport + cityA.groceries + cityA.utilities;
  const totalB = cityB.rent + cityB.transport + cityB.groceries + cityB.utilities;
  const surplusA = monthlyNet - totalA;
  const surplusB = monthlyNet - totalB;

  return {
    gross: grossAnnual,
    pension,
    unemployment,
    health,
    care,
    incomeTax,
    solidarity,
    churchTax: churchTaxAmount,
    monthlyNet,
    totalA,
    totalB,
    surplusA,
    surplusB,
    diff: Math.abs(surplusA - surplusB),
    betterCity: surplusA === surplusB ? null : surplusA > surplusB ? "A" : "B",
  };
}
