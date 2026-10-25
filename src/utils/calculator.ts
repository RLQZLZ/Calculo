import { Dilution, Patient, WeightMode } from '../types';

export const AMT: Record<string, { f: number; fam: string }> = {
  ng: { f: 1e-6, fam: 'g' },
  mcg: { f: 1e-3, fam: 'g' },
  mg: { f: 1, fam: 'g' },
  g: { f: 1e3, fam: 'g' },
  mU: { f: 1e-3, fam: 'U' },
  U: { f: 1, fam: 'U' },
  kU: { f: 1e3, fam: 'U' },
  mEq: { f: 1, fam: 'mEq' },
  mmol: { f: 1, fam: 'mmol' },
  mL: { f: 1, fam: 'mL' },
};

export const TF: Record<string, number> = {
  min: 60,
  hr: 1,
};

export const RATEU: Record<string, string[]> = {
  g: ['ng/kg/min', 'mcg/kg/min', 'mcg/kg/hr', 'mg/kg/min', 'mg/kg/hr', 'mcg/min', 'mcg/hr', 'mg/min', 'mg/hr', 'g/hr'],
  U: ['mU/kg/min', 'mU/min', 'U/kg/hr', 'U/min', 'U/hr'],
  mEq: ['mEq/kg/hr', 'mEq/hr'],
  mmol: ['mmol/kg/hr', 'mmol/hr'],
  mL: ['mL/kg/min', 'mL/kg/hr', 'mL/hr'],
};

export const ABSU: Record<string, string[]> = {
  g: ['mcg/min', 'mcg/hr', 'mg/min', 'mg/hr', 'g/hr'],
  U: ['mU/min', 'U/min', 'U/hr'],
  mEq: ['mEq/hr'],
  mmol: ['mmol/hr'],
  mL: ['mL/hr'],
};

export const DOSEU: Record<string, string[]> = {
  g: ['ng/kg', 'mcg/kg', 'mg/kg', 'g/kg', 'mcg', 'mg', 'g'],
  U: ['U/kg', 'U', 'mU'],
  mEq: ['mEq/kg', 'mEq'],
  mmol: ['mmol/kg', 'mmol'],
  mL: ['mL/kg', 'mL'],
};

export const DILU = [
  'SSN 0.9%',
  'DAD 5%',
  'agua estéril',
  'Ringer lactato',
  'sin diluir',
  'solución lista',
  'diluyente propio',
];

export interface ParsedRate {
  amt: string;
  f: number;
  fam: string;
  kg: boolean;
  tf: number;
  t: string;
}

export function pr(u: string): ParsedRate {
  const p = String(u).split('/');
  const a = p[0];
  const t = p[p.length - 1];
  return {
    amt: a,
    f: (AMT[a] || { f: 1 }).f,
    fam: (AMT[a] || { fam: 'g' }).fam,
    kg: p.indexOf('kg') > 0,
    tf: TF[t] || 1,
    t: TF[t] ? t : 'hr',
  };
}

export interface ParsedDose {
  amt: string;
  f: number;
  fam: string;
  kg: boolean;
}

export function pd(u: string): ParsedDose {
  const p = String(u).split('/');
  const a = p[0];
  return {
    amt: a,
    f: (AMT[a] || { f: 1 }).f,
    fam: (AMT[a] || { fam: 'g' }).fam,
    kg: p.indexOf('kg') > 0,
  };
}

export function conc(dil?: Dilution): number {
  if (!dil || !dil.v || dil.v <= 0) return 1;
  const f = (AMT[dil.um] || { f: 1 }).f;
  return (dil.m * f) / dil.v;
}

export function fmt(x: number | string | null | undefined): string {
  if (x === '' || x == null) return '';
  const n = typeof x === 'string' ? parseFloat(x.replace(',', '.')) : x;
  if (!isFinite(n)) return '';
  const a = Math.abs(n);
  const d = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : a >= 0.1 ? 2 : a >= 0.01 ? 3 : 4;
  let s = Number(n).toFixed(d);
  if (s.indexOf('.') > -1) {
    s = s.replace(/0+$/, '').replace(/\.$/, '');
  }
  return s;
}

export function num(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = parseFloat(String(v).replace(',', '.'));
  return isFinite(n) ? n : 0;
}

export function rate2dph(val: number, unit: string, W: number): number {
  const u = pr(unit);
  return val * u.f * (u.kg ? W : 1) * u.tf;
}

export function dph2rate(dph: number, unit: string, W: number): number {
  const u = pr(unit);
  const den = u.f * (u.kg ? W : 1) * u.tf;
  return den ? dph / den : 0;
}

export function dose2amt(val: number, unit: string, W: number): number {
  const u = pd(unit);
  return val * u.f * (u.kg ? W : 1);
}

export function amt2dose(amt: number, unit: string, W: number): number {
  const u = pd(unit);
  const den = u.f * (u.kg ? W : 1);
  return den ? amt / den : 0;
}

export function defAbs(u: string, fam: string): string {
  const parsed = pr(u);
  const a = parsed.amt + '/hr';
  if (ABSU[fam] && ABSU[fam].indexOf(a) > -1) {
    return a;
  }
  return ABSU[fam] ? ABSU[fam][ABSU[fam].length - 1] : 'mg/hr';
}

export interface WeightMetrics {
  W: number;
  PI: number;
  PAj: number;
  PM: number;
  IMC: number;
  SC: number;
}

export function calculatePesos(pac: Patient): WeightMetrics {
  const W = num(pac.peso) || 0;
  const T = num(pac.talla) || 0;
  const inch = T / 2.54;
  const over = Math.max(0, inch - 60);

  // Devine Ideal Weight
  const PI = T ? (pac.sexo === 'm' ? 50 : 45.5) + 2.3 * over : 0;

  // Adjusted Body Weight
  const PAj = PI ? PI + 0.4 * (W - PI) : 0;

  // Body Mass Index
  const IMC = T ? W / Math.pow(T / 100, 2) : 0;

  // Janmahasatian Lean Body Mass (LBM)
  const PM =
    T && IMC
      ? pac.sexo === 'm'
        ? (9270 * W) / (6680 + 216 * IMC)
        : (9270 * W) / (8780 + 244 * IMC)
      : 0;

  // Mosteller Body Surface Area
  const SC = T && W ? Math.sqrt((T * W) / 3600) : 0;

  return { W, PI, PAj, PM, IMC, SC };
}

export function getEffectiveWeight(pac: Patient, mode: WeightMode): number {
  const q = calculatePesos(pac);
  if (mode === 'ideal' && q.PI) return q.PI;
  if (mode === 'ajustado' && q.PAj) return q.PAj;
  if (mode === 'magro' && q.PM) return q.PM;
  return q.W;
}

export const WLBL: Record<WeightMode, string> = {
  total: 'total',
  ideal: 'ideal',
  ajustado: 'ajust.',
  magro: 'magro',
};

export function holliday(w: number): number {
  return w <= 10 ? w * 4 : w <= 20 ? 40 + (w - 10) * 2 : 60 + (w - 20);
}
