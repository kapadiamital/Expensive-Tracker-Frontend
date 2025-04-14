  // src/context/TransactionContext.js
  import React, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
  import api from '../services/api';
  import { AuthContext } from './AuthContext';

  export const TransactionContext = createContext();

  export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
      throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
  };

  export const TransactionProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
      searchQuery: '',
      type: null,
      category: null,
      startDate: null,
      endDate: null,
    });
    const [hasFetched, setHasFetched] = useState(false);

    const fetchTransactions = useCallback(async (forceRefresh = false) => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping transaction fetch');
        return;
      }
      if ((loading && !forceRefresh) || (hasFetched && !forceRefresh)) return;

      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/transactions');
        console.log('Fetched transactions from API:', response.data);
        setAllTransactions(response.data);
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching transactions:', err.message, err.response?.data);
        setError(`Failed to load transactions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated, loading, hasFetched]);

    const filteredTransactions = useMemo(() => {
      return allTransactions.filter((transaction) => {
        const matchesSearch =
          !filters.searchQuery ||
          transaction.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          (transaction.category && transaction.category.toLowerCase().includes(filters.searchQuery.toLowerCase()));

        const matchesType = !filters.type || transaction.type === filters.type;

        const matchesCategory = !filters.category || transaction.category === filters.category;

        const transactionDate = new Date(transaction.date);
        const matchesStartDate = !filters.startDate || transactionDate >= new Date(filters.startDate);

        const matchesEndDate = !filters.endDate || transactionDate <= new Date(filters.endDate);

        return matchesSearch && matchesType && matchesCategory && matchesStartDate && matchesEndDate;
      });
    }, [allTransactions, filters]);

    const stats = useMemo(() => {
      const result = filteredTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type && transaction.type.toLowerCase() === 'income') {
            acc.income += transaction.amount || 0;
          } else if (transaction.type && transaction.type.toLowerCase() === 'expense') {
            acc.expenses += transaction.amount || 0;
          }
          return acc;
        },
        { income: 0, expenses: 0 }
      );

      const balance = result.income - result.expenses;
      const savingsRate = result.income > 0 ? ((result.income - result.expenses) / result.income) * 100 : 0;

      return {
        balance,
        income: result.income,
        expenses: result.expenses,
        savingsRate,
      };
    }, [filteredTransactions]);

    const updateFilters = useCallback((newFilters) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    }, []);

    const addTransaction = useCallback(async (transactionData) => {
      try {
        setLoading(true);
        console.log('Adding transaction:', transactionData);
        const response = await api.post('/transactions', transactionData);
        console.log('Transaction added to backend:', response.data);
        setAllTransactions((prev) => [...prev, response.data]);
        return response.data;
      } catch (err) {
        console.error('Error adding transaction:', err);
        setError('Failed to add transaction');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    const updateTransaction = useCallback(async (id, transactionData) => {
      try {
        setLoading(true);
        console.log('Updating transaction:', { id, transactionData });
        const response = await api.put(`/transactions/${id}`, transactionData);
        console.log('Transaction updated in backend:', response.data);
        setAllTransactions((prev) => prev.map((t) => (t._id === id ? response.data : t)));
        return response.data;
      } catch (err) {
        console.error('Error updating transaction:', err);
        setError('Failed to update transaction');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    const deleteTransaction = useCallback(async (id) => {
      try {
        setLoading(true);
        console.log('Deleting transaction:', id);
        await api.delete(`/transactions/${id}`);
        setAllTransactions((prev) => prev.filter((t) => t._id !== id));
      } catch (err) {
        console.error('Error deleting transaction:', err);
        setError('Failed to delete transaction');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);

    const resetFilters = useCallback(() => {
      setFilters({
        searchQuery: '',
        type: null,
        category: null,
        startDate: null,
        endDate: null,
      });
    }, []);

    useEffect(() => {
      fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
      console.log('All transactions:', allTransactions);
    }, [allTransactions]);

    return (
      <TransactionContext.Provider
        value={{
          transactions: filteredTransactions,
          allTransactions,
          stats,
          loading,
          error,
          filters,
          fetchTransactions,
          addTransaction,
          updateTransaction,
          deleteTransaction,
          updateFilters,
          resetFilters,
        }}
      >
        {children}
      </TransactionContext.Provider>
    );
  };