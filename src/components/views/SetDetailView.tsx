import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  conc,
  dose2amt,
  fmt,
  getEffectiveWeight,
  num,
  rate2dph,
} from '../../utils/calculator';

export const SetDetailView: React.FC = () => {
  const {
    data,
    selectedSetIdx,
    weightMode,
    openDrug,
    deleteSet,
  } = useApp();

  const currentSet = selectedSetIdx != null ? data.sets[selectedSetIdx] : null;
  const [itemValues, setItemValues] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    if (currentSet) {
      currentSet.items.forEach((it, idx) => {
        initial[idx] = it.val;
      });
    }
    return initial;
  });

  if (!currentSet) return null;

  const W = getEffectiveWeight(data.pac, weightMode);

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar el set «${currentSet.n}»?`)) {
      if (selectedSetIdx != null) {
        deleteSet(selectedSetIdx);
      }
    }
  };

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      <div
        className="border rounded-[14px] p-3.5 mb-3.5"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        {currentSet.items.map((it, idx) => {
          const drug = data.drugs.find((d) => d.id === it.d);
          if (!drug) return null;

          const isInf = it.modo === 'inf' ? Boolean(drug.inf) : !drug.bol;
          const config = isInf ? drug.inf : drug.bol;
          if (!config) return null;

          const val = itemValues[idx] !== undefined ? itemValues[idx] : it.val;
          const c = conc(config.dil);
          const amt = isInf
            ? rate2dph(val, config.u, W)
            : dose2amt(val, config.u, W);
          const mlResult = c ? amt / c : 0;

          const loAmt = isInf
            ? rate2dph(config.lo, config.u, W)
            : dose2amt(config.lo, config.u, W);
          const hiAmt = isInf
            ? rate2dph(config.hi, config.u, W)
            : dose2amt(config.hi, config.u, W);
          const isOut = amt < loAmt * 0.999 || amt > hiAmt * 1.001;

          return (
            <div
              key={idx}
              className={`py-3 ${idx < currentSet.items.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <b className="flex-1 text-[15px]" style={{ color: 'var(--txt)' }}>
                  {drug.n}
                </b>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: isInf ? 'rgba(56,189,248,0.16)' : 'rgba(52,211,153,0.16)',
                    color: isInf ? 'var(--acc)' : 'var(--ok)',
                  }}
                >
                  {isInf ? 'infusión' : 'bolo'}
                </span>
                <button
                  onClick={() => openDrug(drug.id, 'set')}
                  className="text-[18px] px-1 cursor-pointer transition-opacity hover:opacity-80"
                  style={{ color: 'var(--dim)' }}
                >
                  ›
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(val)}
                  onChange={(e) => {
                    const nextVal = num(e.target.value);
                    setItemValues((prev) => ({ ...prev, [idx]: nextVal }));
                    it.val = nextVal;
                  }}
                  className={`flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none ${
                    isOut ? 'border-[var(--bad)] text-[var(--bad)]' : 'focus:border-[var(--acc)]'
                  }`}
                  style={{
                    background: 'var(--bg2)',
                    borderColor: isOut ? 'var(--bad)' : 'var(--line)',
                    color: isOut ? 'var(--bad)' : 'var(--txt)',
                  }}
                />
                <span className="text-[13px] min-w-[78px]" style={{ color: 'var(--dim)' }}>
                  {config.u}
                </span>
                <span className="w-3.5 text-center text-[13px]" style={{ color: 'var(--dim)' }}>
                  =
                </span>
                <input
                  readOnly
                  value={fmt(mlResult)}
                  className="flex-1 min-w-0 text-[19px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums bg-transparent focus:outline-none"
                  style={{ color: isOut ? 'var(--bad)' : 'var(--acc)' }}
                />
                <span className="text-[13px] min-w-[50px]" style={{ color: 'var(--dim)' }}>
                  {isInf ? 'mL/hr' : 'mL'}
                </span>
              </div>

              <div className="text-[12.5px] leading-relaxed" style={{ color: 'var(--dim)' }}>
                {fmt(config.dil.m)} {config.dil.um} en {fmt(config.dil.v)} mL de {config.dil.d} · rango{' '}
                {fmt(config.lo)}–{fmt(config.hi)} {config.u}
                {isOut && <span style={{ color: 'var(--bad)' }}> · fuera de rango</span>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleDelete}
        className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer border transition-colors hover:brightness-110"
        style={{
          background: 'transparent',
          color: 'var(--bad)',
          borderColor: 'rgba(248,113,113,0.5)',
        }}
      >
        Eliminar set
      </button>
    </section>
  );
};
