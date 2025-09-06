import React, { useState } from 'react';
import { Plus, ShoppingCart, Calendar, CreditCard } from 'lucide-react';
import { Sale } from '../../types';
import { SaleForm } from './SaleForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Sales: React.FC = () => {
  const { t } = useLanguage();
  const [sales, setSales] = useLocalStorage<Sale[]>('geststock-sales', []);
  const [showForm, setShowForm] = useState(false);

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setSales([newSale, ...sales]);
    setShowForm(false);
    
    // Afficher une notification de succès
    alert(`Vente enregistrée avec succès ! Total: ${newSale.totalAmount.toLocaleString()} ${t('common.fcfa')}`);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  const getPaymentMethodLabel = (method: Sale['paymentMethod']) => {
    return t(`payment.${method}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (showForm) {
    return (
      <div className="p-6">
        <SaleForm
          onSave={handleSaveSale}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des Ventes
          </h1>
          <p className="text-gray-600">
            Enregistrez vos ventes et suivez votre chiffre d'affaires
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle Vente
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ventes aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(s => {
                  const today = new Date().toDateString();
                  return new Date(s.createdAt).toDateString() === today;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">CA du jour</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  sales
                    .filter(s => {
                      const today = new Date().toDateString();
                      return new Date(s.createdAt).toDateString() === today;
                    })
                    .reduce((sum, s) => sum + s.totalAmount, 0)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vente moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.length > 0 
                  ? formatCurrency(sales.reduce((sum, s) => sum + s.totalAmount, 0) / sales.length)
                  : formatCurrency(0)
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des ventes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Historique des ventes
          </h3>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune vente enregistrée
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par enregistrer votre première vente
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Nouvelle Vente
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <div key={sale.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        Vente #{sale.id.slice(-6)}
                      </h4>
                      {sale.customerName && (
                        <span className="text-sm text-gray-600">
                          • {sale.customerName}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{formatDate(sale.createdAt)}</p>
                      <p>{sale.items.length} article(s) • {getPaymentMethodLabel(sale.paymentMethod)}</p>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {sale.items.map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.productName} (x{item.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(sale.totalAmount)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : sale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sale.status === 'completed' ? 'Terminée' : sale.status === 'pending' ? 'En attente' : 'Annulée'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};