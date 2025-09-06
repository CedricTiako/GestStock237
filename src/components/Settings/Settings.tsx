import React, { useState } from 'react';
import { Save, User, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState({
    companyName: 'GestStock237',
    companyAddress: 'Yaoundé, Cameroun',
    companyPhone: '+237 698 123 456',
    companyEmail: 'contact@geststock237.cm',
    currency: 'F CFA',
    taxRate: 19.25,
    lowStockThreshold: 10,
    notifications: {
      lowStock: true,
      newSale: false,
      dailyReport: true,
    },
    theme: 'light',
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const handleSave = () => {
    // Sauvegarder les paramètres dans localStorage
    localStorage.setItem('geststock-settings', JSON.stringify(settings));
    alert('Paramètres sauvegardés avec succès !');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const exportData = () => {
    const data = {
      products: JSON.parse(localStorage.getItem('geststock-products') || '[]'),
      sales: JSON.parse(localStorage.getItem('geststock-sales') || '[]'),
      customers: JSON.parse(localStorage.getItem('geststock-customers') || '[]'),
      suppliers: JSON.parse(localStorage.getItem('geststock-suppliers') || '[]'),
      purchases: JSON.parse(localStorage.getItem('geststock-purchases') || '[]'),
      settings: settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geststock-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('⚠️ ATTENTION : Cette action supprimera TOUTES vos données de manière définitive. Êtes-vous absolument sûr de vouloir continuer ?')) {
      if (confirm('Dernière confirmation : Toutes les données (produits, ventes, clients, fournisseurs) seront perdues. Continuer ?')) {
        localStorage.clear();
        alert('Toutes les données ont été supprimées. La page va se recharger.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Configuration de l'application et gestion des utilisateurs
        </p>
      </div>

      <div className="space-y-8">
        {/* Informations de l'entreprise */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <User className="text-blue-600 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Informations de l'entreprise</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                name="companyName"
                value={settings.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="companyPhone"
                value={settings.companyPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="companyEmail"
                value={settings.companyEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                name="companyAddress"
                value={settings.companyAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Paramètres généraux */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Shield className="text-green-600 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Paramètres généraux</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise
              </label>
              <input
                type="text"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux de TVA (%)
              </label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil stock critique
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={settings.lowStockThreshold}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Langue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Globe className="text-purple-600 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Langue</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="language"
                value="fr"
                checked={language === 'fr'}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">🇫🇷 Français</div>
                <div className="text-sm text-gray-500">Langue par défaut</div>
              </div>
            </label>
            
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">🇬🇧 English</div>
                <div className="text-sm text-gray-500">International</div>
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Bell className="text-yellow-600 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Alertes stock critique</div>
                <div className="text-sm text-gray-500">Recevoir une alerte quand un produit atteint le stock minimum</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.lowStock}
                onChange={(e) => handleNotificationChange('lowStock', e.target.checked)}
                className="ml-4"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Nouvelles ventes</div>
                <div className="text-sm text-gray-500">Notification à chaque nouvelle vente</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.newSale}
                onChange={(e) => handleNotificationChange('newSale', e.target.checked)}
                className="ml-4"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Rapport quotidien</div>
                <div className="text-sm text-gray-500">Résumé des ventes de la journée</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.dailyReport}
                onChange={(e) => handleNotificationChange('dailyReport', e.target.checked)}
                className="ml-4"
              />
            </label>
          </div>
        </div>

        {/* Sauvegarde et données */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Database className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Sauvegarde et données</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium">Exporter toutes les données</div>
                <div className="text-sm text-gray-500">Télécharger une sauvegarde complète au format JSON</div>
              </div>
              <button
                onClick={exportData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Exporter
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
              <div>
                <div className="font-medium text-red-800">Supprimer toutes les données</div>
                <div className="text-sm text-red-600">⚠️ Action irréversible - Toutes les données seront perdues</div>
              </div>
              <button
                onClick={clearAllData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Save size={20} className="mr-2" />
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
};