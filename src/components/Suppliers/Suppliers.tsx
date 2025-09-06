import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { Supplier } from '../../types';
import { SupplierForm } from './SupplierForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockSuppliers } from '../../data/mockData';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const Suppliers: React.FC = () => {
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('geststock-suppliers', mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt'>) => {
    if (editingSupplier) {
      // Modification
      const updatedSuppliers = suppliers.map(s =>
        s.id === editingSupplier.id
          ? { ...supplierData, id: editingSupplier.id, createdAt: editingSupplier.createdAt }
          : s
      );
      setSuppliers(updatedSuppliers);
    } else {
      // Création
      const newSupplier: Supplier = {
        ...supplierData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowForm(false);
    setEditingSupplier(undefined);
  };

  const handleDeleteSupplier = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion des Fournisseurs
          </h1>
          <p className="text-gray-600">
            Base de données des fournisseurs et historique des commandes
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un fournisseur
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des fournisseurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Truck size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Aucun fournisseur trouvé' : 'Aucun fournisseur'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Essayez de modifier votre recherche'
                : 'Commencez par ajouter votre premier fournisseur'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter un fournisseur
              </button>
            )}
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Truck className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">{supplier.contact}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2" />
                  {supplier.phone}
                </div>
                
                {supplier.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    {supplier.email}
                  </div>
                )}
                
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{supplier.address}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Conditions:</span>
                    <p className="font-medium text-gray-900">{supplier.paymentTerms}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Délai:</span>
                    <p className="font-medium text-gray-900">{supplier.deliveryDelay} jours</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onCancel={() => {
            setShowForm(false);
            setEditingSupplier(undefined);
          }}
        />
      )}
    </div>
  );
};