import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { tab, setTab } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'fav',
      label: 'Favoritos',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-0.5 fill-current">
          <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ),
    },
    {
      id: 'cats',
      label: 'Fármacos',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-0.5 fill-current">
          <path d="M9 2h6v6.2l5 9.1A3 3 0 0 1 17.4 22H6.6A3 3 0 0 1 4 17.3l5-9.1zm2 2v4.7L6.6 17h10.8L13 8.7V4z" />
        </svg>
      ),
    },
    {
      id: 'sets',
      label: 'Sets',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-0.5 fill-current">
          <path d="M3 4h18v4H3zm0 6h18v4H3zm0 6h18v4H3z" />
        </svg>
      ),
    },
    {
      id: 'peso',
      label: 'Peso',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-0.5 fill-current">
          <path d="M12 3a3 3 0 0 1 2.8 2H19a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.2A3 3 0 0 1 12 3zm0 5a5 5 0 0 0-4.6 3h9.2A5 5 0 0 0 12 8z" />
        </svg>
      ),
    },
    {
      id: 'cfg',
      label: 'Ajustes',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-0.5 fill-current">
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 4c0-.7-.1-1.3-.2-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a8 8 0 0 0-1.7 1l-2.4-1-2 3.5L3.2 10a8 8 0 0 0 0 4l-2 1.5 2 3.5 2.4-1c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.5-2-1.5c.1-.7.2-1.3.2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      id="navwrap"
      className="flex-none border-t transition-colors z-30"
      style={{
        background: 'var(--hdr)',
        borderColor: 'var(--line)',
      }}
    >
      <nav className="max-w-[820px] mx-auto flex w-full">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <div
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 text-center pt-[7px] pb-1 px-0.5 cursor-pointer text-[10.5px] leading-tight select-none transition-colors"
              style={{
                color: isActive ? 'var(--acc)' : 'var(--dim)',
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
