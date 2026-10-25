import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActiveTab,
  ActiveView,
  AppData,
  ClinicalSet,
  Drug,
  Patient,
  UserPrefs,
  WeightMode,
} from '../types';
import { DEFAULT_DRUGS, DEFAULT_SETS } from '../data/drugs';
import { num } from '../utils/calculator';

const STORAGE_KEY = 'infusilat-v1';
const STORAGE_KEY_OLD = 'infusicalc-personal-v1';

const DEFAULT_PREFS: UserPrefs = {
  gotas: 20,
  wUnit: 'kg',
  tema: 'claro',
};

const DEFAULT_PATIENT: Patient = {
  peso: 70,
  talla: 170,
  edad: 40,
  sexo: 'm',
};

function getInitialData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY_OLD);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        v: 1,
        drugs: parsed.drugs && parsed.drugs.length ? parsed.drugs : DEFAULT_DRUGS,
        sets: parsed.sets && parsed.sets.length ? parsed.sets : DEFAULT_SETS,
        prefs: { ...DEFAULT_PREFS, ...(parsed.prefs || {}) },
        pac: { ...DEFAULT_PATIENT, ...(parsed.pac || {}) },
      };
    }
  } catch {
    // fallback
  }
  return {
    v: 1,
    drugs: JSON.parse(JSON.stringify(DEFAULT_DRUGS)),
    sets: JSON.parse(JSON.stringify(DEFAULT_SETS)),
    prefs: { ...DEFAULT_PREFS },
    pac: { ...DEFAULT_PATIENT },
  };
}

