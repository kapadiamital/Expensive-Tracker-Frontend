// src/components/budgets/BudgetSummary.jsx
import React, { useContext } from 'react';
import styled from 'styled-components';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';
import { BudgetContext } from '../../context/BudgetContext';

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const SummaryTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: ${({ theme, positive }) => positive ? theme.success : theme.error};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

const BudgetSummary = () => {
  const { budgets } = useContext(BudgetContext);

  const totalBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <SummaryContainer>
      <SummaryTitle>Budget Overview</SummaryTitle>
      
      <SummaryItem>
        <SummaryLabel>Total Budget:</SummaryLabel>
        <SummaryValue positive={true}>
          <FiDollarSign />
          {formatCurrency(totalBudget)}
        </SummaryValue>
      </SummaryItem>
      
      <SummaryItem>
        <SummaryLabel>Total Spent:</SummaryLabel>
        <SummaryValue positive={false}>
          <FiDollarSign />
          {formatCurrency(totalSpent)}
        </SummaryValue>
      </SummaryItem>
      
      <SummaryItem>
        <SummaryLabel>Remaining:</SummaryLabel>
        <SummaryValue positive={remaining >= 0}>
          {remaining >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          {formatCurrency(remaining)}
        </SummaryValue>
      </SummaryItem>
      
      <SummaryItem>
        <SummaryLabel>Utilization:</SummaryLabel>
        <SummaryValue positive={percentage < 85}>
          {isNaN(percentage) ? '0%' : percentage.toFixed(1) + '%'}
        </SummaryValue>
      </SummaryItem>
    </SummaryContainer>
  );
};

export default BudgetSummary;