import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEdit } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatters';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const TransactionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TransactionDescription = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const TransactionCategory = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const TransactionDate = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const TransactionAmount = styled.div`
  font-weight: 600;
  color: ${({ type, theme }) => (type === 'income' ? theme.success : theme.error)};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme, $danger }) => ($danger ? theme.error : theme.textSecondary)};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme, $danger }) => ($danger ? '#d32f2f' : theme.text)};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
`;

const TransactionList = ({ transactions = [], onEditTransaction, hideActions = false }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const formatDate = (dateInput) => {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const confirmDelete = async () => {
    try {
      await onEditTransaction?.({ _id: transactionToDelete, action: 'delete' });
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  console.log('Transactions in TransactionList:', transactions);

  if (transactions.length === 0) {
    return (
      <EmptyState>
        <p>No transactions found. Add a transaction to get started!</p>
      </EmptyState>
    );
  }

  // Sort transactions by date in descending order (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <>
      <TransactionListContainer>
        {sortedTransactions.map((transaction) => {
          const categoryList =
            transaction.type === 'income' ? TRANSACTION_CATEGORIES.INCOME : TRANSACTION_CATEGORIES.EXPENSE;
          const categoryName =
            categoryList.find((c) => c.id === transaction.category)?.name || transaction.category;
          return (
            <TransactionItem key={transaction._id}>
              <TransactionDetails>
                <TransactionDescription>{transaction.description}</TransactionDescription>
                <TransactionCategory>{categoryName}</TransactionCategory>
                <TransactionDate>{formatDate(transaction.date)}</TransactionDate>
              </TransactionDetails>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <TransactionAmount type={transaction.type}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount || 0)}
                </TransactionAmount>
                {!hideActions && (
                  <ActionButtons>
                    <ActionButton onClick={() => onEditTransaction(transaction)}>
                      <FiEdit size={20} />
                    </ActionButton>
                  </ActionButtons>
                )}
              </div>
            </TransactionItem>
          );
        })}
      </TransactionListContainer>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default TransactionList;