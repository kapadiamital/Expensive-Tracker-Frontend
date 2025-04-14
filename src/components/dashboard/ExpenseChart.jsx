import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';
import { FiDollarSign, FiArrowUp, FiTrendingUp, FiArrowDown, FiPieChart } from 'react-icons/fi';

const ChartContainer = styled.div`
  width: 100%;
  height: 380px; /* Increased height to accommodate larger pie chart (was 300px) */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0;

  @media (max-width: 992px) {
    height: 340px; /* Increased from 260px */
  }

  @media (max-width: 768px) {
    height: 300px; /* Increased from 220px */
  }

  @media (max-width: 480px) {
    height: 260px; /* Increased from 180px */
  }
`;

const CustomTooltip = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.4rem;
  }
`;

const ExpenseChart = ({ transactions, activeTab }) => {
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

  const data = getChartData();

  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <CustomTooltip>
          {name.replace('_', ' ')}: ${value.toLocaleString()}
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={data.length <= 2 ? "90%" : "85%"} // Increased to near-maximum safe values
            dataKey="value"
            labelLine={false}
            animationDuration={500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ExpenseChart;