// src/components/budgets/BudgetList.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTrash2 } from 'react-icons/fi';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled(motion.li)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child {
    border-bottom: none;
  }
`;

const BudgetInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BudgetDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const BudgetName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const BudgetAmount = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.border};
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background-color: ${({ status }) =>
    status === 'exceeded' ? '#F44336' : status === 'warning' ? '#FFA500' : '#4CAF50'};
  transition: width 0.3s ease;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.danger};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const BudgetList = ({ budgets, deleteBudget }) => {
  return (
    <List>
      {budgets.length === 0 ? (
        <p>No budgets added yet.</p>
      ) : (
        budgets.map((budget) => (
          <ListItem
            key={budget._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BudgetInfo>
              <BudgetDetails>
                <BudgetName>{budget.category}</BudgetName>
                <BudgetAmount>
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)} (
                  {budget.percentage.toFixed(1)}%)
                </BudgetAmount>
              </BudgetDetails>
              <DeleteButton onClick={() => deleteBudget(budget._id)}>
                <FiTrash2 />
              </DeleteButton>
            </BudgetInfo>
            <ProgressBar>
              <Progress percentage={budget.percentage} status={budget.alertStatus} />
            </ProgressBar>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default BudgetList;