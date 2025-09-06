import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Phone, Mail, CreditCard } from 'lucide-react';
import { Customer } from '../../types';
import { CustomerForm } from './CustomerForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockCustomers } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Customers: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useLocalStorage<Customer[]>('geststock-customers', mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      // Modification
      const updatedCustomers = customers.map(c =>
        c.id === editingCustomer.id
          ? { ...customerData, id: editingCustomer.id, createdAt: editingCustomer.createdAt }
          : c
      );
      setCustomers(updatedCustomers);
    } else {
      // Création
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setCustomers([...customers, newCustomer]);
    }
    setShowForm(false);
    setEditingCustomer(undefined);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  const getTypeLabel = (type: Customer['type']) => {
    return type === 'individual' ? 'Particulier' : 'Entreprise';
  };

  const getDebtStatus = (customer: Customer) => {
    if (customer.currentDebt === 0) {
      return { color: 'text-green-600 bg-green-50', label: 'À jour' };
    }
    if (customer.currentDebt > customer.creditLimit * 0.8) {
      return { color: 'text-red-600 bg-red-50', label: 'Limite atteinte' };
    }
    return { color: 'text-yellow-600 bg-yellow-50', label: 'En cours' };
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des Clients
          </h1>
          <p className="text-gray-600">
            Base de données clients et suivi des créances
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un client
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total clients</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <CreditCard className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Créances totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(customers.reduce((sum, c) => sum + c.currentDebt, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl mr-4">
              <Users className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Particuliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.type === 'individual').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Entreprises</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.type === 'business').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par ajouter votre premier client'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un client
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crédit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => {
                  const debtStatus = getDebtStatus(customer);
                  
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </h3>
                          {customer.address && (
                            <p className="text-sm text-gray-500 mt-1">
                              {customer.address}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTypeLabel(customer.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900 mb-1">
                            <Phone size={14} className="mr-2" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-gray-500">
                              <Mail size={14} className="mr-2" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${debtStatus.color}`}>
                              {debtStatus.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Dette: {formatCurrency(customer.currentDebt)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Limite: {formatCurrency(customer.creditLimit)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingCustomer(customer);
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(undefined);
          }}
        />
      )}
    </div>
  );
};