import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProjectTotal,
  calculateProjectDeliverySpecs,
  diagnoseBusinessNeed,
  getTotalBonusValue,
  BASE_PRICES,
} from './calculator.ts';

test('calculates base one page price correctly', () => {
  const total = calculateProjectTotal({
    projectType: 'page',
    pagesCount: 1,
    features: [],
  });
  assert.equal(total, BASE_PRICES.page);
  assert.equal(total, 180);
});

test('calculates multi-page additions correctly', () => {
  const total = calculateProjectTotal({
    projectType: 'page',
    pagesCount: 4, // 3 additional pages * 50 = +150
    features: [],
  });
  assert.equal(total, 180 + 150);
});

test('calculates combo project with selected features', () => {
  const total = calculateProjectTotal({
    projectType: 'both',
    pagesCount: 1,
    features: ['pix_checkout', 'smart_booking'], // 90 + 110 = 200
  });
  assert.equal(total, 550 + 200);
});

test('calculates honest delivery specs without fake revenue claims', () => {
  const specs = calculateProjectDeliverySpecs('both', 3);
  assert.equal(specs.estimatedDeliveryDays, '7 a 10 dias úteis');
  assert.equal(specs.monthlyFee, 0);
  assert.equal(specs.includedInfraCount, 5);
});

test('diagnoses practical business need accurately', () => {
  const diag = diagnoseBusinessNeed('whatsapp_delay');
  assert.equal(diag.recommendedScope, 'Agilidade no Atendimento');
  assert.equal(diag.startingPrice, 280);
  assert.equal(diag.deliverables.length, 4);
});

test('calculates exclusive bonus package value correctly', () => {
  const bonusVal = getTotalBonusValue();
  assert.equal(bonusVal, 480 + 80 + 120 + 150 + 200);
  assert.equal(bonusVal, 1030);
});
