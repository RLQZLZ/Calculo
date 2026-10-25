import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATS } from '../../data/drugs';
import { DrugItem } from '../DrugItem';

export const DrugsCatalogView: React.FC = () => {
  const {
    data,
    view,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setView,
    openDrug,
    deleteDrug,
    newDrug,
  } = useApp();

  const isListView = view === 'list';

  // Compute category counts
  const counts: Record<string, number> = {};
  data.drugs.forEach((d) => {
    counts[d.c] = (counts[d.c] || 0) + 1;
  });

  const handleDeleteWithConfirm = (drugId: string, drugName: string) => {
    if (window.confirm(`¿Eliminar «${drugName}» del catálogo?`)) {
      deleteDrug(drugId);
    }
  };

  // If in list view: show alphabetical groups of all or category drugs
  if (isListView) {
    const list = (selectedCategory ? data.drugs.filter((d) => d.c === selectedCategory) : data.drugs)
      .slice()
      .sort((a, b) => a.n.localeCompare(b.n, 'es'));

    // Group by initial letter
    const groups: { letter: string; drugs: typeof list }[] = [];
    list.forEach((d) => {
      const letter = d.n[0].toUpperCase();
      let lastGroup = groups[groups.length - 1];
      if (!lastGroup || lastGroup.letter !== letter) {
        lastGroup = { letter, drugs: [] };
        groups.push(lastGroup);
      }
      lastGroup.drugs.push(d);
    });

    return (
      <section className="p-3 max-w-[820px] mx-auto w-full">
        {groups.map((group) => (
          <div key={group.letter}>
            <div
              className="text-[12px] uppercase tracking-wider font-bold my-2 px-1"
              style={{ color: 'var(--dim)' }}
            >
              {group.letter}
            </div>
            <div
              className="border rounded-[14px] overflow-hidden mb-3"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--line)',
              }}
            >
              {group.drugs.map((d) => (
                <DrugItem
                  key={d.id}
                  drug={d}
                  onOpen={() => openDrug(d.id, 'list')}
                  actionType="del"
                  onAction={() => handleDeleteWithConfirm(d.id, d.n)}
                />
              ))}
            </div>
          </div>
        ))}

        <div
          className="text-[12.5px] text-center mt-2.5"
          style={{ color: 'var(--dim)' }}
        >
          Desliza hacia la izquierda para eliminar un fármaco.
        </div>

        <button
          onClick={newDrug}
          className="w-full font-bold text-[15px] py-3.5 px-4 rounded-[12px] cursor-pointer mt-3.5 transition-opacity hover:opacity-90"
          style={{ background: 'var(--acc)', color: 'var(--accTxt)' }}
        >
          + Agregar fármaco
        </button>
      </section>
    );
  }

  // Otherwise: Category overview with instant search
  const trimmedQ = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQ
    ? data.drugs.filter((d) => {
        const fullText = (d.n + ' ' + (d.a || []).join(' ')).toLowerCase();
        return fullText.includes(trimmedQ);
      })
    : [];

  return (
    <section className="p-3 max-w-[820px] mx-auto w-full">
      <input
        type="search"
        placeholder="Buscar fármaco…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border rounded-[12px] px-3.5 py-2.5 text-[16px] mb-3 focus:outline-none transition-colors"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--line)',
          color: 'var(--txt)',
        }}
      />

      {trimmedQ ? (
        searchResults.length > 0 ? (
          <div
            className="border rounded-[14px] overflow-hidden"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            {searchResults.map((d) => (
              <DrugItem
                key={d.id}
                drug={d}
                onOpen={() => openDrug(d.id, 'cats')}
                actionType="del"
                onAction={() => handleDeleteWithConfirm(d.id, d.n)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-5 text-[14px]" style={{ color: 'var(--dim)' }}>
            Sin resultados
          </div>
        )
      ) : (
        <>
          <div
            className="border rounded-[14px] overflow-hidden mb-3"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            <div
              onClick={() => {
                setSelectedCategory(null);
                setView('list');
              }}
              className="flex items-center gap-2.5 px-3.5 py-3.5 cursor-pointer active:brightness-95 transition-all"
            >
              <div className="flex-1 min-w-0">
                <b className="font-semibold block text-[15px]" style={{ color: 'var(--txt)' }}>
                  Todos los fármacos
                </b>
              </div>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--card2)', color: 'var(--dim)' }}
              >
                {data.drugs.length}
              </span>
              <span className="text-[18px]" style={{ color: 'var(--dim)' }}>
                ›
              </span>
            </div>
          </div>

          <div
            className="text-[12px] uppercase tracking-wider font-bold mb-2 px-1"
            style={{ color: 'var(--dim)' }}
          >
            Categorías
          </div>

          <div
            className="border rounded-[14px] overflow-hidden"
            style={{
              background: 'var(--card)',
              borderColor: 'var(--line)',
            }}
          >
            {Object.keys(CATS).map((key, idx) => (
              <div
                key={key}
                onClick={() => {
                  setSelectedCategory(key);
                  setView('list');
                }}
                className={`flex items-center gap-2.5 px-3.5 py-3 cursor-pointer active:brightness-95 transition-all ${
                  idx < Object.keys(CATS).length - 1 ? 'border-b' : ''
                }`}
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="flex-1 min-w-0">
                  <b className="font-semibold block text-[15px]" style={{ color: 'var(--txt)' }}>
                    {CATS[key]}
                  </b>
                </div>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--card2)', color: 'var(--dim)' }}
                >
                  {counts[key] || 0}
                </span>
                <span className="text-[18px]" style={{ color: 'var(--dim)' }}>
                  ›
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
