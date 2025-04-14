// src/context/BudgetContext.js
import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import api from '../services/api';
import { useTransactions } from './TransactionContext';
import { AuthContext } from './AuthContext';

export const BudgetContext = createContext();

export const useBudget = () => {
  const context = React.useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { allTransactions } = useTransactions();
  const [hasFetched, setHasFetched] = useState(false);

  const fetchBudgets = useCallback(
    async (forceRefresh = false) => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping budget fetch');
        return;
      }
      if ((loading && !forceRefresh) || (hasFetched && !forceRefresh)) return;

      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/budgets');
        setBudgets(response.data);
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching budgets:', err);
        setError('Failed to load budgets');
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, loading, hasFetched]
  );

  const addBudget = useCallback(async (budgetData) => {
    try {
      setLoading(true);
      const response = await api.post('/budgets', budgetData);
      setBudgets((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding budget:', err);
      setError(err.response?.data?.message || 'Failed to add budget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBudget = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.delete(`/budgets/${id}`);
      setBudgets((prev) => prev.filter((budget) => budget._id !== id));
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateSpending = useCallback((transactions, budgetsToCalculate) => {
    if (!transactions || !budgetsToCalculate) {
      return budgetsToCalculate || [];
    }

    const expenseTransactions = transactions.filter(
      (t) => t.type?.toLowerCase() === 'expense' && t.category
    );

    const categorySpending = expenseTransactions.reduce((acc, t) => {
      const budgetCategory = t.category.toLowerCase();
      acc[budgetCategory] = (acc[budgetCategory] || 0) + (t.amount || 0);
      return acc;
    }, {});

    const updatedBudgets = budgetsToCalculate.map((budget) => {
      const budgetCategory = budget.category.toLowerCase();
      const spent = categorySpending[budgetCategory] || 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const alertStatus = percentage >= 100 ? 'exceeded' : percentage >= 85 ? 'warning' : 'normal';

      return {
        ...budget,
        spent,
        percentage: Math.min(100, percentage),
        remaining: budget.amount - spent,
        alertStatus,
      };
    });

    return updatedBudgets;
  }, []);

  const calculatedBudgets = useMemo(() => {
    return calculateSpending(allTransactions, budgets);
  }, [allTransactions, budgets, calculateSpending]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return (
    <BudgetContext.Provider
      value={{
        budgets: calculatedBudgets,
        loading,
        error,
        fetchBudgets,
        addBudget,
        deleteBudget,
        calculateSpending,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};