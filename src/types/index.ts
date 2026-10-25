export interface Dilution {
  m: number;
  um: string;
  v: number;
  d: string;
}

export interface InfusionConfig {
  u: string;
  lo: number;
  hi: number;
  dil: Dilution;
}

export interface BolusConfig {
  u: string;
  lo: number;
  hi: number;
  tope?: number;
  via?: string;
  dil: Dilution;
}

export interface Drug {
  id: string;
  n: string;
  a?: string[];
  c: string;
  fav?: number;
  alerta?: number;
  pref?: 'total' | 'ideal' | 'ajustado' | 'magro';
  inf?: InfusionConfig;
  bol?: BolusConfig;
  nota?: string;
}

export interface SetItem {
  d: string;
  modo: 'inf' | 'bol';
  val: number;
}

export interface ClinicalSet {
  id: string;
  n: string;
  items: SetItem[];
}

export interface Patient {
  peso: number;
  talla: number;
  edad: number;
  sexo: 'm' | 'f';
}

export interface UserPrefs {
  gotas: number;
  wUnit: 'kg' | 'lb';
  tema: 'claro' | 'oscuro';
}

export interface AppData {
  v: number;
  drugs: Drug[];
  sets: ClinicalSet[];
  prefs: UserPrefs;
  pac: Patient;
}

export type WeightMode = 'total' | 'ideal' | 'ajustado' | 'magro';

export type ActiveTab = 'fav' | 'cats' | 'sets' | 'peso' | 'cfg';
export type ActiveView = 'fav' | 'cats' | 'list' | 'drug' | 'sets' | 'set' | 'peso' | 'cfg' | 'edit';
