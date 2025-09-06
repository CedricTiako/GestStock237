import React from 'react';
import { Clock, TrendingDown, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { StockMovement } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface RecentMovementsProps {
  movements: StockMovement[];
}

export const RecentMovements: React.FC<RecentMovementsProps> = ({ movements }) => {
  const { t } = useLanguage();

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return TrendingDown;
      case 'purchase':
        return TrendingUp;
      case 'adjustment':
        return Package;
      case 'loss':
        return AlertTriangle;
      default:
        return Package;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-red-600 bg-red-50';
      case 'purchase':
        return 'text-green-600 bg-green-50';
      case 'adjustment':
        return 'text-blue-600 bg-blue-50';
      case 'loss':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="mr-2 text-gray-600" size={20} />
          {t('dashboard.recentMovements')}
        </h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {t('dashboard.viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {movements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p>{t('common.noData')}</p>
          </div>
        ) : (
          movements.map((movement) => {
            const Icon = getMovementIcon(movement.type);
            const colorClass = getMovementColor(movement.type);

            return (
              <div key={movement.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {movement.productName}
                    </p>
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(movement.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {movement.reference && `Réf: ${movement.reference}`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm font-medium ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                      </span>
                      <span className="text-xs text-gray-400">
                        Stock: {movement.balanceAfter}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};