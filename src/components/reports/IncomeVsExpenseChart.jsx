// src/components/reports/IncomeVsExpenseChart.jsx
import React from 'react';
import styled from 'styled-components';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.5rem;
  margin-bottom: 2rem;
  height: 400px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const ChartTypeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartTypeButton = styled.button`
  background: ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  border: 1px solid ${({ theme }) => theme.primary};
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.primary : theme.primary + '20'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const IncomeVsExpenseChart = ({ data, chartType, setChartType }) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Income vs Expenses</ChartTitle>
          <ChartTypeSelector>
            <ChartTypeButton 
              active={chartType === 'bar'} 
              onClick={() => setChartType('bar')}
            >
              Bar
            </ChartTypeButton>
            <ChartTypeButton 
              active={chartType === 'line'} 
              onClick={() => setChartType('line')}
            >
              Line
            </ChartTypeButton>
            <ChartTypeButton 
              active={chartType === 'area'} 
              onClick={() => setChartType('area')}
            >
              Area
            </ChartTypeButton>
          </ChartTypeSelector>
        </ChartHeader>
        <EmptyState>
          <p>No data available for the selected filters.</p>
        </EmptyState>
      </ChartContainer>
    );
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '0.5rem', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: 0, 
              color: entry.color
            }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Income vs Expenses</ChartTitle>
        <ChartTypeSelector>
          <ChartTypeButton 
            active={chartType === 'bar'} 
            onClick={() => setChartType('bar')}
          >
            Bar
          </ChartTypeButton>
          <ChartTypeButton 
            active={chartType === 'line'} 
            onClick={() => setChartType('line')}
          >
            Line
          </ChartTypeButton>
          <ChartTypeButton 
            active={chartType === 'area'} 
            onClick={() => setChartType('area')}
          >
            Area
          </ChartTypeButton>
        </ChartTypeSelector>
      </ChartHeader>
      
      <ResponsiveContainer width="100%" height="85%">
        {chartType === 'bar' && (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#4CAF50" />
            <Bar dataKey="expense" name="Expenses" fill="#F44336" />
          </BarChart>
        )}
        
        {chartType === 'line' && (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#4CAF50" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              name="Expenses" 
              stroke="#F44336" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        )}
        
        {chartType === 'area' && (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Income" 
              stroke="#4CAF50" 
              fill="#4CAF5020" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              name="Expenses" 
              stroke="#F44336" 
              fill="#F4433620" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default IncomeVsExpenseChart;
