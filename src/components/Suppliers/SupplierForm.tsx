import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Supplier } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface SupplierFormProps {
  supplier?: Supplier;
  onSave: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact: supplier?.contact || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    paymentTerms: supplier?.paymentTerms || 'Comptant',
    deliveryDelay: supplier?.deliveryDelay || 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {supplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Société Import-Export Douala"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                Personne de contact *
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Jean Mbarga"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +237 698 123 456"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: contact@entreprise.cm"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adresse complète du fournisseur"
              />
            </div>

            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-2">
                Conditions de paiement *
              </label>
              <select
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Comptant">Comptant</option>
                <option value="15 jours">15 jours</option>
                <option value="30 jours">30 jours</option>
                <option value="45 jours">45 jours</option>
                <option value="60 jours">60 jours</option>
              </select>
            </div>

            <div>
              <label htmlFor="deliveryDelay" className="block text-sm font-medium text-gray-700 mb-2">
                Délai de livraison (jours) *
              </label>
              <input
                type="number"
                id="deliveryDelay"
                name="deliveryDelay"
                value={formData.deliveryDelay}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save size={16} className="mr-2" />
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};