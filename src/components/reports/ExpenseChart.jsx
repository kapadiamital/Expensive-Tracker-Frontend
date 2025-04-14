import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.5rem;
  margin-bottom: 2rem;
  height: auto; /* Allow height to adjust based on content */
  min-height: 500px; /* Increased minimum height for better visibility */
  overflow: auto; /* Handle overflow on smaller screens */

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 450px; /* Slightly smaller for tablets */
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 400px; /* Adjusted for mobile */
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ChartTypeSelector = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
`;

const ChartTypeButton = styled.button`
  background: ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.text)};
  border: 1px solid ${({ theme }) => theme.primary};
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.primary : theme.primary + '20')};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
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

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 3px;
  }
`;

const LegendColor = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin-right: 8px;

  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
    margin-right: 6px;
  }
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];

const ExpenseChart = ({ data, chartType, setChartType }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Filter out invalid data and ensure values are numbers
  const filteredData = (data || [])
    .filter(item => {
      const isValid = item && typeof item.value === 'number' && !isNaN(item.value) && item.value > 0;
      if (!isValid) {
        console.warn('Invalid data item:', item);
      }
      return isValid;
    });

  // Calculate total for normalization
  const totalAmount = filteredData.reduce((sum, item) => sum + item.value, 0);

  // Add percentage to each data item
  const normalizedData = filteredData.map(item => ({
    ...item,
    percentage: totalAmount > 0 ? ((item.value / totalAmount) * 100).toFixed(0) : 0,
  }));

  if (!normalizedData || normalizedData.length === 0) {
    return (
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>Expense Analysis</ChartTitle>
          <ChartTypeSelector>
            <ChartTypeButton
              $active={chartType === 'bar'}
              onClick={() => setChartType('bar')}
            >
              Bar
            </ChartTypeButton>
            <ChartTypeButton
              $active={chartType === 'pie'}
              onClick={() => setChartType('pie')}
            >
              Pie
            </ChartTypeButton>
          </ChartTypeSelector>
        </ChartHeader>
        <EmptyState>
          <p>No data available for the selected filters.</p>
        </EmptyState>
      </ChartContainer>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem',
        }}>
          <p style={{ margin: 0 }}>{`${payload[0].name}: ${formatCurrency(payload[0].value)} (${payload[0].payload.percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul style={{
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: window.innerWidth <= 768 ? '5px' : '10px',
        marginTop: window.innerWidth <= 768 ? '10px' : '20px',
        maxHeight: '150px', // Limit legend height
        overflowY: 'auto', // Add scroll if legend overflows
      }}>
        {payload.map((entry, index) => (
          <LegendItem
            key={`item-${index}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(-1)}
            onClick={() => alert(`Category: ${entry.value}\nAmount: ${formatCurrency(entry.payload.value)}\nPercentage: ${entry.payload.percentage}%`)}
          >
            <LegendColor color={entry.color} />
            <span>{`${entry.value} (${entry.payload.percentage}% - ${formatCurrency(entry.payload.value)})`}</span>
          </LegendItem>
        ))}
      </ul>
    );
  };

  const onPieClick = (data, index) => {
    alert(`Category: ${data.name}\nAmount: ${formatCurrency(data.value)}\nPercentage: ${data.percentage}%`);
  };

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Expense Analysis</ChartTitle>
        <ChartTypeSelector>
          <ChartTypeButton
            $active={chartType === 'bar'}
            onClick={() => setChartType('bar')}
          >
            Bar
          </ChartTypeButton>
          <ChartTypeButton
            $active={chartType === 'pie'}
            onClick={() => setChartType('pie')}
          >
            Pie
          </ChartTypeButton>
        </ChartTypeSelector>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={400}> {/* Increased height for better visibility */}
        {chartType === 'bar' ? (
          <BarChart
            data={normalizedData}
            margin={{
              top: 20,
              right: window.innerWidth <= 768 ? 10 : 30,
              left: window.innerWidth <= 768 ? 0 : 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: window.innerWidth <= 768 ? 12 : 14 }}
              angle={window.innerWidth <= 480 ? -45 : 0}
              textAnchor={window.innerWidth <= 480 ? 'end' : 'middle'}
              interval={window.innerWidth <= 480 ? 'preserveStartEnd' : 0}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: window.innerWidth <= 768 ? 12 : 14 }}
              width={window.innerWidth <= 768 ? 40 : 60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" name="Amount" fill="#8884d8" />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              outerRadius={window.innerWidth <= 768 ? 100 : 120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              activeIndex={activeIndex}
              activeShape={(props) => {
                const { cx, cy, outerRadius, startAngle, endAngle, fill } = props;
                return (
                  <g>
                    <path
                      d={`M${cx},${cy}L${cx + outerRadius * Math.cos(-startAngle * (Math.PI / 180))},${cy + outerRadius * Math.sin(-startAngle * (Math.PI / 180))}A${outerRadius},${outerRadius},0,${endAngle - startAngle > 180 ? 1 : 0},0,${cx + outerRadius * Math.cos(-endAngle * (Math.PI / 180))},${cy + outerRadius * Math.sin(-endAngle * (Math.PI / 180))}Z`}
                      fill={fill}
                      stroke="none"
                      opacity={0.8}
                    />
                    <path
                      d={`M${cx},${cy}L${cx + (outerRadius + 10) * Math.cos(-startAngle * (Math.PI / 180))},${cy + (outerRadius + 10) * Math.sin(-startAngle * (Math.PI / 180))}A${outerRadius + 10},${outerRadius + 10},0,${endAngle - startAngle > 180 ? 1 : 0},0,${cx + (outerRadius + 10) * Math.cos(-endAngle * (Math.PI / 180))},${cy + outerRadius * Math.sin(-endAngle * (Math.PI / 180))}Z`}
                      fill={fill}
                      stroke="none"
                      opacity={0.4}
                    />
                  </g>
                );
              }}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              onClick={onPieClick}
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ExpenseChart;