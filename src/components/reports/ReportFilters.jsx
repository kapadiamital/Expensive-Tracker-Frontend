// src/components/reports/ReportFilters.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiFilter, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { DATE_RANGES } from '../../utils/constants';
import { getMonthsArray, getYearsArray, getCurrentMonth, getCurrentYear } from '../../utils/dateUtils';

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: ${({ theme }) => theme.background};
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}30;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CustomDateContainer = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ReportFilters = ({ filters, onFilterChange }) => {
  const [showCustomDate, setShowCustomDate] = useState(filters.dateRange === 'custom');
  
  const months = getMonthsArray();
  const years = getYearsArray();
  
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setShowCustomDate(value === 'custom');
    onFilterChange('dateRange', value);
  };
  
  return (
    <FiltersContainer>
      <FilterGroup>
        <FilterLabel>
          <FiCalendar />
          Date Range
        </FilterLabel>
        <Select 
          value={filters.dateRange} 
          onChange={handleDateRangeChange}
        >
          {DATE_RANGES.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
          <option value="custom">Custom Range</option>
        </Select>
        
        <CustomDateContainer show={showCustomDate}>
          <DateRangeContainer>
            <Select 
              value={filters.startMonth || getCurrentMonth()} 
              onChange={(e) => onFilterChange('startMonth', parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
            
            <Select 
              value={filters.startYear || getCurrentYear()} 
              onChange={(e) => onFilterChange('startYear', parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </Select>
          </DateRangeContainer>
          
          <FilterLabel>to</FilterLabel>
          
          <DateRangeContainer>
            <Select 
              value={filters.endMonth || getCurrentMonth()} 
              onChange={(e) => onFilterChange('endMonth', parseInt(e.target.value))}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
            
            <Select 
              value={filters.endYear || getCurrentYear()} 
              onChange={(e) => onFilterChange('endYear', parseInt(e.target.value))}
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </Select>
          </DateRangeContainer>
        </CustomDateContainer>
      </FilterGroup>
      
      <FilterGroup>
        <FilterLabel>
          <FiFilter />
          Group By
        </FilterLabel>
        <Select 
          value={filters.groupBy} 
          onChange={(e) => onFilterChange('groupBy', e.target.value)}
        >
          <option value="category">Category</option>
          <option value="month">Month</option>
          <option value="day">Day</option>
        </Select>
      </FilterGroup>
      
      <FilterGroup>
        <FilterLabel>
          <FiChevronDown />
          Transaction Type
        </FilterLabel>
        <Select 
          value={filters.type} 
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="expense">Expenses Only</option>
          <option value="income">Income Only</option>
        </Select>
      </FilterGroup>
    </FiltersContainer>
  );
};

export default ReportFilters;
