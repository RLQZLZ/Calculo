import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ABSU,
  AMT,
  amt2dose,
  conc,
  defAbs,
  DILU,
  DOSEU,
  dose2amt,
  dph2rate,
  fmt,
  getEffectiveWeight,
  num,
  pd,
  pr,
  RATEU,
  rate2dph,
  WLBL,
} from '../../utils/calculator';
import { Dilution } from '../../types';

export const DrugDetailView: React.FC = () => {
  const {
    data,
    selectedDrugId,
    drugMode,
    setDrugMode,
    weightMode,
    toggleFavorite,
    saveDrug,
  } = useApp();

  const drug = data.drugs.find((d) => d.id === selectedDrugId);
  if (!drug) return null;

  const W = getEffectiveWeight(data.pac, weightMode);

  // Infusion state
  const [dph, setDph] = useState<number>(() => {
    if (drug.inf) {
      return rate2dph(drug.inf.lo, drug.inf.u, W);
    }
    return 0;
  });
  const [rateUnit, setRateUnit] = useState<string>(drug.inf?.u || 'mg/kg/hr');
  const [absUnit, setAbsUnit] = useState<string>(() => {
    if (drug.inf) {
      const fam = (AMT[pr(drug.inf.u).amt] || { fam: 'g' }).fam;
      return defAbs(drug.inf.u, fam);
    }
    return 'mg/hr';
  });

  // Bolus state
  const [amt, setAmt] = useState<number>(() => {
    if (drug.bol) {
      return dose2amt(drug.bol.lo, drug.bol.u, W);
    }
    return 0;
  });
  const [doseUnit, setDoseUnit] = useState<string>(drug.bol?.u || 'mg/kg');
  const [amtUnit, setAmtUnit] = useState<string>(() => {
    if (drug.bol) {
      return pd(drug.bol.u).amt;
    }
    return 'mg';
  });

  // Reset values when switching drug
  useEffect(() => {
    if (drug.inf) {
      setDph(rate2dph(drug.inf.lo, drug.inf.u, W));
      setRateUnit(drug.inf.u);
      const fam = (AMT[pr(drug.inf.u).amt] || { fam: 'g' }).fam;
      setAbsUnit(defAbs(drug.inf.u, fam));
    }
    if (drug.bol) {
      setAmt(dose2amt(drug.bol.lo, drug.bol.u, W));
      setDoseUnit(drug.bol.u);
      setAmtUnit(pd(drug.bol.u).amt);
    }
  }, [drug.id, W]);

  const updateInfDilution = (patch: Partial<Dilution>) => {
    if (!drug.inf) return;
    const nextDil = { ...drug.inf.dil, ...patch };
    const nextDrug = { ...drug, inf: { ...drug.inf, dil: nextDil } };
    saveDrug(nextDrug);
  };

  const updateBolDilution = (patch: Partial<Dilution>) => {
    if (!drug.bol) return;
    const nextDil = { ...drug.bol.dil, ...patch };
    const nextDrug = { ...drug, bol: { ...drug.bol, dil: nextDil } };
    saveDrug(nextDrug);
  };

  const availableModes: { id: 'inf' | 'bol' | 'nota'; label: string }[] = [];
  if (drug.inf) availableModes.push({ id: 'inf', label: 'Infusión' });
  if (drug.bol) availableModes.push({ id: 'bol', label: 'Bolo' });
  availableModes.push({ id: 'nota', label: 'Nota' });

  // Render Dilution Card
  const renderDilutionCard = (
    dil: Dilution,
    fam: string,
    onUpdate: (patch: Partial<Dilution>) => void
  ) => {
    const currentConc = conc(dil);
    const concDisplay = currentConc / (AMT[dil.um] || { f: 1 }).f;

    const availableMassUnits = Object.keys(AMT).filter((k) => AMT[k].fam === fam);
    const diluentOptions = DILU.includes(dil.d) ? DILU : [dil.d, ...DILU];

    return (
      <div
        className="border rounded-[14px] p-3.5 mb-3"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div
          className="text-[12px] uppercase tracking-wider font-bold mb-2.5"
          style={{ color: 'var(--dim)' }}
        >
          Dilución
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Fármaco
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={dil.m || ''}
            onChange={(e) => onUpdate({ m: num(e.target.value) })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <select
            value={dil.um}
            onChange={(e) => onUpdate({ um: e.target.value })}
            className="border text-[14px] px-2 py-2.5 rounded-[10px] max-w-[132px] focus:outline-none"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          >
            {availableMassUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            en
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={dil.v || ''}
            onChange={(e) => onUpdate({ v: Math.max(0.1, num(e.target.value)) })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            mL
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            de
          </span>
          <select
            value={dil.d}
            onChange={(e) => onUpdate({ d: e.target.value })}
            className="flex-1 border text-[14px] px-2 py-2.5 rounded-[10px] focus:outline-none"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          >
            {diluentOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            =
          </span>
          <input
            readOnly
            value={fmt(concDisplay)}
            className="flex-1 min-w-0 text-[19px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none bg-transparent"
            style={{ color: 'var(--acc)' }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            {dil.um}/mL
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {Boolean(drug.alerta) && (
        <div
          className="border rounded-[10px] px-3 py-2.5 text-[13px] mb-2.5"
          style={{
            background: 'var(--alertBg)',
            borderColor: 'rgba(248,113,113,0.4)',
            color: 'var(--alertTx)',
          }}
        >
          ⚠ Fármaco de alto riesgo — verifica dilución, bomba y rótulo antes de administrar.
        </div>
      )}

      {/* Mode segments */}
      <div
        className="flex rounded-[11px] p-[3px] mb-3.5 select-none"
        style={{ background: 'var(--card2)' }}
      >
        {availableModes.map((m) => {
          const isActive = drugMode === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setDrugMode(m.id)}
              className="flex-1 text-center py-2 px-1 rounded-[9px] text-[14px] font-semibold cursor-pointer transition-all"
              style={{
                background: isActive ? 'var(--acc)' : 'transparent',
                color: isActive ? 'var(--accTxt)' : 'var(--dim)',
              }}
            >
              {m.label}
            </div>
          );
        })}
      </div>

      {/* Infusion Calculator */}
      {drugMode === 'inf' && drug.inf && (() => {
        const c = conc(drug.inf.dil);
        const fam = (AMT[pr(drug.inf.u).amt] || { fam: 'g' }).fam;
        const currentRate = dph2rate(dph, rateUnit, W);
        const currentAbs = dph2rate(dph, absUnit, W);
        const currentMl = c ? dph / c : 0;
        const gotitas = c ? (dph / c) * data.prefs.gotas / 60 : 0;

        const loDph = rate2dph(drug.inf.lo, drug.inf.u, W);
        const hiDph = rate2dph(drug.inf.hi, drug.inf.u, W);
        const isOut = dph < loDph * 0.999 || dph > hiDph * 1.001;

        return (
          <>
            <div
              className="border rounded-[14px] p-3.5 mb-3"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--line)',
              }}
            >
              {/* Rate input */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  Ritmo
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentRate)}
                  onChange={(e) => {
                    const val = num(e.target.value);
                    setDph(rate2dph(val, rateUnit, W));
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
                <select
                  value={rateUnit}
                  onChange={(e) => setRateUnit(e.target.value)}
                  className="border text-[14px] px-2 py-2.5 rounded-[10px] max-w-[132px] focus:outline-none"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                >
                  {RATEU[fam].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Absolute Rate input */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  =
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentAbs)}
                  onChange={(e) => {
                    const val = num(e.target.value);
                    setDph(rate2dph(val, absUnit, W));
                  }}
                  className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                />
                <select
                  value={absUnit}
                  onChange={(e) => setAbsUnit(e.target.value)}
                  className="border text-[14px] px-2 py-2.5 rounded-[10px] max-w-[132px] focus:outline-none"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                >
                  {ABSU[fam].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* mL/hr Result */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  =
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentMl)}
                  onChange={(e) => {
                    const ml = num(e.target.value);
                    setDph(ml * c);
                  }}
                  className="flex-1 min-w-0 text-[26px] font-bold text-right px-3 py-1 rounded-[10px] tabular-nums bg-transparent focus:outline-none"
                  style={{ color: isOut ? 'var(--bad)' : 'var(--acc)' }}
                />
                <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
                  mL/hr
                </span>
              </div>

              {/* Habitual Range Information */}
              <div
                className="text-[13px] pt-2 pb-0.5 border-t border-dashed mt-1.5 leading-relaxed"
                style={{ borderColor: 'var(--line)', color: 'var(--dim)' }}
              >
                Rango{' '}
                <b style={{ color: 'var(--txt)' }}>
                  {fmt(drug.inf.lo)} – {fmt(drug.inf.hi)}
                </b>{' '}
                {drug.inf.u}
                <br />= <b style={{ color: 'var(--txt)' }}>{fmt(c ? loDph / c : 0)} – {fmt(c ? hiDph / c : 0)}</b>{' '}
                mL/hr con esta dilución
                <br />≈ <b style={{ color: 'var(--txt)' }}>{fmt(gotitas)}</b> gotas/min ({data.prefs.gotas} gotas/mL) ·
                peso {WLBL[weightMode]} {fmt(W)} kg
                {isOut && (
                  <>
                    <br />
                    <span style={{ color: 'var(--bad)' }}>Fuera del rango habitual</span>
                  </>
                )}
              </div>
            </div>

            {renderDilutionCard(drug.inf.dil, fam, updateInfDilution)}
          </>
        );
      })()}

      {/* Bolus Calculator */}
      {drugMode === 'bol' && drug.bol && (() => {
        const c = conc(drug.bol.dil);
        const fam = (AMT[pd(drug.bol.u).amt] || { fam: 'g' }).fam;
        const currentDose = amt2dose(amt, doseUnit, W);
        const currentAmtDisplay = amt / (AMT[amtUnit] || { f: 1 }).f;
        const currentMl = c ? amt / c : 0;

        const loAmt = dose2amt(drug.bol.lo, drug.bol.u, W);
        const hiAmt = dose2amt(drug.bol.hi, drug.bol.u, W);
        const topeC = drug.bol.tope ? drug.bol.tope * (AMT[pd(drug.bol.u).amt] || { f: 1 }).f : 0;
        const isOut = amt < loAmt * 0.999 || amt > hiAmt * 1.001;
        const isOver = Boolean(topeC && amt > topeC * 1.001);

        const availableAmtUnits = Object.keys(AMT).filter((k) => AMT[k].fam === fam);

        return (
          <>
            <div
              className="border rounded-[14px] p-3.5 mb-3"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--line)',
              }}
            >
              {/* Dose input */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  Dosis
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentDose)}
                  onChange={(e) => {
                    const val = num(e.target.value);
                    setAmt(dose2amt(val, doseUnit, W));
                  }}
                  className={`flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none ${
                    isOut || isOver ? 'border-[var(--bad)] text-[var(--bad)]' : 'focus:border-[var(--acc)]'
                  }`}
                  style={{
                    background: 'var(--bg2)',
                    borderColor: isOut || isOver ? 'var(--bad)' : 'var(--line)',
                    color: isOut || isOver ? 'var(--bad)' : 'var(--txt)',
                  }}
                />
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value)}
                  className="border text-[14px] px-2 py-2.5 rounded-[10px] max-w-[132px] focus:outline-none"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                >
                  {DOSEU[fam].map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* Absolute Amount input */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  =
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentAmtDisplay)}
                  onChange={(e) => {
                    const val = num(e.target.value);
                    setAmt(val * (AMT[amtUnit] || { f: 1 }).f);
                  }}
                  className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                />
                <select
                  value={amtUnit}
                  onChange={(e) => setAmtUnit(e.target.value)}
                  className="border text-[14px] px-2 py-2.5 rounded-[10px] max-w-[132px] focus:outline-none"
                  style={{
                    background: 'var(--bg2)',
                    borderColor: 'var(--line)',
                    color: 'var(--txt)',
                  }}
                >
                  {availableAmtUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* mL Result */}
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                  =
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={fmt(currentMl)}
                  onChange={(e) => {
                    const ml = num(e.target.value);
                    setAmt(ml * c);
                  }}
                  className="flex-1 min-w-0 text-[26px] font-bold text-right px-3 py-1 rounded-[10px] tabular-nums bg-transparent focus:outline-none"
                  style={{ color: isOut || isOver ? 'var(--bad)' : 'var(--acc)' }}
                />
                <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
                  mL
                </span>
              </div>

              {/* Range Information */}
              <div
                className="text-[13px] pt-2 pb-0.5 border-t border-dashed mt-1.5 leading-relaxed"
                style={{ borderColor: 'var(--line)', color: 'var(--dim)' }}
              >
                Rango{' '}
                <b style={{ color: 'var(--txt)' }}>
                  {fmt(drug.bol.lo)} – {fmt(drug.bol.hi)}
                </b>{' '}
                {drug.bol.u} ={' '}
                <b style={{ color: 'var(--txt)' }}>
                  {fmt(loAmt / (AMT[amtUnit] || { f: 1 }).f)} – {fmt(hiAmt / (AMT[amtUnit] || { f: 1 }).f)}
                </b>{' '}
                {amtUnit}
                {Boolean(drug.bol.tope) && (
                  <>
                    <br />
                    Máximo por dosis{' '}
                    <b style={{ color: 'var(--txt)' }}>
                      {fmt(drug.bol.tope)} {pd(drug.bol.u).amt}
                    </b>
                  </>
                )}
                {drug.bol.via && (
                  <>
                    <br />
                    Vía: <b style={{ color: 'var(--txt)' }}>{drug.bol.via}</b>
                  </>
                )}
                <br />
                peso {WLBL[weightMode]} {fmt(W)} kg
                {isOver ? (
                  <>
                    <br />
                    <span style={{ color: 'var(--bad)' }}>Supera el máximo por dosis</span>
                  </>
                ) : isOut ? (
                  <>
                    <br />
                    <span style={{ color: 'var(--bad)' }}>Fuera del rango habitual</span>
                  </>
                ) : null}
              </div>
            </div>

            {renderDilutionCard(drug.bol.dil, fam, updateBolDilution)}
          </>
        );
      })()}

      {/* Note Tab */}
      {drugMode === 'nota' && (
        <div
          className="border rounded-[14px] p-3.5 mb-3"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--line)',
          }}
        >
          <div className="whitespace-pre-wrap leading-relaxed text-[15px]" style={{ color: 'var(--txt)' }}>
            {drug.nota || 'Sin notas.'}
          </div>
        </div>
      )}

      {/* Favorite Toggle Button */}
      <button
        onClick={() => toggleFavorite(drug.id)}
        className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer border transition-colors hover:brightness-110 flex items-center justify-center gap-2"
        style={{
          background: 'var(--card2)',
          color: 'var(--txt)',
          borderColor: 'var(--line)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          style={{
            fill: drug.fav ? '#f59e0b' : 'none',
            stroke: drug.fav ? '#f59e0b' : 'currentColor',
            strokeWidth: 2,
          }}
        >
          <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
        <span>{drug.fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}</span>
      </button>
    </section>
  );
};