interface AppContextType {
  data: AppData;
  tab: ActiveTab;
  view: ActiveView;
  selectedDrugId: string | null;
  selectedSetIdx: number | null;
  selectedCategory: string | null;
  searchQuery: string;
  weightMode: WeightMode;
  drugMode: 'inf' | 'bol' | 'nota';
  editingDrugId: string | null;
  fromView: ActiveView;
  setTab: (t: ActiveTab) => void;
  setView: (v: ActiveView) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: string | null) => void;
  setDrugMode: (m: 'inf' | 'bol' | 'nota') => void;
  setWeightMode: (m: WeightMode) => void;
  cycleWeightMode: () => void;
  toggleWeightUnit: () => void;
  updatePatientWeight: (w: number) => void;
  updatePatient: (p: Partial<Patient>) => void;
  updatePrefs: (p: Partial<UserPrefs>) => void;
  setTheme: (t: 'claro' | 'oscuro') => void;
  toggleFavorite: (id: string) => void;
  deleteDrug: (id: string) => void;
  saveDrug: (drug: Drug) => void;
  newDrug: () => string;
  openDrug: (id: string, from?: ActiveView) => void;
  openSet: (idx: number) => void;
  newSet: (name: string) => void;
  deleteSet: (idx: number) => void;
  resetCatalog: () => void;
  importCatalog: (importedData: AppData) => void;
  exportCatalog: () => void;
  goBack: () => void;
  openEditDrug: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData);
  const [tab, setTabState] = useState<ActiveTab>('fav');
  const [view, setViewState] = useState<ActiveView>('fav');
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  const [selectedSetIdx, setSelectedSetIdx] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weightMode, setWeightModeState] = useState<WeightMode>('total');
  const [drugMode, setDrugMode] = useState<'inf' | 'bol' | 'nota'>('inf');
  const [editingDrugId, setEditingDrugId] = useState<string | null>(null);
  const [fromView, setFromView] = useState<ActiveView>('fav');

  // Sync theme
  useEffect(() => {
    const isLight = data.prefs.tema !== 'oscuro';
    document.body.classList.toggle('light', isLight);
    const m = document.querySelector('meta[name=theme-color]');
    if (m) m.setAttribute('content', isLight ? '#eef1f6' : '#0b1120');
  }, [data.prefs.tema]);

  // Persist data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const setTab = (t: ActiveTab) => {
    setTabState(t);
    setViewState(t);
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const setView = (v: ActiveView) => {
    setViewState(v);
  };

  const updatePatientWeight = (w: number) => {
    setData((prev) => ({
      ...prev,
      pac: { ...prev.pac, peso: w },
    }));
  };

  const updatePatient = (patch: Partial<Patient>) => {
    setData((prev) => ({
      ...prev,
      pac: { ...prev.pac, ...patch },
    }));
  };

  const updatePrefs = (patch: Partial<UserPrefs>) => {
    setData((prev) => ({
      ...prev,
      prefs: { ...prev.prefs, ...patch },
    }));
  };

  const setTheme = (t: 'claro' | 'oscuro') => {
    updatePrefs({ tema: t });
  };

  const toggleWeightUnit = () => {
    const nextUnit = data.prefs.wUnit === 'kg' ? 'lb' : 'kg';
    const nextWeight = nextUnit === 'lb' ? data.pac.peso * 2.20462 : data.pac.peso / 2.20462;
    setData((prev) => ({
      ...prev,
      prefs: { ...prev.prefs, wUnit: nextUnit },
      pac: { ...prev.pac, peso: Math.round(nextWeight * 10) / 10 },
    }));
  };

  const cycleWeightMode = () => {
    const modes: WeightMode[] = ['total', 'ideal', 'ajustado', 'magro'];
    const idx = modes.indexOf(weightMode);
    setWeightModeState(modes[(idx + 1) % modes.length]);
  };

  const setWeightMode = (m: WeightMode) => {
    setWeightModeState(m);
  };

  const toggleFavorite = (id: string) => {
    setData((prev) => ({
      ...prev,
      drugs: prev.drugs.map((d) => (d.id === id ? { ...d, fav: d.fav ? 0 : 1 } : d)),
    }));
  };

  const deleteDrug = (id: string) => {
    setData((prev) => ({
      ...prev,
      drugs: prev.drugs.filter((d) => d.id !== id),
    }));
  };

  const saveDrug = (drug: Drug) => {
    setData((prev) => {
      const exists = prev.drugs.some((d) => d.id === drug.id);
      return {
        ...prev,
        drugs: exists ? prev.drugs.map((d) => (d.id === drug.id ? drug : d)) : [...prev.drugs, drug],
      };
    });
  };

  const newDrug = (): string => {
    const newId = 'u' + Date.now();
    const drug: Drug = {
      id: newId,
      n: 'Nuevo fármaco',
      c: 'anest',
      fav: 0,
      inf: { u: 'mg/kg/hr', lo: 1, hi: 5, dil: { m: 100, um: 'mg', v: 100, d: 'SSN 0.9%' } },
      bol: { u: 'mg/kg', lo: 0.1, hi: 1, tope: 0, via: 'IV', dil: { m: 100, um: 'mg', v: 10, d: 'SSN 0.9%' } },
      nota: '',
    };
    saveDrug(drug);
    setEditingDrugId(newId);
    setFromView(view);
    setViewState('edit');
    return newId;
  };

  const openDrug = (id: string, from?: ActiveView) => {
    const d = data.drugs.find((x) => x.id === id);
    if (!d) return;
    setSelectedDrugId(id);
    setFromView(from || view);
    // Set appropriate initial mode (inf > bol > nota)
    if (d.pref) {
      setWeightMode(d.pref);
    }
    setDrugMode(d.inf ? 'inf' : d.bol ? 'bol' : 'nota');
    setViewState('drug');
  };

  const openEditDrug = (id: string) => {
    setEditingDrugId(id);
    setViewState('edit');
  };

  const openSet = (idx: number) => {
    setSelectedSetIdx(idx);
    setViewState('set');
  };

  const newSet = (name: string) => {
    const s: ClinicalSet = {
      id: 'u' + Date.now(),
      n: name,
      items: [],
    };
    setData((prev) => ({
      ...prev,
      sets: [...prev.sets, s],
    }));
    setSelectedSetIdx(data.sets.length);
    setViewState('set');
  };

  const deleteSet = (idx: number) => {
    setData((prev) => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== idx),
    }));
    setTab('sets');
  };

  const resetCatalog = () => {
    const fresh = {
      v: 1,
      drugs: JSON.parse(JSON.stringify(DEFAULT_DRUGS)),
      sets: JSON.parse(JSON.stringify(DEFAULT_SETS)),
      prefs: { ...DEFAULT_PREFS },
      pac: { ...DEFAULT_PATIENT },
    };
    setData(fresh);
    setTab('fav');
  };

  const importCatalog = (importedData: AppData) => {
    if (!importedData.drugs || !Array.isArray(importedData.drugs)) {
      throw new Error('Archivo no válido');
    }
    setData({
      v: 1,
      drugs: importedData.drugs,
      sets: importedData.sets || DEFAULT_SETS,
      prefs: { ...DEFAULT_PREFS, ...(importedData.prefs || {}) },
      pac: { ...DEFAULT_PATIENT, ...(importedData.pac || {}) },
    });
    setTab('fav');
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infusilat-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goBack = () => {
    if (view === 'edit') {
      if (selectedDrugId) {
        setViewState('drug');
      } else {
        setViewState(fromView || 'cats');
      }
      return;
    }
    if (view === 'drug') {
      setViewState(fromView || 'cats');
      return;
    }
    if (view === 'list') {
      setViewState('cats');
      return;
    }
    if (view === 'set') {
      setViewState('sets');
      return;
    }
    setTab(tab);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        tab,
        view,
        selectedDrugId,
        selectedSetIdx,
        selectedCategory,
        searchQuery,
        weightMode,
        drugMode,
        editingDrugId,
        fromView,
        setTab,
        setView,
        setSearchQuery,
        setSelectedCategory,
        setDrugMode,
        setWeightMode,
        cycleWeightMode,
        toggleWeightUnit,
        updatePatientWeight,
        updatePatient,
        updatePrefs,
        setTheme,
        toggleFavorite,
        deleteDrug,
        saveDrug,
        newDrug,
        openDrug,
        openSet,
        newSet,
        deleteSet,
        resetCatalog,
        importCatalog,
        exportCatalog,
        goBack,
        openEditDrug,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
