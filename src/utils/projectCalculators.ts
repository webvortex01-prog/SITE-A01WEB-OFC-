export interface BurgerBuildConfig {
  breadPrice: number;
  pattyCount: 1 | 2 | 3;
  cheesePrice: number;
  extrasTotal: number;
  isCombo: boolean;
}

export function calculateCustomBurgerPrice(config: BurgerBuildConfig): {
  unitPrice: number;
  calories: number;
  proteinGrams: number;
} {
  const basePattyPrice = config.pattyCount === 1 ? 22.9 : config.pattyCount === 2 ? 31.9 : 39.9;
  const comboPrice = config.isCombo ? 14.9 : 0;
  const unitPrice = Number(
    (basePattyPrice + config.breadPrice + config.cheesePrice + config.extrasTotal + comboPrice).toFixed(2)
  );
  const calories = 280 + config.pattyCount * 210 + Math.round(config.extrasTotal * 18) + (config.isCombo ? 380 : 0);
  const proteinGrams = 9 + config.pattyCount * 23 + (config.cheesePrice > 0 ? 7 : 0);
  return { unitPrice, calories, proteinGrams };
}

export function calculateMarketplaceSavings(
  monthlyOrders: number,
  avgTicket: number
): {
  grossMonthly: number;
  ifoodCommissionCost: number;
  ownChannelFee: number;
  monthlyNetSavings: number;
  annualSavings: number;
} {
  const grossMonthly = Math.max(0, monthlyOrders) * Math.max(0, avgTicket);
  const ifoodCommissionCost = Math.round(grossMonthly * 0.27);
  const ownChannelFee = Math.round(grossMonthly * 0.0099); // PIX gateway ~0.99%
  const monthlyNetSavings = Math.max(0, ifoodCommissionCost - ownChannelFee);
  const annualSavings = monthlyNetSavings * 12;
  return {
    grossMonthly,
    ifoodCommissionCost,
    ownChannelFee,
    monthlyNetSavings,
    annualSavings,
  };
}

export function calculateHalfAndHalfPizzaPrice(
  leftPrice: number,
  rightPrice: number,
  crustAddonPrice: number,
  quantity: number = 1
): number {
  const base = (leftPrice + rightPrice) / 2;
  return Number(((base + crustAddonPrice) * Math.max(1, quantity)).toFixed(2));
}

export function calculateTattooEstimate(
  sizeCm: number,
  styleRate: number,
  painIndex: number,
  isCoverUp: boolean
): {
  estimatedPrice: number;
  depositAmount: number;
  sessionsCount: number;
  hoursTotal: number;
} {
  const baseCost = 220 + sizeCm * styleRate;
  const coverUpMultiplier = isCoverUp ? 1.25 : 1.0;
  const painFactor = painIndex >= 8 ? 1.08 : 1.0;
  const rawPrice = baseCost * coverUpMultiplier * painFactor;
  const estimatedPrice = Math.round(rawPrice / 10) * 10;
  const depositAmount = Math.round(estimatedPrice * 0.3);
  const hoursTotal = Math.max(2, Math.round((sizeCm * (isCoverUp ? 0.28 : 0.22)) * 10) / 10);
  const sessionsCount = hoursTotal > 5.5 ? Math.ceil(hoursTotal / 5) : 1;
  return {
    estimatedPrice,
    depositAmount,
    sessionsCount,
    hoursTotal,
  };
}

export function calculateTaxRecoveryEstimate(
  monthlyRevenueBrl: number,
  regime: 'lucro_real' | 'lucro_presumido' | 'simples_nacional',
  yearsAudited: number = 5
): {
  estimatedRecovery: number;
  successFee: number;
  netClientBenefit: number;
} {
  const rate =
    regime === 'lucro_real' ? 0.024 : regime === 'lucro_presumido' ? 0.018 : 0.011;
  const months = Math.min(60, Math.max(12, yearsAudited * 12));
  const estimatedRecovery = Math.round(monthlyRevenueBrl * months * rate);
  const successFee = Math.round(estimatedRecovery * 0.2);
  const netClientBenefit = estimatedRecovery - successFee;
  return { estimatedRecovery, successFee, netClientBenefit };
}

export function calculateArchitectureProjectFee(
  areaM2: number,
  standard: 'essencial' | 'alto_padrao' | 'assinatura_turnkey',
  includeLandscaping: boolean
): {
  projectFee: number;
  estimatedWorkCost: number;
  monthsDuration: number;
} {
  const feePerM2 =
    standard === 'essencial' ? 190 : standard === 'alto_padrao' ? 280 : 390;
  const workPerM2 =
    standard === 'essencial' ? 4800 : standard === 'alto_padrao' ? 7200 : 10500;
  const landscapingFee = includeLandscaping ? areaM2 * 35 : 0;
  const projectFee = Math.round(areaM2 * feePerM2 + landscapingFee);
  const estimatedWorkCost = Math.round(areaM2 * workPerM2);
  const monthsDuration = Math.max(4, Math.round(areaM2 / 65));
  return { projectFee, estimatedWorkCost, monthsDuration };
}

export function calculateSaasRoiSavings(
  teamSize: number,
  hoursSavedPerWeekPerPerson: number,
  hourlyCostBrl: number,
  planMonthlyCost: number
): {
  monthlyProductivityGain: number;
  netMonthlyRoi: number;
  roiMultiple: number;
} {
  const monthlyHours = teamSize * hoursSavedPerWeekPerPerson * 4;
  const monthlyProductivityGain = Math.round(monthlyHours * hourlyCostBrl);
  const netMonthlyRoi = monthlyProductivityGain - planMonthlyCost;
  const roiMultiple = planMonthlyCost > 0 ? Number((monthlyProductivityGain / planMonthlyCost).toFixed(1)) : 1;
  return { monthlyProductivityGain, netMonthlyRoi, roiMultiple };
}
