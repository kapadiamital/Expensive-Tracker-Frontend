    // src/context/FinanceCoordinator.js
    import React from 'react';
    import { TransactionProvider } from './TransactionContext';

    export const FinanceCoordinator = ({ children }) => {
    return <TransactionProvider>{children}</TransactionProvider>;
    };