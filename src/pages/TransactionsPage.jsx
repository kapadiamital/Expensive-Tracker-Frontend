import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi'; // Added FiX for the clear button
import { useTransactions } from '../context/TransactionContext';
import TransactionList from '../components/transactions/TransactionList';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import EditTransactionModal from '../components/transactions/EditTransactionModal';

const PageContainer = styled.div`
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
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.5rem;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  margin-left: 0.5rem;
  color: #888;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const AddButton = styled(motion.button)`
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
  transition: background-color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const TransactionContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const TransactionsPage = () => {
  const { transactions, updateFilters } = useTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateFilters({ searchQuery: query });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    updateFilters({ searchQuery: '' });
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  return (
    <PageContainer>
      <Header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Transactions</Title>
        <ActionButtons>
          <AddButton 
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus />
            Add Transaction
          </AddButton>
        </ActionButtons>
      </Header>
      
      <SearchContainer
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SearchInputWrapper>
          <FiSearch size={20} style={{ marginRight: '0.5rem', color: '#888' }} />
          <SearchInput 
            type="text" 
            placeholder="Search transactions..." 
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <ClearButton onClick={handleClearSearch} title="Clear search">
              <FiX size={20} />
            </ClearButton>
          )}
        </SearchInputWrapper>
      </SearchContainer>
      
      <TransactionContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TransactionList 
          transactions={transactions} 
          onEditTransaction={handleEditTransaction}
        />
      </TransactionContainer>
      
      <AnimatePresence>
        {showAddModal && (
          <AddTransactionModal 
            isOpen={showAddModal} 
            onClose={() => setShowAddModal(false)} 
          />
        )}
        {showEditModal && (
          <EditTransactionModal 
            isOpen={showEditModal} 
            onClose={() => {
              setShowEditModal(false);
              setSelectedTransaction(null);
            }}
            transaction={selectedTransaction}
          />
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default TransactionsPage;