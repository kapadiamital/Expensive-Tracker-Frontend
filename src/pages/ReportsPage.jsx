import React, { useState, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiBarChart2 } from 'react-icons/fi';
import { TransactionContext } from '../context/TransactionContext';
import ReportFilters from '../components/reports/ReportFilters';
import ExpenseChart from '../components/reports/ExpenseChart';
import IncomeVsExpenseChart from '../components/reports/IncomeVsExpenseChart';
import {
  getStartOfMonth, getEndOfMonth, getStartOfYear, getEndOfYear,
  getCurrentMonth, getCurrentYear, formatDate
} from '../utils/dateUtils';

const ReportsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;


const ChartContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ReportsPage = () => {
  const { transactions } = useContext(TransactionContext);
  const [filters, setFilters] = useState({
    dateRange: 'thisMonth',
    groupBy: 'category',
    type: 'all',
    startMonth: getCurrentMonth(),
    startYear: getCurrentYear(),
    endMonth: getCurrentMonth(),
    endYear: getCurrentYear(),
  });
  const [expenseChartType, setExpenseChartType] = useState('bar');
  const [incomeExpenseChartType, setIncomeExpenseChartType] = useState('bar');

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  // Process transactions based on filters
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Step 1: Filter by date range
    const now = new Date();
    let startDate, endDate;

    switch (filters.dateRange) {
      case 'thisMonth':
        startDate = getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
        endDate = getEndOfMonth(now.getFullYear(), now.getMonth() + 1);
        break;
      case 'lastMonth':
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth();
        const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        startDate = getStartOfMonth(lastMonthYear, lastMonth + 1);
        endDate = getEndOfMonth(lastMonthYear, lastMonth + 1);
        break;
      case 'thisYear':
        startDate = getStartOfYear(now.getFullYear());
        endDate = getEndOfYear(now.getFullYear());
        break;
      case 'custom':
        startDate = getStartOfMonth(filters.startYear, filters.startMonth);
        endDate = getEndOfMonth(filters.endYear, filters.endMonth);
        break;
      default:
        startDate = new Date(0); // All time
        endDate = new Date();
    }

    filtered = filtered.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Step 2: Filter by transaction type
    if (filters.type !== 'all') {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    return filtered;
  }, [transactions, filters]);

  // Step 3: Prepare data for ExpenseChart (group by category, month, or day)
  const expenseChartData = useMemo(() => {
    let groupedData = [];

    if (filters.groupBy === 'category') {
      const categoryTotals = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
          const key = t.category || 'Uncategorized';
          if (!acc[key]) acc[key] = 0;
          acc[key] += t.amount;
          return acc;
        }, {});

      groupedData = Object.keys(categoryTotals).map((key) => ({
        name: key,
        value: categoryTotals[key],
      }));
    } else {
      // Group by time (month or day)
      const timeMap = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => {
          const date = new Date(t.date);
          let key;
          if (filters.groupBy === 'month') {
            // Format as "MMM YYYY" (e.g., "Apr 2025")
            key = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          } else {
            // Format as "MMM DD, YYYY" (e.g., "Apr 10, 2025")
            key = formatDate(t.date);
          }
          if (!acc[key]) acc[key] = 0;
          acc[key] += t.amount;
          return acc;
        }, {});

      groupedData = Object.keys(timeMap)
        .map((key) => ({
          name: key,
          value: timeMap[key],
        }))
        .sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort chronologically
    }

    return groupedData;
  }, [filteredTransactions, filters.groupBy]);

  // Step 4: Prepare data for IncomeVsExpenseChart (group by month or day)
  const incomeVsExpenseChartData = useMemo(() => {
    const timeMap = {};

    filteredTransactions.forEach((t) => {
      const date = new Date(t.date);
      let key;
      if (filters.groupBy === 'category') {
        key = t.category || 'Uncategorized';
      } else if (filters.groupBy === 'month') {
        key = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      } else {
        key = formatDate(t.date);
      }

      if (!timeMap[key]) {
        timeMap[key] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        timeMap[key].income += t.amount;
      } else {
        timeMap[key].expense += t.amount;
      }
    });

    return Object.keys(timeMap)
      .map((key) => ({
        name: key,
        income: timeMap[key].income,
        expense: timeMap[key].expense,
      }))
      .sort((a, b) => new Date(a.name) - new Date(b.name)); // Sort chronologically
  }, [filteredTransactions, filters.groupBy]);

  return (
    <ReportsContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FiBarChart2 /> Reports & Analytics
        </Title>
      </Header>

      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <ChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ExpenseChart
          data={expenseChartData}
          chartType={expenseChartType}
          setChartType={setExpenseChartType}
        />
      </ChartContainer>

      <ChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <IncomeVsExpenseChart
          data={incomeVsExpenseChartData}
          chartType={incomeExpenseChartType}
          setChartType={setIncomeExpenseChartType}
        />
      </ChartContainer>
    </ReportsContainer>
  );
};

export default ReportsPage;