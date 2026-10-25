import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATS } from '../data/drugs';
import { fmt, getEffectiveWeight, WLBL } from '../utils/calculator';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const Header: React.FC = () => {
  const {
    view,
    data,
    weightMode,
    selectedDrugId,
    selectedSetIdx,
    selectedCategory,
    updatePatientWeight,
    toggleWeightUnit,
    cycleWeightMode,
    goBack,
    newDrug,
    newSet,
    openEditDrug,
  } = useApp();

  const { isInstalled } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const showWeightBar = view !== 'peso' && view !== 'cfg' && view !== 'edit';
  const effectiveW = getEffectiveWeight(data.pac, weightMode);

  // Compute title
  let titleText = 'InfusiLat';
  let backLabel: string | null = null;
  let actionButton: React.ReactNode = null;

  if (view === 'fav') {
    titleText = 'Favoritos';
    if (!isInstalled) {
      actionButton = (
        <button
          onClick={() => setShowInstallModal(true)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold cursor-pointer transition-opacity hover:opacity-90 shadow-sm"
          style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
          </svg>
          Descargar
        </button>
      );
    }
  } else if (view === 'cats') {
    titleText = 'Fármacos';
    actionButton = (
      <button
        onClick={newDrug}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] font-bold cursor-pointer"
        style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
      >
        + Agregar
      </button>
    );
  } else if (view === 'list') {
    titleText = selectedCategory ? CATS[selectedCategory] || 'Todos' : 'Todos';
    backLabel = 'Fármacos';
    actionButton = (
      <button
        onClick={newDrug}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] font-bold cursor-pointer"
        style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
      >
        + Agregar
      </button>
    );
  } else if (view === 'drug') {
    const drug = data.drugs.find((d) => d.id === selectedDrugId);
    titleText = drug ? drug.n : 'Fármaco';
    backLabel = 'Atrás';
    if (drug) {
      actionButton = (
        <button
          onClick={() => openEditDrug(drug.id)}
          className="text-[15px] font-bold cursor-pointer"
          style={{ color: 'var(--acc)' }}
        >
          Editar
        </button>
      );
    }
  } else if (view === 'sets') {
    titleText = 'Sets';
    actionButton = (
      <button
        onClick={() => {
          const n = window.prompt('Nombre del set');
          if (n && n.trim()) {
            newSet(n.trim());
          }
        }}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14px] font-bold cursor-pointer"
        style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
      >
        + Agregar
      </button>
    );
  } else if (view === 'set') {
    const currentSet = selectedSetIdx != null ? data.sets[selectedSetIdx] : null;
    titleText = currentSet ? currentSet.n : 'Set';
    backLabel = 'Sets';
  } else if (view === 'peso') {
    titleText = 'Peso y pediatría';
  } else if (view === 'cfg') {
    titleText = 'Ajustes';
  } else if (view === 'edit') {
    titleText = 'Editar';
    backLabel = 'Cancelar';
  }

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md border-b px-3.5 py-2.5 transition-colors"
      style={{
        background: 'var(--hdr)',
        borderColor: 'var(--line)',
      }}
    >
      <div className="flex items-center gap-2.5 min-h-[32px]">
        <div className="min-w-[70px]">
          {backLabel && (
            <button
              onClick={goBack}
              className="text-[15px] font-semibold cursor-pointer flex items-center hover:opacity-80 transition-opacity"
              style={{ color: 'var(--acc)' }}
            >
              ‹ {backLabel}
            </button>
          )}
        </div>
        <div
          className="text-[17px] font-bold flex-1 text-center whitespace-nowrap overflow-hidden text-ellipsis px-1 select-none"
          style={{ color: 'var(--txt)' }}
        >
          {titleText}
        </div>
        <div className="min-w-[86px] flex justify-end items-center">{actionButton}</div>
      </div>

      {showWeightBar && (
        <div className="flex items-center gap-2 mt-2.5">
          <label
            className="text-[12px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--dim)' }}
          >
            Peso
          </label>
          <input
            id="wIn"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={data.pac.peso || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value.replace(',', '.'));
              updatePatientWeight(isNaN(val) ? 0 : val);
            }}
            className="flex-1 min-w-0 border text-[17px] font-bold text-right px-2.5 py-2 rounded-[10px] tabular-nums focus:outline-none transition-colors"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <button
            id="wUnit"
            onClick={toggleWeightUnit}
            title="Cambiar entre kg y lb"
            className="text-[12px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap cursor-pointer transition-all"
            style={{
              background: 'var(--acc)',
              color: 'var(--accTxt)',
              borderColor: 'var(--acc)',
            }}
          >
            {data.prefs.wUnit}
          </button>
          <button
            id="wDose"
            onClick={cycleWeightMode}
            title="Cambiar peso de dosificación (total, ideal, ajustado, magro)"
            className="text-[12px] rounded-full px-2.5 py-1 whitespace-nowrap cursor-pointer border transition-all hover:brightness-110"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
              color: 'var(--dim)',
            }}
          >
            {WLBL[weightMode]} {fmt(effectiveW)} kg
          </button>
        </div>
      )}

      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </header>
  );
};
