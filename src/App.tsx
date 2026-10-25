import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FavoritesView } from './components/views/FavoritesView';
import { DrugsCatalogView } from './components/views/DrugsCatalogView';
import { DrugDetailView } from './components/views/DrugDetailView';
import { SetsView } from './components/views/SetsView';
import { SetDetailView } from './components/views/SetDetailView';
import { WeightPediatricView } from './components/views/WeightPediatricView';
import { SettingsView } from './components/views/SettingsView';
import { EditDrugView } from './components/views/EditDrugView';

const AppContent: React.FC = () => {
  const { view } = useApp();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden select-none">
      <Header />

      <main
        id="app"
        className="flex-1 min-h-0 overflow-y-auto w-full max-w-[820px] mx-auto pb-6"
      >
        {view === 'fav' && <FavoritesView />}
        {(view === 'cats' || view === 'list') && <DrugsCatalogView />}
        {view === 'drug' && <DrugDetailView />}
        {view === 'sets' && <SetsView />}
        {view === 'set' && <SetDetailView />}
        {view === 'peso' && <WeightPediatricView />}
        {view === 'cfg' && <SettingsView />}
        {view === 'edit' && <EditDrugView />}
      </main>

      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
