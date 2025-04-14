// src/utils/constants.js
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { id: 'salary', name: 'Salary', icon: '💼' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'investment', name: 'Investment', icon: '📈' },
    { id: 'gift', name: 'Gift', icon: '🎁' },
    { id: 'other_income', name: 'Other', icon: '💰' }
  ],
  EXPENSE: [
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'utilities', name: 'Utilities', icon: '💡' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'personal', name: 'Personal Care', icon: '💇' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'debt', name: 'Debt Payments', icon: '💳' },
    { id: 'other_expense', name: 'Other', icon: '📝' }
  ]
};

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '🏧' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'mobile_payment', name: 'Mobile Payment', icon: '📱' },
  { id: 'other_payment', name: 'Other', icon: '💸' }
];

export const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#8AC249', '#EA5545', '#F46A9B', '#EF9B20',
  '#EDBF33', '#87BC45', '#27AEEF', '#B33DC6'
];

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  TRANSACTIONS: '/api/transactions',
  BUDGETS: '/api/budgets',
  GOALS: '/api/goals',
  USER_PROFILE: '/api/user/profile'
};

export const CATEGORIES = TRANSACTION_CATEGORIES;

export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'lastYear', label: 'Last Year' }
];