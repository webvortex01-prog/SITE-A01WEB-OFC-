import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCustomBurgerPrice,
  calculateMarketplaceSavings,
  calculateHalfAndHalfPizzaPrice,
  calculateTattooEstimate,
  calculateTaxRecoveryEstimate,
  calculateArchitectureProjectFee,
  calculateSaasRoiSavings,
} from './projectCalculators.ts';

test('calculateCustomBurgerPrice computes accurate unit price, calories, and protein', () => {
  const res = calculateCustomBurgerPrice({
    breadPrice: 3,
    pattyCount: 2,
    cheesePrice: 4,
    extrasTotal: 6.5,
    isCombo: true,
  });
  assert.equal(res.unitPrice, 60.3);
  assert.ok(res.calories > 800);
  assert.equal(res.proteinGrams, 62);
});

test('calculateMarketplaceSavings computes 27% commission vs own channel savings', () => {
  const res = calculateMarketplaceSavings(1000, 60);
  assert.equal(res.grossMonthly, 60000);
  assert.equal(res.ifoodCommissionCost, 16200);
  assert.ok(res.annualSavings > 180000);
});

test('calculateHalfAndHalfPizzaPrice averages two halves and adds crust', () => {
  const price = calculateHalfAndHalfPizzaPrice(68, 84, 14, 1);
  assert.equal(price, 90);
});

test('calculateTattooEstimate calculates price, 30% deposit and sessions', () => {
  const est = calculateTattooEstimate(20, 60, 5, true);
  assert.ok(est.estimatedPrice > 1500);
  assert.equal(est.depositAmount, Math.round(est.estimatedPrice * 0.3));
  assert.ok(est.sessionsCount >= 1);
});

test('calculateTaxRecoveryEstimate calculates corporate tax recovery and net benefit', () => {
  const tax = calculateTaxRecoveryEstimate(500000, 'lucro_real', 5);
  assert.equal(tax.estimatedRecovery, 720000);
  assert.equal(tax.netClientBenefit, 576000);
});

test('calculateArchitectureProjectFee and calculateSaasRoiSavings return positive metrics', () => {
  const arch = calculateArchitectureProjectFee(400, 'alto_padrao', true);
  assert.equal(arch.projectFee, 126000);
  const saas = calculateSaasRoiSavings(15, 6, 80, 1490);
  assert.equal(saas.monthlyProductivityGain, 28800);
  assert.ok(saas.roiMultiple > 15);
});
