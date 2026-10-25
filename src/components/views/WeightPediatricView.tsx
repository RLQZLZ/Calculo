import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculatePesos,
  fmt,
  holliday,
  num,
} from '../../utils/calculator';
import { WeightMode } from '../../types';

export const WeightPediatricView: React.FC = () => {
  const {
    data,
    updatePatient,
    weightMode,
    setWeightMode,
  } = useApp();

  const p = data.pac;
  const q = calculatePesos(p);
  const E = num(p.edad);
  const W = q.W;

  const isPediatric = E < 14 || W < 40;

  // Pediatric formulas
  const est = E < 1 ? W || 4 : (E + 4) * 2;
  const tetSin = E / 4 + 4;
  const tetCon = E / 4 + 3.5;
  const prof = E / 4 + 12;

  const renderStat = (label: string, val: number | string, unit: string) => (
    <div
      className="border rounded-[11px] p-2.5"
      style={{
        background: 'var(--bg2)',
        borderColor: 'var(--line)',
      }}
    >
      <s className="block no-underline text-[11.5px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--dim)' }}>
        {label}
      </s>
      <b className="text-[20px] tabular-nums" style={{ color: 'var(--txt)' }}>
        {fmt(val)} <span className="text-[12px] font-normal" style={{ color: 'var(--dim)' }}>{unit}</span>
      </b>
    </div>
  );

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {/* Patient Anthropometrics Card */}
      <div
        className="border rounded-[14px] p-3.5 mb-3"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Peso
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={p.peso || ''}
            onChange={(e) => updatePatient({ peso: num(e.target.value) })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            kg
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Talla
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={p.talla || ''}
            onChange={(e) => updatePatient({ talla: num(e.target.value) })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            cm
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Edad
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={p.edad || ''}
            onChange={(e) => updatePatient({ edad: num(e.target.value) })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            años
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Sexo
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updatePatient({ sexo: 'm' })}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border cursor-pointer font-medium transition-all ${
                p.sexo === 'm' ? 'font-bold' : ''
              }`}
              style={{
                background: p.sexo === 'm' ? 'var(--acc)' : 'var(--card2)',
                color: p.sexo === 'm' ? 'var(--accTxt)' : 'var(--dim)',
                borderColor: p.sexo === 'm' ? 'var(--acc)' : 'var(--line)',
              }}
            >
              Masculino
            </button>
            <button
              onClick={() => updatePatient({ sexo: 'f' })}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border cursor-pointer font-medium transition-all ${
                p.sexo === 'f' ? 'font-bold' : ''
              }`}
              style={{
                background: p.sexo === 'f' ? 'var(--acc)' : 'var(--card2)',
                color: p.sexo === 'f' ? 'var(--accTxt)' : 'var(--dim)',
                borderColor: p.sexo === 'f' ? 'var(--acc)' : 'var(--line)',
              }}
            >
              Femenino
            </button>
          </div>
        </div>
      </div>

      {/* Dosage Weights Header */}
      <div
        className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
        style={{ color: 'var(--dim)' }}
      >
        Pesos de dosificación
      </div>

      {/* Grid of Weights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3">
        {renderStat('Total', q.W, 'kg')}
        {renderStat('Ideal (Devine)', q.PI, 'kg')}
        {renderStat('Ajustado', q.PAj, 'kg')}
        {renderStat('Magro', q.PM, 'kg')}
        {renderStat('IMC', q.IMC, 'kg/m²')}
        {renderStat('Sup. corporal', q.SC, 'm²')}
      </div>

      {/* Weight mode selection chips */}
      <div className="flex gap-2 flex-wrap mb-2">
        {(['total', 'ideal', 'ajustado', 'magro'] as WeightMode[]).map((mode) => {
          const isActive = weightMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setWeightMode(mode)}
              className={`text-[12.5px] px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                isActive ? 'font-bold' : ''
              }`}
              style={{
                background: isActive ? 'var(--acc)' : 'var(--card2)',
                color: isActive ? 'var(--accTxt)' : 'var(--dim)',
                borderColor: isActive ? 'var(--acc)' : 'var(--line)',
              }}
            >
              {mode}
            </button>
          );
        })}
      </div>

      <div className="text-[12.5px] leading-relaxed mb-4" style={{ color: 'var(--dim)' }}>
        El peso marcado es el que usan todas las calculadoras. Propofol y relajantes: ajustado o ideal. Remifentanilo: magro.
        Hidrosolubles y sugammadex: total.
      </div>

      {/* Pediatric Emergency Calculator */}
      {isPediatric && (
        <div className="mt-4 pt-2 border-t" style={{ borderColor: 'var(--line)' }}>
          <div
            className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
            style={{ color: 'var(--dim)' }}
          >
            Pediatría
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-2.5">
            {renderStat('Peso estimado', est, 'kg')}
            {renderStat('TET sin balón', tetSin, 'mm DI')}
            {renderStat('TET con balón', tetCon, 'mm DI')}
            {renderStat('Profundidad', prof, 'cm')}
            {renderStat('Volumen tidal', W * 7, 'mL')}
            {renderStat('Líquidos 4-2-1', holliday(W), 'mL/hr')}
            {renderStat('Volemia', W * (E < 1 ? 80 : 70), 'mL')}
            {renderStat('Desfibrilación', W * 4, 'J')}
            {renderStat('Cardioversión', W * 1, 'J')}
            {renderStat('Adrenalina paro', W * 10, 'mcg')}
            {renderStat('Atropina', Math.max(100, W * 20), 'mcg')}
            {renderStat('Glucosa 10%', W * 2, 'mL')}
            {renderStat('Bolo cristaloide', W * 10, 'mL')}
            {renderStat('Sangrado permisible', W * 70 * 0.2, 'mL')}
          </div>

          <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
            Peso estimado APLS (edad+4)×2 · TET Cole · desfibrilación 4 J/kg · cardioversión 1 J/kg (2 J/kg si falla) · adrenalina 10 µg/kg.
          </div>
        </div>
      )}
    </section>
  );
};
