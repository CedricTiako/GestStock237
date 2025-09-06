import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Products } from './components/Products/Products';
import { Sales } from './components/Sales/Sales';
import { Purchases } from './components/Purchases/Purchases';
import { Suppliers } from './components/Suppliers/Suppliers';
import { Customers } from './components/Customers/Customers';
import { Reports } from './components/Reports/Reports';
import { Settings } from './components/Settings/Settings';
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
        return <Purchases />;
      case 'suppliers':
        return <Suppliers />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
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