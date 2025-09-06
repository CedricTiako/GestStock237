import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Package, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Sale, Product, Customer } from '../../types';

export const Reports: React.FC = () => {
  const { t } = useLanguage();
  const [sales] = useLocalStorage<Sale[]>('geststock-sales', []);
  const [products] = useLocalStorage<Product[]>('geststock-products', []);
  const [customers] = useLocalStorage<Customer[]>('geststock-customers', []);
  const [dateRange, setDateRange] = useState('month');

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  const getDateRangeData = () => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return sales.filter(sale => new Date(sale.createdAt) >= startDate);
  };

  const filteredSales = getDateRangeData();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = filteredSales.length;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Analyse des produits les plus vendus
  const productSales = filteredSales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.productId]) {
        acc[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[item.productId].quantity += item.quantity;
      acc[item.productId].revenue += item.total;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Analyse des ventes par mode de paiement
  const paymentMethods = filteredSales.reduce((acc, sale) => {
    if (!acc[sale.paymentMethod]) {
      acc[sale.paymentMethod] = { count: 0, amount: 0 };
    }
    acc[sale.paymentMethod].count++;
    acc[sale.paymentMethod].amount += sale.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  // Produits en stock critique
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

  const exportData = () => {
    const data = {
      periode: dateRange,
      resume: {
        totalVentes: totalSales,
        chiffreAffaires: totalRevenue,
        venteMoyenne: averageSale,
      },
      produitsPopulaires: topProducts,
      modesPayement: paymentMethods,
      stockCritique: lowStockProducts.map(p => ({
        nom: p.name,
        stockActuel: p.currentStock,
        stockMinimum: p.minStock,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-geststock-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rapports & Analyses
          </h1>
          <p className="text-gray-600">
            Statistiques détaillées et export des données
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>

          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Download size={20} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nombre de ventes</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Vente moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageSale)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-xl mr-4">
              <Package className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock critique</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Produits les plus vendus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produits les plus vendus
          </h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p>Aucune vente pour cette période</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.quantity} unités vendues</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modes de paiement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par mode de paiement
          </h3>
          {Object.keys(paymentMethods).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
              <p>Aucune vente pour cette période</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(paymentMethods).map(([method, data]) => {
                const percentage = totalRevenue > 0 ? (data.amount / totalRevenue) * 100 : 0;
                const methodLabel = t(`payment.${method}`);
                
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{methodLabel}</span>
                      <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{data.count} vente(s)</span>
                      <span>{formatCurrency(data.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stock critique */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produits en stock critique
          </h3>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8 text-green-500">
              <Package size={48} className="mx-auto text-green-300 mb-3" />
              <p>Tous les stocks sont au niveau optimal ✓</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-red-600">
                      Stock: {product.currentStock} (Min: {product.minStock})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Critique
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résumé clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Résumé clients
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="text-blue-600 mr-3" size={20} />
                <span className="font-medium text-gray-900">Total clients</span>
              </div>
              <span className="text-xl font-bold text-blue-600">{customers.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="text-yellow-600 mr-3" size={20} />
                <span className="font-medium text-gray-900">Créances totales</span>
              </div>
              <span className="text-xl font-bold text-yellow-600">
                {formatCurrency(customers.reduce((sum, c) => sum + c.currentDebt, 0))}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={20} />
                <span className="font-medium text-gray-900">Clients à jour</span>
              </div>
              <span className="text-xl font-bold text-green-600">
                {customers.filter(c => c.currentDebt === 0).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};