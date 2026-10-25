import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { num } from '../../utils/calculator';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../PWAInstallModal';

export const SettingsView: React.FC = () => {
  const {
    data,
    updatePrefs,
    setTheme,
    newDrug,
    exportCatalog,
    importCatalog,
    resetCatalog,
  } = useApp();

  const { isInstalled } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        importCatalog(parsed);
        alert('Catálogo importado exitosamente.');
      } catch {
        alert('Archivo no válido.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Se perderán tus cambios y fármacos añadidos. ¿Continuar?')) {
      resetCatalog();
    }
  };

  const isDark = data.prefs.tema === 'oscuro';

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {/* Instalación / Descarga */}
      <div
        className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
        style={{ color: 'var(--dim)' }}
      >
        Instalación y acceso sin conexión
      </div>

      <div
        className="border rounded-[14px] p-3.5 mb-4 shadow-sm"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <img
            src="/infusilat-ico.jpg"
            alt="InfusiLat"
            className="w-11 h-11 rounded-[10px] border shadow-sm"
            style={{ borderColor: 'var(--line)' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/icon.svg';
            }}
          />
          <div className="flex-1 min-w-0">
            <b className="block text-[15px]" style={{ color: 'var(--txt)' }}>
              Descargar InfusiLat
            </b>
            <span className="text-[12px] block" style={{ color: 'var(--dim)' }}>
              {isInstalled
                ? 'App instalada en este dispositivo'
                : 'Instala la app en tu teléfono, tablet o PC'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowInstallModal(true)}
          className="w-full flex items-center justify-center gap-2 font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer transition-opacity hover:opacity-90"
          style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
          </svg>
          {isInstalled ? 'Ver detalles de instalación' : 'Descargar / Instalar App'}
        </button>
      </div>

      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Apariencia */}
      <div
        className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
        style={{ color: 'var(--dim)' }}
      >
        Apariencia
      </div>

      <div
        className="flex rounded-[11px] p-[3px] mb-3.5 select-none"
        style={{ background: 'var(--card2)' }}
      >
        <button
          onClick={() => setTheme('oscuro')}
          className={`flex-1 text-center py-2 px-1 rounded-[9px] text-[14px] font-semibold cursor-pointer transition-all ${
            isDark ? 'font-bold' : ''
          }`}
          style={{
            background: isDark ? 'var(--acc)' : 'transparent',
            color: isDark ? 'var(--accTxt)' : 'var(--dim)',
          }}
        >
          🌙 Oscuro
        </button>
        <button
          onClick={() => setTheme('claro')}
          className={`flex-1 text-center py-2 px-1 rounded-[9px] text-[14px] font-semibold cursor-pointer transition-all ${
            !isDark ? 'font-bold' : ''
          }`}
          style={{
            background: !isDark ? 'var(--acc)' : 'transparent',
            color: !isDark ? 'var(--accTxt)' : 'var(--dim)',
          }}
        >
          ☀️ Claro
        </button>
      </div>

      {/* Goteo Config */}
      <div
        className="border rounded-[14px] p-3.5 mb-4"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-[78px] shrink-0 text-[13px] text-right" style={{ color: 'var(--dim)' }}>
            Goteo
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={data.prefs.gotas || ''}
            onChange={(e) => updatePrefs({ gotas: num(e.target.value) || 20 })}
            className="flex-1 min-w-0 border text-[18px] font-bold text-right px-3 py-2 rounded-[10px] tabular-nums focus:outline-none focus:border-[var(--acc)]"
            style={{
              background: 'var(--bg2)',
              borderColor: 'var(--line)',
              color: 'var(--txt)',
            }}
          />
          <span className="text-[13px] min-w-[56px]" style={{ color: 'var(--dim)' }}>
            gotas/mL
          </span>
        </div>
        <div className="text-[12.5px]" style={{ color: 'var(--dim)' }}>
          Macrogotero 20 · microgotero 60.
        </div>
      </div>

      {/* Catálogo Section */}
      <div
        className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
        style={{ color: 'var(--dim)' }}
      >
        Catálogo
      </div>

      <div
        className="border rounded-[14px] p-3.5 mb-4"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
        }}
      >
        <div className="text-[13px] mb-3" style={{ color: 'var(--dim)' }}>
          {data.drugs.length} fármacos · {data.sets.length} sets. Todo se guarda en este dispositivo.
        </div>

        <button
          onClick={newDrug}
          className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer mb-2 transition-opacity hover:opacity-90"
          style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
        >
          + Nuevo fármaco
        </button>

        <button
          onClick={exportCatalog}
          className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer mb-2 border transition-colors hover:brightness-110"
          style={{
            background: 'var(--card2)',
            color: 'var(--txt)',
            borderColor: 'var(--line)',
          }}
        >
          Exportar copia (JSON)
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer mb-2 border transition-colors hover:brightness-110"
          style={{
            background: 'var(--card2)',
            color: 'var(--txt)',
            borderColor: 'var(--line)',
          }}
        >
          Importar copia
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />

        <button
          onClick={handleReset}
          className="w-full font-bold text-[15px] py-3 px-4 rounded-[12px] cursor-pointer border transition-colors hover:brightness-110"
          style={{
            background: 'transparent',
            color: 'var(--bad)',
            borderColor: 'rgba(248,113,113,0.5)',
          }}
        >
          Restaurar catálogo original
        </button>
      </div>

      {/* Academic Disclaimer */}
      <div className="text-[11.5px] text-center px-6 py-5 leading-relaxed" style={{ color: 'var(--dim)' }}>
        <b className="text-[13px]" style={{ color: 'var(--txt)' }}>InfusiLat</b>
        <br />
        Desarrollada por el Dr. Herman Granados — Anestesia Latina
        <br />
        <br />
        Esta app es una aplicación web con fines académicos y educativos.
      </div>
    </section>
  );
};
