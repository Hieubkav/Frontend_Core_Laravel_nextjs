import React from 'react';

export interface SaleData {
  month: string;
  revenue: number;
  expenses: number;
  orders: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  spent: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: string;
  growth: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  description: string;
}

export interface StatMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  description?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  user: string;
  email: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
}
