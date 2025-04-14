import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { FinanceCoordinator } from './context/FinanceCoordinator';
import GlobalStyles from './styles/GlobalStyles';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Create a combined provider to handle the Transaction-Budget dependency
const FinanceProviders = ({ children }) => (
  <BudgetProvider>
    <FinanceCoordinator>

        {children}

    </FinanceCoordinator>
  </BudgetProvider>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <GlobalStyles />
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes with Finance Providers */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <FinanceProviders>
                  <DashboardPage />
                </FinanceProviders>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <FinanceProviders>
                  <TransactionsPage />
                </FinanceProviders>
              </ProtectedRoute>
            } />
            <Route path="/budgets" element={
              <ProtectedRoute>
                <FinanceProviders>
                  <BudgetsPage />
                </FinanceProviders>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <FinanceProviders>
                  <ReportsPage />
                </FinanceProviders>
              </ProtectedRoute>
            } />
            
            {/* Protected Routes without Finance Providers */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;