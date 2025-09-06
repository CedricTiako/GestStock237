// Types pour l'application GestStock237

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'accountant';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: 'piece' | 'box' | 'liter' | 'kg' | 'meter';
  currentStock: number;
  minStock: number;
  maxStock: number;
  buyPrice: number;
  sellPrice: number;
  supplierId?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email?: string;
  address: string;
  paymentTerms: string;
  deliveryDelay: number; // en jours
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: 'individual' | 'business';
  creditLimit: number;
  currentDebt: number;
  address?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'mobile_money' | 'credit' | 'card';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
  orderDate: Date;
  receivedDate?: Date;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'loss';
  quantity: number;
  balanceAfter: number;
  reference?: string; // ID de la vente/achat associé
  createdAt: Date;
  notes?: string;
}

export interface DashboardStats {
  todaySales: number;
  monthSales: number;
  totalProducts: number;
  lowStockCount: number;
  totalSuppliers: number;
  totalCustomers: number;
  pendingOrders: number;
  recentMovements: StockMovement[];
}

export type Language = 'fr' | 'en';