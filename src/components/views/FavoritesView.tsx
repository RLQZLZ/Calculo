import React from 'react';
import { useApp } from '../../context/AppContext';
import { DrugItem } from '../DrugItem';

export const FavoritesView: React.FC = () => {
  const { data, openDrug, toggleFavorite } = useApp();
  const favDrugs = data.drugs.filter((d) => d.fav);

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      {favDrugs.length > 0 ? (
        <>
          <div
            className="border rounded-[14px] overflow-hidden"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            {favDrugs.map((d) => (
              <DrugItem
                key={d.id}
                drug={d}
                onOpen={() => openDrug(d.id, 'fav')}
                actionType="fav"
                onAction={() => toggleFavorite(d.id)}
              />
            ))}
          </div>
          <div
            className="text-[12.5px] text-center mt-2.5"
            style={{ color: 'var(--dim)' }}
          >
            Desliza un fármaco hacia la izquierda para quitarlo de favoritos.
          </div>
        </>
      ) : (
        <div
          className="text-center py-12 px-5 text-[14px]"
          style={{ color: 'var(--dim)' }}
        >
          Sin favoritos todavía.
          <br />
          Marca la estrella dentro de cualquier fármaco.
        </div>
      )}
    </section>
  );
};
