import React from 'react';
import { 
  DollarSign, 
  Package, 
  TrendingDown, 
  Users, 
  Truck, 
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { RecentMovements } from './RecentMovements';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockDashboardStats } from '../../data/mockData';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const stats = mockDashboardStats;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.fcfa')}`;
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité commerciale
        </p>
      </div>

      {/* Cartes statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={t('dashboard.todaySales')}
          value={formatCurrency(stats.todaySales)}
          icon={DollarSign}
          color="green"
          trend={{ value: 12, isPositive: true }}
          onClick={() => onNavigate('sales')}
        />
        
        <StatsCard
          title={t('dashboard.monthSales')}
          value={formatCurrency(stats.monthSales)}
          icon={TrendingDown}
          color="blue"
          trend={{ value: 8, isPositive: true }}
          onClick={() => onNavigate('reports')}
        />
        
        <StatsCard
          title={t('dashboard.totalProducts')}
          value={stats.totalProducts}
          icon={Package}
          color="purple"
          onClick={() => onNavigate('products')}
        />
        
        <StatsCard
          title={t('dashboard.lowStock')}
          value={stats.lowStockCount}
          icon={AlertTriangle}
          color="red"
          onClick={() => onNavigate('products')}
        />
      </div>

      {/* Cartes statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title={t('dashboard.suppliers')}
          value={stats.totalSuppliers}
          icon={Truck}
          color="indigo"
          onClick={() => onNavigate('suppliers')}
        />
        
        <StatsCard
          title={t('dashboard.customers')}
          value={stats.totalCustomers}
          icon={Users}
          color="yellow"
          onClick={() => onNavigate('customers')}
        />
        
        <StatsCard
          title={t('dashboard.pendingOrders')}
          value={stats.pendingOrders}
          icon={ShoppingBag}
          color="blue"
          onClick={() => onNavigate('purchases')}
        />
      </div>

      {/* Alertes importantes */}
      {stats.lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="text-red-600 mr-3" size={24} />
            <div>
              <h3 className="text-red-800 font-medium">
                Attention : {stats.lowStockCount} produit(s) en stock critique
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Certains produits nécessitent un réapprovisionnement urgent.
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Voir les produits
            </button>
          </div>
        </div>
      )}

      {/* Mouvements récents */}
      <RecentMovements movements={stats.recentMovements} />
    </div>
  );
};