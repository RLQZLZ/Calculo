import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'auto' | 'ios' | 'android' | 'desktop'>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        onClose();
      }
    }
  };

  const currentPlatform =
    activePlatform === 'auto'
      ? isIOS
        ? 'ios'
        : isInstallable
        ? 'android'
        : 'android'
      : activePlatform;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-[18px] border p-5 shadow-2xl relative transition-all"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
          color: 'var(--txt)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:brightness-110"
          style={{ background: 'var(--card2)', color: 'var(--dim)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src="/infusilat-ico.jpg"
            alt="InfusiLat"
            className="w-13 h-13 rounded-[12px] shadow-md border"
            style={{ borderColor: 'var(--line)' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/icon.svg';
            }}
          />
          <div>
            <h3 className="text-[17px] font-bold" style={{ color: 'var(--txt)' }}>
              Descargar InfusiLat
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--dim)' }}>
              Instala la aplicación en tu pantalla de inicio y úsala 100% sin conexión a internet.
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div
            className="rounded-[12px] p-4 text-center my-4 border"
            style={{
              background: 'rgba(52,211,153,0.12)',
              borderColor: 'rgba(52,211,153,0.3)',
              color: 'var(--ok)',
            }}
          >
            ✓ La aplicación ya está instalada en este dispositivo.
          </div>
        ) : (
          <>
            {/* If direct browser prompt is available, show 1-click Install button */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 font-bold text-[15px] py-3.5 px-4 rounded-[12px] cursor-pointer mb-4 shadow-md transition-opacity hover:opacity-90"
                style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                </svg>
                Instalar ahora directamente
              </button>
            )}

            {/* Platform Selection tabs */}
            <div
              className="flex rounded-[11px] p-[3px] mb-3 select-none"
              style={{ background: 'var(--card2)' }}
            >
              <button
                onClick={() => setActivePlatform('android')}
                className="flex-1 py-1.5 text-center rounded-[9px] text-[12px] font-semibold transition-all cursor-pointer"
                style={{
                  background: currentPlatform === 'android' ? 'var(--acc)' : 'transparent',
                  color: currentPlatform === 'android' ? 'var(--accTxt)' : 'var(--dim)',
                }}
              >
                Android / Chrome
              </button>
              <button
                onClick={() => setActivePlatform('ios')}
                className="flex-1 py-1.5 text-center rounded-[9px] text-[12px] font-semibold transition-all cursor-pointer"
                style={{
                  background: currentPlatform === 'ios' ? 'var(--acc)' : 'transparent',
                  color: currentPlatform === 'ios' ? 'var(--accTxt)' : 'var(--dim)',
                }}
              >
                iPhone / iPad
              </button>
              <button
                onClick={() => setActivePlatform('desktop')}
                className="flex-1 py-1.5 text-center rounded-[9px] text-[12px] font-semibold transition-all cursor-pointer"
                style={{
                  background: currentPlatform === 'desktop' ? 'var(--acc)' : 'transparent',
                  color: currentPlatform === 'desktop' ? 'var(--accTxt)' : 'var(--dim)',
                }}
              >
                PC / Mac
              </button>
            </div>

            {/* Platform Specific Steps */}
            <div
              className="rounded-[12px] p-3.5 border mb-4 text-[13px] leading-relaxed"
              style={{
                background: 'var(--bg2)',
                borderColor: 'var(--line)',
                color: 'var(--txt)',
              }}
            >
              {currentPlatform === 'ios' && (
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Abre esta página en el navegador <strong>Safari</strong> de tu iPhone o iPad.
                  </li>
                  <li>
                    Toca el botón <strong>Compartir</strong> (el cuadrado con la flecha hacia arriba{' '}
                    <span className="inline-block px-1 py-0.5 rounded border border-gray-400 text-xs">⎋</span>) en la barra inferior.
                  </li>
                  <li>
                    Baja en las opciones y selecciona <strong>«Agregar al inicio»</strong> (o «Añadir a pantalla de inicio»).
                  </li>
                  <li>
                    Pulsa <strong>«Agregar»</strong> en la esquina superior derecha.
                  </li>
                  <li className="text-[12px]" style={{ color: 'var(--dim)' }}>
                    ¡Listo! Tendrás el icono de InfusiLat en tu pantalla de inicio y se abrirá en pantalla completa como una app nativa sin barras de navegador.
                  </li>
                </ol>
              )}

              {currentPlatform === 'android' && (
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    En <strong>Google Chrome</strong> o tu navegador móvil, toca el menú de los <strong>tres puntos (⋮)</strong> arriba a la derecha.
                  </li>
                  <li>
                    Selecciona <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.
                  </li>
                  <li>
                    Confirma pulsando <strong>«Instalar»</strong>.
                  </li>
                  <li className="text-[12px]" style={{ color: 'var(--dim)' }}>
                    La app se añadirá a tu menú de aplicaciones con icono propio y funcionará en modo offline completo.
                  </li>
                </ol>
              )}

              {currentPlatform === 'desktop' && (
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    En <strong>Chrome</strong>, <strong>Edge</strong> o <strong>Brave</strong>, busca el icono de <strong>Instalar</strong> (un monitor con una flecha hacia abajo) en la parte derecha de la barra de direcciones.
                  </li>
                  <li>
                    O abre el menú de tres puntos (⋮) y selecciona <strong>«Instalar InfusiLat…»</strong>.
                  </li>
                  <li>
                    Confirma la instalación para tenerla en tu escritorio o barra de tareas.
                  </li>
                </ol>
              )}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-[12px] text-[14px] font-semibold border cursor-pointer transition-colors hover:brightness-110"
          style={{
            background: 'var(--card2)',
            borderColor: 'var(--line)',
            color: 'var(--txt)',
          }}
        >
          Entendido
        </button>
      </div>
    </div>,
    document.body
  );
};
