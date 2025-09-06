import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.products': 'Produits',
    'nav.sales': 'Ventes',
    'nav.purchases': 'Achats',
    'nav.suppliers': 'Fournisseurs',
    'nav.customers': 'Clients',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',

    // Dashboard
    'dashboard.title': 'Tableau de bord - GestStock237',
    'dashboard.todaySales': "Ventes aujourd'hui",
    'dashboard.monthSales': 'Ventes du mois',
    'dashboard.totalProducts': 'Total produits',
    'dashboard.lowStock': 'Stock critique',
    'dashboard.suppliers': 'Fournisseurs',
    'dashboard.customers': 'Clients',
    'dashboard.pendingOrders': 'Commandes en attente',
    'dashboard.recentMovements': 'Mouvements récents',
    'dashboard.viewAll': 'Voir tout',

    // Products
    'products.title': 'Gestion des produits',
    'products.addProduct': 'Ajouter un produit',
    'products.name': 'Nom du produit',
    'products.category': 'Catégorie',
    'products.unit': 'Unité',
    'products.currentStock': 'Stock actuel',
    'products.minStock': 'Stock minimum',
    'products.buyPrice': "Prix d'achat",
    'products.sellPrice': 'Prix de vente',
    'products.supplier': 'Fournisseur',
    'products.actions': 'Actions',
    'products.edit': 'Modifier',
    'products.delete': 'Supprimer',
    'products.search': 'Rechercher un produit...',

    // Sales
    'sales.title': 'Enregistrer une vente',
    'sales.customer': 'Client',
    'sales.selectCustomer': 'Sélectionner un client',
    'sales.newCustomer': 'Nouveau client',
    'sales.product': 'Produit',
    'sales.selectProduct': 'Sélectionner un produit',
    'sales.quantity': 'Quantité',
    'sales.unitPrice': 'Prix unitaire',
    'sales.total': 'Total',
    'sales.addItem': 'Ajouter un article',
    'sales.paymentMethod': 'Mode de paiement',
    'sales.cash': 'Espèces',
    'sales.mobileMoneyy': 'Mobile Money',
    'sales.credit': 'Crédit',
    'sales.card': 'Carte',
    'sales.completeSale': 'Finaliser la vente',
    'sales.grandTotal': 'Total général',

    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher...',
    'common.loading': 'Chargement...',
    'common.noData': 'Aucune donnée disponible',
    'common.fcfa': 'F CFA',

    // Units
    'unit.piece': 'Pièce',
    'unit.box': 'Carton',
    'unit.liter': 'Litre',
    'unit.kg': 'Kilogramme',
    'unit.meter': 'Mètre',

    // Categories
    'category.food': 'Alimentaire',
    'category.electronics': 'Électronique',
    'category.clothing': 'Vêtements',
    'category.beauty': 'Beauté',
    'category.household': 'Ménage',
    'category.other': 'Autre',

    // Payment methods
    'payment.cash': 'Espèces',
    'payment.mobile_money': 'Mobile Money',
    'payment.credit': 'Crédit',
    'payment.card': 'Carte bancaire',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.sales': 'Sales',
    'nav.purchases': 'Purchases',
    'nav.suppliers': 'Suppliers',
    'nav.customers': 'Customers',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.title': 'Dashboard - GestStock237',
    'dashboard.todaySales': 'Today Sales',
    'dashboard.monthSales': 'Month Sales',
    'dashboard.totalProducts': 'Total Products',
    'dashboard.lowStock': 'Low Stock',
    'dashboard.suppliers': 'Suppliers',
    'dashboard.customers': 'Customers',
    'dashboard.pendingOrders': 'Pending Orders',
    'dashboard.recentMovements': 'Recent Movements',
    'dashboard.viewAll': 'View All',

    // Products
    'products.title': 'Product Management',
    'products.addProduct': 'Add Product',
    'products.name': 'Product Name',
    'products.category': 'Category',
    'products.unit': 'Unit',
    'products.currentStock': 'Current Stock',
    'products.minStock': 'Min Stock',
    'products.buyPrice': 'Buy Price',
    'products.sellPrice': 'Sell Price',
    'products.supplier': 'Supplier',
    'products.actions': 'Actions',
    'products.edit': 'Edit',
    'products.delete': 'Delete',
    'products.search': 'Search product...',

    // Sales
    'sales.title': 'Record Sale',
    'sales.customer': 'Customer',
    'sales.selectCustomer': 'Select Customer',
    'sales.newCustomer': 'New Customer',
    'sales.product': 'Product',
    'sales.selectProduct': 'Select Product',
    'sales.quantity': 'Quantity',
    'sales.unitPrice': 'Unit Price',
    'sales.total': 'Total',
    'sales.addItem': 'Add Item',
    'sales.paymentMethod': 'Payment Method',
    'sales.cash': 'Cash',
    'sales.mobileMoney': 'Mobile Money',
    'sales.credit': 'Credit',
    'sales.card': 'Card',
    'sales.completeSale': 'Complete Sale',
    'sales.grandTotal': 'Grand Total',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.search': 'Search...',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.fcfa': 'F CFA',

    // Units
    'unit.piece': 'Piece',
    'unit.box': 'Box',
    'unit.liter': 'Liter',
    'unit.kg': 'Kilogram',
    'unit.meter': 'Meter',

    // Categories
    'category.food': 'Food',
    'category.electronics': 'Electronics',
    'category.clothing': 'Clothing',
    'category.beauty': 'Beauty',
    'category.household': 'Household',
    'category.other': 'Other',

    // Payment methods
    'payment.cash': 'Cash',
    'payment.mobile_money': 'Mobile Money',
    'payment.credit': 'Credit',
    'payment.card': 'Bank Card',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const saved = localStorage.getItem('geststock-language') as Language;
    if (saved && ['fr', 'en'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('geststock-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};