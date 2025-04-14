import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDollarSign, FiArrowUp, FiArrowDown, FiPieChart, FiEye, FiList, FiTrendingUp } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { TransactionContext } from '../context/TransactionContext';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import TransactionList from '../components/transactions/TransactionList';
import ExpenseChart from '../components/dashboard/ExpenseChart';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent;
  min-height: 100vh;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const StatCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #d1d9e6;
  border-radius: 1rem; /* Increased border radius for a smoother look */
  padding: 1.25rem; /* Slightly increased padding */
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Added box shadow for depth */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px); /* Slightly more lift on hover */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem; /* Increased margin for better spacing */
`;

const StatTitle = styled.h3`
  font-size: 1rem; /* Slightly larger font size */
  font-weight: 600; /* Bolder font weight */
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const StatIconContainer = styled.div`
  width: 36px; /* Slightly larger icon container */
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color}20;
  color: ${({ color }) => color};
  transition: transform 0.3s ease;

  ${StatCard}:hover & {
    transform: rotate(360deg);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const StatValue = styled.div`
  font-size: 1.75rem; /* Increased font size for better visibility */
  font-weight: 700;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.85rem; /* Slightly larger font size */
  color: ${({ $isPositive }) => ($isPositive ? '#28a745' : '#dc3545')};

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const DashboardCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #d1d9e6;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  width: 100%;
`;

const TabButton = styled(motion.button)`
  flex: 1;
  max-width: 130px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #d1d9e6;
  border-radius: 0.25rem;
  background: ${({ $active }) => ($active ? '#007bff' : '#f5f7fa')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#333')};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#0056b3' : '#e0e4e9')};
    transform: scale(1.03);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 110px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    max-width: 90px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    gap: 0.25rem;
  }
`;

const LegendContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.25rem 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.3rem;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  padding: 0.3rem;
  border-radius: 0.5rem;
  transition: background 0.3s ease;

  &:hover {
    background: #f5f7fa;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    gap: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 0.3rem;
  }
`;

const LegendColor = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background-color: ${({ color }) => color};

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

const LegendIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #666;

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const ViewAllButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #007bff;
  background: none;
  border: 1px solid #d1d9e6;
  border-radius: 0.25rem;
  padding: 0.4rem 0.8rem;
  transition: color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    color: #0056b3;
    transform: scale(1.03);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    background: none;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
`;

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { transactions, stats, loading, error, fetchTransactions } = useContext(TransactionContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expense');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const categories = [
    { name: 'shopping', color: '#007bff', icon: <FiDollarSign /> },
    { name: 'utilities', color: '#28a745', icon: <FiArrowUp /> },
    { name: 'transportation', color: '#ff8c00', icon: <FiTrendingUp /> },
    { name: 'education', color: '#dc3545', icon: <FiArrowDown /> },
    { name: 'travel', color: '#6f42c1', icon: <FiPieChart /> },
    { name: 'housing', color: '#17a2b8', icon: <FiDollarSign /> },
    { name: 'food', color: '#fd7e14', icon: <FiArrowUp /> },
    { name: 'personal_care', color: '#20c997', icon: <FiTrendingUp /> },
    { name: 'debt_payments', color: '#e83e8c', icon: <FiArrowDown /> },
    { name: 'other_expense', color: '#6610f2', icon: <FiPieChart /> },
  ];

  const getChartData = () => {
    if (activeTab === 'income') {
      const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return [
        { name: 'Income', value: income, color: '#28a745', icon: <FiArrowUp /> },
        { name: 'Expense', value: expense, color: '#dc3545', icon: <FiArrowDown /> },
      ].filter((d) => d.value > 0);
    }

    const data = categories.map((category) => {
      const total = transactions
        .filter((t) => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, value: total };
    });
    return data.filter((d) => d.value > 0);
  };

  const chartData = getChartData();
  const total = activeTab === 'expense' ? stats.expenses : stats.income;

  if (loading) {
    return <Loader fullPage />;
  }

  if (error) {
    return (
      <DashboardContainer>
        <div>Error: {error}</div>
        <Button onClick={() => fetchTransactions()}>Try Again</Button>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <Title>Welcome, {user?.name || 'User'}!</Title>
          <Subtitle>Here's an overview of your finances</Subtitle>
        </div>
      </Header>

      <StatsContainer>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate('/transactions')}
        >
          <StatHeader>
            <StatTitle>Current Balance</StatTitle>
            <StatIconContainer color="#007bff">
              <FiDollarSign />
            </StatIconContainer>
          </StatHeader>
          <StatValue>{formatCurrency(stats.balance)}</StatValue>
          <StatChange $isPositive={stats.balance >= 0}>
            {stats.balance >= 0 ? <FiArrowUp /> : <FiArrowDown />}
            {Math.abs(stats.savingsRate).toFixed(1)}% of income
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => navigate('/transactions')}
        >
          <StatHeader>
            <StatTitle>Total Income</StatTitle>
            <StatIconContainer color="#28a745">
              <FiArrowUp />
            </StatIconContainer>
          </StatHeader>
          <StatValue>{formatCurrency(stats.income)}</StatValue>
          <StatChange $isPositive={true}>
            <FiArrowUp />
            This month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => navigate('/transactions')}
        >
          <StatHeader>
            <StatTitle>Total Expenses</StatTitle>
            <StatIconContainer color="#dc3545">
              <FiArrowDown />
            </StatIconContainer>
          </StatHeader>
          <StatValue>{formatCurrency(stats.expenses)}</StatValue>
          <StatChange $isPositive={false}>
            <FiArrowDown />
            This month
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => navigate('/budgets')}
        >
          <StatHeader>
            <StatTitle>Savings Rate</StatTitle>
            <StatIconContainer color="#007bff">
              <FiPieChart />
            </StatIconContainer>
          </StatHeader>
          <StatValue>{stats.savingsRate.toFixed(1)}%</StatValue>
          <StatChange $isPositive={stats.savingsRate > 0}>
            {stats.savingsRate > 0 ? <FiArrowUp /> : <FiArrowDown />}
            Of total income
          </StatChange>
        </StatCard>
      </StatsContainer>

      <DashboardContent>
        <DashboardCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <TabsContainer>
            <TabButton
              $active={activeTab === 'expense'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('expense')}
            >
              <FiList size={14} /> By Category
            </TabButton>
            <TabButton
              $active={activeTab === 'income'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('income')}
            >
              <FiTrendingUp size={14} /> Income vs Expense
            </TabButton>
          </TabsContainer>
          <ExpenseChart transactions={transactions} activeTab={activeTab} />
          <LegendContainer>
            {chartData.map((item) => (
              <LegendItem key={item.name}>
                <LegendColor color={item.color} />
                <LegendIcon>{item.icon}</LegendIcon>
                <span>
                  {item.name.replace('_', ' ')} (
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : '0'}%)
                </span>
              </LegendItem>
            ))}
          </LegendContainer>
        </DashboardCard>

        <DashboardCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <ViewAllButton
              variant="text"
              size="small"
              onClick={() => navigate('/transactions')}
            >
              <span>View All</span>
              <FiEye size={14} />
            </ViewAllButton>
          </CardHeader>
          <TransactionList
            transactions={transactions.slice(0, 5)}
            compact
            hideActions={true} // Add prop to hide edit and delete buttons
          />
        </DashboardCard>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default DashboardPage;