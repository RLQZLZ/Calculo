import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pr,
  pd,
  conc,
  fmt,
  num,
  rate2dph,
  dph2rate,
  dose2amt,
  amt2dose,
  calculatePesos,
  getEffectiveWeight,
  holliday,
} from './calculator';

test('conc calculates concentration accurately', () => {
  // Propofol 1000 mg in 100 mL = 10 mg/mL
  assert.equal(conc({ m: 1000, um: 'mg', v: 100, d: 'sin diluir' }), 10);
  // Norepinephrine 4 mg in 100 mL = 0.04 mg/mL
  assert.equal(conc({ m: 4, um: 'mg', v: 100, d: 'DAD 5%' }), 0.04);
  // Dexmedetomidine 200 mcg in 50 mL = 4 mcg/mL = 0.004 mg/mL
  assert.equal(conc({ m: 200, um: 'mcg', v: 50, d: 'SSN 0.9%' }), 0.004);
});

test('rate conversion and reverse conversion', () => {
  const W = 70;
  // Propofol 6 mg/kg/hr for 70 kg -> dph = 420 mg/hr
  const dph = rate2dph(6, 'mg/kg/hr', W);
  assert.equal(dph, 420);
  assert.equal(dph2rate(dph, 'mg/kg/hr', W), 6);

  // Remifentanil 0.1 mcg/kg/min -> 0.1 * 1e-3 * 70 * 60 = 0.42 mg/hr
  const remiDph = rate2dph(0.1, 'mcg/kg/min', W);
  assert.equal(Math.round(remiDph * 10000) / 10000, 0.42);
  assert.equal(Math.round(dph2rate(remiDph, 'mcg/kg/min', W) * 100) / 100, 0.1);
});

test('bolus conversion and reverse conversion', () => {
  const W = 70;
  // Propofol 2 mg/kg -> 140 mg
  const amt = dose2amt(2, 'mg/kg', W);
  assert.equal(amt, 140);
  assert.equal(amt2dose(amt, 'mg/kg', W), 2);

  // Fentanyl 2 mcg/kg -> 140 mcg = 0.14 mg
  const fentAmt = dose2amt(2, 'mcg/kg', W);
  assert.equal(fentAmt, 0.14);
  assert.equal(amt2dose(fentAmt, 'mcg/kg', W), 2);
});

test('pesos calculates anthropometrics correctly', () => {
  // Male, 70 kg, 170 cm
  const metrics = calculatePesos({ peso: 70, talla: 170, edad: 40, sexo: 'm' });
  // 170 cm = 66.929 inches, over = 6.929 inches. PI = 50 + 2.3 * 6.929 ≈ 65.9
  assert.ok(metrics.PI > 65 && metrics.PI < 67);
  // IMC = 70 / (1.7^2) = 24.22
  assert.ok(metrics.IMC > 24 && metrics.IMC < 25);
  // SC = sqrt(170 * 70 / 3600) = sqrt(3.3055) ≈ 1.82
  assert.ok(metrics.SC > 1.8 && metrics.SC < 1.85);

  assert.equal(getEffectiveWeight({ peso: 70, talla: 170, edad: 40, sexo: 'm' }, 'total'), 70);
});

test('holliday fluid rates', () => {
  assert.equal(holliday(8), 32); // 8 * 4
  assert.equal(holliday(15), 50); // 40 + (15 - 10) * 2 = 50
  assert.equal(holliday(25), 65); // 60 + (25 - 20) = 65
});

test('fmt formats numbers cleanly', () => {
  assert.equal(fmt(70), '70');
  assert.equal(fmt(0.15), '0.15');
  assert.equal(fmt(12.5), '12.5');
  assert.equal(fmt(0), '0');
  assert.equal(fmt(''), '');
});
