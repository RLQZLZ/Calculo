import React from 'react';
import { useApp } from '../../context/AppContext';

export const SetsView: React.FC = () => {
  const { data, openSet, newSet, deleteSet } = useApp();

  const handleAddSet = () => {
    const name = window.prompt('Nombre del set');
    if (name && name.trim()) {
      newSet(name.trim());
    }
  };

  const handleDeleteWithConfirm = (idx: number, name: string) => {
    if (window.confirm(`¿Eliminar el set «${name}»?`)) {
      deleteSet(idx);
    }
  };

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {data.sets.length > 0 ? (
        <>
          <div
            className="border rounded-[14px] overflow-hidden"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            {data.sets.map((s, idx) => {
              const drugNames = s.items
                .map((it) => {
                  const d = data.drugs.find((x) => x.id === it.d);
                  return d ? d.n : '?';
                })
                .join(' · ');

              return (
                <div
                  key={s.id || idx}
                  className={`flex items-center gap-2.5 px-3.5 py-3.5 cursor-pointer active:brightness-95 transition-all ${
                    idx < data.sets.length - 1 ? 'border-b' : ''
                  }`}
                  style={{ borderColor: 'var(--line)' }}
                  onClick={() => openSet(idx)}
                >
                  <div className="flex-1 min-w-0">
                    <b className="font-semibold block text-[15px]" style={{ color: 'var(--txt)' }}>
                      {s.n}
                    </b>
                    <small
                      className="text-[12px] block overflow-hidden text-ellipsis whitespace-nowrap mt-0.5"
                      style={{ color: 'var(--dim)' }}
                    >
                      {drugNames}
                    </small>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--card2)', color: 'var(--dim)' }}
                  >
                    {s.items.length}
                  </span>
                  <span className="text-[18px]" style={{ color: 'var(--dim)' }}>
                    ›
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="text-[12.5px] text-center mt-2.5"
            style={{ color: 'var(--dim)' }}
          >
            Toca un set para ver o ajustar sus dosis simultáneamente.
          </div>
        </>
      ) : (
        <div className="text-center py-12 px-5 text-[14px]" style={{ color: 'var(--dim)' }}>
          Sin sets configurados.
        </div>
      )}

      <button
        onClick={handleAddSet}
        className="w-full font-bold text-[15px] py-3.5 px-4 rounded-[12px] cursor-pointer mt-3.5 transition-opacity hover:opacity-90"
        style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
      >
        + Agregar set
      </button>
    </section>
  );
};
