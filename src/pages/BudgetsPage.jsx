// src/pages/BudgetsPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FiPieChart, FiPlus, FiTrendingUp, FiTrendingDown, FiAlertTriangle } from 'react-icons/fi';
import { useBudget } from '../context/BudgetContext';
import { useTransactions } from '../context/TransactionContext';
import AddBudgetModal from '../components/budgets/AddBudgetModal';
import BudgetList from '../components/budgets/BudgetList';
import BudgetSummary from '../components/budgets/BudgetSummary';

const BudgetsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem; /* Reduce padding on smaller screens */
  }
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

  @media (max-width: 768px) {
    font-size: 1.5rem; /* Smaller title on mobile */
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem; /* Smaller button on mobile */
    font-size: 0.9rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem; /* Tighter gap on smaller screens */
  }
`;

const BudgetCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.5rem;
  height: 100%;

  @media (max-width: 768px) {
    padding: 1rem; /* Reduce padding on smaller screens */
  }
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Match Budget Overview spacing */
  background: ${({ theme }) => theme.surface};
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 768px) {
    padding: 1rem; /* Reduce padding on smaller screens */
    gap: 0.75rem; /* Slightly tighter spacing */
  }
`;

const StatusTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.1rem; /* Slightly smaller title on mobile */
    margin-bottom: 0.75rem;
  }
`;

const StatusLegend = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    flex-wrap: wrap; /* Allow legend items to wrap on smaller screens */
    gap: 0.75rem;
    padding: 0.4rem 0;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Slightly smaller font on mobile */
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Tighter spacing for alerts */
`;

const AlertItem = styled.div`
  display: flex;
  justify-content: space-between; /* Match Budget Overview label-value alignment */
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 768px) {
    padding: 0.4rem 0;
  }
`;

const AlertLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const AlertValue = styled.span`
  font-weight: 600;
  color: ${({ status, theme }) => (status === 'exceeded' ? theme.error : '#FFA500')}; /* Use theme.error for exceeded, orange for warning */
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const NoAlertsMessage = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.95rem;
  padding: 0.5rem 0;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0;
  }
`;

const BudgetsPage = () => {
  const { budgets, calculateSpending, deleteBudget } = useBudget();
  const { allTransactions } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [calculatedBudgets, setCalculatedBudgets] = useState([]);

  useEffect(() => {
    if (budgets && allTransactions) {
      const updatedBudgets = calculateSpending(allTransactions, budgets);
      setCalculatedBudgets(updatedBudgets);
    }
  }, [budgets, allTransactions, calculateSpending]);

  const totalBudget = calculatedBudgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
  const totalSpent = calculatedBudgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const budgetAlerts = calculatedBudgets.filter(
    (budget) => budget.alertStatus === 'warning' || budget.alertStatus === 'exceeded'
  );

  return (
    <BudgetsContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <FiPieChart /> Budgets
        </Title>
        <ActionButton
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus /> Add Budget
        </ActionButton>
      </Header>

      <ContentGrid>
        <BudgetCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BudgetSummary
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            utilization={utilization}
          />
        </BudgetCard>

        <BudgetCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatusContainer>
            <StatusTitle>Budget Status</StatusTitle>
            <StatusLegend>
              <LegendItem>
                <FiTrendingUp color="#4CAF50" /> On Track
              </LegendItem>
              <LegendItem>
                <FiTrendingDown color="#F44336" /> Over Budget
              </LegendItem>
              <LegendItem>
                <FiAlertTriangle color="#FFA500" /> Warning
              </LegendItem>
            </StatusLegend>
            {budgetAlerts.length > 0 ? (
              <AlertList>
                {budgetAlerts.map((budget) => (
                  <AlertItem key={budget._id}>
                    <AlertLabel>
                      <FiAlertTriangle color={budget.alertStatus === 'exceeded' ? '#F44336' : '#FFA500'} />
                      {budget.category}:
                    </AlertLabel>
                    <AlertValue status={budget.alertStatus}>
                      {budget.alertStatus === 'exceeded' ? 'Exceeded budget' : 'Nearing budget'} (
                      {budget.percentage.toFixed(1)}%)
                    </AlertValue>
                  </AlertItem>
                ))}
              </AlertList>
            ) : (
              <NoAlertsMessage>All budgets are on track!</NoAlertsMessage>
            )}
          </StatusContainer>
        </BudgetCard>
      </ContentGrid>

      <BudgetCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginTop: '1.5rem' }}
      >
        <h3 style={{ marginTop: 0 }}>Your Budgets</h3>
        <BudgetList
          budgets={calculatedBudgets}
          deleteBudget={deleteBudget}
        />
      </BudgetCard>

      <AddBudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </BudgetsContainer>
  );
};

export default BudgetsPage;