import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Products } from './components/Products/Products';
import { Sales } from './components/Sales/Sales';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Fermer le sidebar sur mobile après sélection
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleTabChange} />;
      case 'products':
        return <Products />;
      case 'sales':
        return <Sales />;
      case 'purchases':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Achats</h2>
              <p className="text-gray-600 mb-6">
                Gestion des commandes fournisseurs et réapprovisionnements
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                🚧 En cours de développement
              </div>
            </div>
          </div>
        );
      case 'suppliers':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Fournisseurs</h2>
              <p className="text-gray-600 mb-6">
                Base de données des fournisseurs et historique des commandes
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                🚧 En cours de développement
              </div>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Clients</h2>
              <p className="text-gray-600 mb-6">
                Base de données clients et suivi des créances
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                🚧 En cours de développement
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rapports & Analyses</h2>
              <p className="text-gray-600 mb-6">
                Statistiques détaillées et export des données
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                🚧 En cours de développement
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
              <p className="text-gray-600 mb-6">
                Configuration de l'application et gestion des utilisateurs
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                🚧 En cours de développement
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={handleToggleSidebar} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;