import React, { useState } from 'react';
import { Plus, Package, Calendar, Truck, AlertCircle } from 'lucide-react';
import { Purchase } from '../../types';
import { PurchaseForm } from './PurchaseForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Purchases: React.FC = () => {
  const { t } = useLanguage();
  const [purchases, setPurchases] = useLocalStorage<Purchase[]>('geststock-purchases', []);
  const [showForm, setShowForm] = useState(false);

  const handleSavePurchase = (purchaseData: Omit<Purchase, 'id' | 'orderDate'>) => {
    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now().toString(),
      orderDate: new Date(),
    };
    
    setPurchases([newPurchase, ...purchases]);
    setShowForm(false);
    
    alert(`Commande créée avec succès ! Total: ${newPurchase.totalAmount.toLocaleString()} ${t('common.fcfa')}`);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: Purchase['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Purchase['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'received':
        return 'Reçue';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <PurchaseForm
          onSave={handleSavePurchase}
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
            Gestion des Achats
          </h1>
          <p className="text-gray-600">
            Gérez vos commandes fournisseurs et réapprovisionnements
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Nouvelle Commande
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total commandes</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl mr-4">
              <Calendar className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchases.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <Truck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reçues</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchases.filter(p => p.status === 'received').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <AlertCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Valeur totale</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(purchases.reduce((sum, p) => sum + p.totalAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Historique des commandes
          </h3>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande enregistrée
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre première commande fournisseur
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nouvelle Commande
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        Commande #{purchase.id.slice(-6)}
                      </h4>
                      <span className="text-sm text-gray-600">
                        • {purchase.supplierName}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Commandé le {formatDate(purchase.orderDate)}</p>
                      {purchase.receivedDate && (
                        <p>Reçu le {formatDate(purchase.receivedDate)}</p>
                      )}
                      <p>{purchase.items.length} article(s)</p>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {purchase.items.map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.productName} (x{item.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatCurrency(purchase.totalAmount)}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {getStatusLabel(purchase.status)}
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