import React, { useState } from 'react';
import { Plus, Minus, Save, X } from 'lucide-react';
import { Sale, SaleItem, Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockProducts } from '../../data/mockData';

interface SaleFormProps {
  onSave: (sale: Omit<Sale, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ onSave, onCancel }) => {
  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('cash');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
  });

  const products = mockProducts;
  const selectedProduct = products.find(p => p.id === currentItem.productId);

  const handleAddItem = () => {
    if (!selectedProduct || currentItem.quantity <= 0) return;

    const newItem: SaleItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: currentItem.quantity,
      unitPrice: selectedProduct.sellPrice,
      total: currentItem.quantity * selectedProduct.sellPrice,
    };

    setItems([...items, newItem]);
    setCurrentItem({ productId: '', quantity: 1 });
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return;
    
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity,
          total: quantity * item.unitPrice,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Veuillez ajouter au moins un article');
      return;
    }

    const saleData: Omit<Sale, 'id' | 'createdAt'> = {
      customerName: customerName || undefined,
      items,
      totalAmount,
      paymentMethod,
      status: 'completed',
      notes: '',
    };

    onSave(saleData);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('sales.title')}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Informations client */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('sales.customer')} (optionnel)
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nom du client"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Ajout d'articles */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter un article</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sales.product')}
              </label>
              <select
                value={currentItem.productId}
                onChange={(e) => setCurrentItem({ ...currentItem, productId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('sales.selectProduct')}</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - Stock: {product.currentStock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sales.quantity')}
              </label>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                min="1"
                max={selectedProduct?.currentStock || 1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProduct || currentItem.quantity <= 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Plus size={16} className="mr-2" />
                Ajouter
              </button>
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-3 text-sm text-gray-600">
              Prix unitaire: {formatCurrency(selectedProduct.sellPrice)} | 
              Stock disponible: {selectedProduct.currentStock}
            </div>
          )}
        </div>

        {/* Liste des articles */}
        {items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Articles sélectionnés</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.unitPrice)} x {item.quantity} = {formatCurrency(item.total)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-red-400 hover:text-red-600 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {t('sales.grandTotal')}:
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mode de paiement */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('sales.paymentMethod')}
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as Sale['paymentMethod'])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="cash">{t('payment.cash')}</option>
            <option value="mobile_money">{t('payment.mobile_money')}</option>
            <option value="credit">{t('payment.credit')}</option>
            <option value="card">{t('payment.card')}</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={items.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save size={16} className="mr-2" />
            {t('sales.completeSale')}
          </button>
        </div>
      </form>
    </div>
  );
};