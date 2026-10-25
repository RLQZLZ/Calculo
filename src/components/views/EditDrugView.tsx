import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATS } from '../../data/drugs';
import {
  DOSEU,
  fmt,
  num,
  pd,
  RATEU,
} from '../../utils/calculator';
import { Drug } from '../../types';

export const EditDrugView: React.FC = () => {
  const {
    data,
    editingDrugId,
    saveDrug,
    deleteDrug,
    openDrug,
    setView,
  } = useApp();

  const originalDrug = data.drugs.find((d) => d.id === editingDrugId);
  const [draft, setDraft] = useState<Drug | null>(() => {
    return originalDrug ? JSON.parse(JSON.stringify(originalDrug)) : null;
  });

  if (!draft) return null;

  const handleSave = () => {
    saveDrug(draft);
    openDrug(draft.id);
  };

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar «${draft.n}» del catálogo?`)) {
      deleteDrug(draft.id);
      setView('cats');
    }
  };

  const allRateUnits = [
    ...RATEU.g,
    ...RATEU.U,
    ...RATEU.mEq,
    ...RATEU.mmol,
    ...RATEU.mL,
  ];

  const allDoseUnits = [
    ...DOSEU.g,
    ...DOSEU.U,
    ...DOSEU.mEq,
    ...DOSEU.mmol,
    ...DOSEU.mL,
  ];

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {/* Basic drug info */}
      <div
        className="border rounded-[14px] p-3.5 mb-3"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Nombre
          </span>
          <input
            type="text"
            value={draft.n}
            onChange={(e) => setDraft({ ...draft, n: e.target.value })}
            className="flex-1 min-w-0 border text-[15px] font-semibold text-left px-3 py-2 rounded-[10px] focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Categoría
          </span>
          <select
            value={draft.c}
            onChange={(e) => setDraft({ ...draft, c: e.target.value })}
            className="flex-1 border text-[14px] px-2 py-2.5 rounded-[10px] focus:outline-none"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          >
            {Object.keys(CATS).map((key) => (
              <option key={key} value={key}>
                {CATS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Favorito
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDraft({ ...draft, fav: draft.fav ? 0 : 1 })}
              className="text-[12.5px] px-3 py-1.5 rounded-full border cursor-pointer font-bold transition-all flex items-center gap-1"
              style={{
                background: draft.fav ? 'var(--acc)' : 'var(--card2)',
                color: draft.fav ? 'var(--accTxt)' : 'var(--dim)',
                borderColor: draft.fav ? 'var(--acc)' : 'var(--line)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
              </svg>
              <span>favorito</span>
            </button>
            <button
              type="button"
              onClick={() => setDraft({ ...draft, alerta: draft.alerta ? 0 : 1 })}
              className="text-[12.5px] px-3 py-1.5 rounded-full border cursor-pointer font-bold transition-all"
              style={{
                background: draft.alerta ? 'var(--acc)' : 'var(--card2)',
                color: draft.alerta ? 'var(--accTxt)' : 'var(--dim)',
                borderColor: draft.alerta ? 'var(--acc)' : 'var(--line)',
              }}
            >
              alto riesgo
            </button>
          </div>
        </div>
      </div>

      {/* Infusion config */}
      {draft.inf && (
        <>
          <div
            className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
            style={{ color: 'var(--dim)' }}
          >
            Infusión
          </div>
          <div
            className="border rounded-[14px] p-3.5 mb-3"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Unidad
              </span>
              <select
                value={draft.inf.u}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    inf: draft.inf ? { ...draft.inf, u: e.target.value } : undefined,
                  })
                }
                className="flex-1 border text-[14px] px-2 py-2.5 rounded-[10px] focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              >
                {allRateUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Mínimo
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={fmt(draft.inf.lo)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    inf: draft.inf ? { ...draft.inf, lo: num(e.target.value) } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[17px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Máximo
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={fmt(draft.inf.hi)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    inf: draft.inf ? { ...draft.inf, hi: num(e.target.value) } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[17px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Bolus config */}
      {draft.bol && (
        <>
          <div
            className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
            style={{ color: 'var(--dim)' }}
          >
            Bolo
          </div>
          <div
            className="border rounded-[14px] p-3.5 mb-3"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Unidad
              </span>
              <select
                value={draft.bol.u}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bol: draft.bol ? { ...draft.bol, u: e.target.value } : undefined,
                  })
                }
                className="flex-1 border text-[14px] px-2 py-2.5 rounded-[10px] focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              >
                {allDoseUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Mínimo
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={fmt(draft.bol.lo)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bol: draft.bol ? { ...draft.bol, lo: num(e.target.value) } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[17px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Máximo
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={fmt(draft.bol.hi)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bol: draft.bol ? { ...draft.bol, hi: num(e.target.value) } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[17px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Tope
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={fmt(draft.bol.tope || 0)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bol: draft.bol ? { ...draft.bol, tope: num(e.target.value) } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[17px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
              <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
                {pd(draft.bol.u).amt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
                Vía
              </span>
              <input
                type="text"
                value={draft.bol.via || ''}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    bol: draft.bol ? { ...draft.bol, via: e.target.value } : undefined,
                  })
                }
                className="flex-1 min-w-0 border text-[14px] text-left px-3 py-2 rounded-[10px] focus:outline-none"
                style={{
                  background: 'var(--bg2)',
                  borderColor: 'var(--line)',
                  color: 'var(--txt)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Note config */}
      <div
        className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
        style={{ color: 'var(--dim)' }}
      >
        Nota
      </div>
      <div
        className="border rounded-[14px] p-3.5 mb-4"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <textarea
          value={draft.nota || ''}
          onChange={(e) => setDraft({ ...draft, nota: e.target.value })}
          className="w-full min-h-[130px] border rounded-[10px] p-2.5 text-[14px] leading-relaxed focus:outline-none"
          style={{
            background: 'var(--bg2)',
            borderColor: 'var(--line)',
            color: 'var(--txt)',
          }}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full font-bold text-[15px] py-3.5 px-4 rounded-[12px] cursor-pointer mb-2 transition-opacity hover:opacity-90"
        style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
      >
        Guardar
      </button>

      <button
        onClick={handleDelete}
        className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer border transition-colors hover:brightness-110"
        style={{
          background: 'transparent',
          color: 'var(--bad)',
          borderColor: 'rgba(248,113,113,0.5)',
        }}
      >
        Eliminar fármaco
      </button>
    </section>
  );
};
