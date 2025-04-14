// src/components/common/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiMenu, FiX, FiMoon, FiSun, 
  FiHome, FiPieChart, FiDollarSign, 
  FiBarChart2 
} from 'react-icons/fi';
import { FaSignOutAlt } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${({ $active }) => $active ? '100%' : '0'};
    height: 2px;
    background-color: ${({ theme }) => theme.primary};
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    
    &:after {
      width: 100%;
    }
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  align-self: flex-end;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.surface};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.primary};
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    background-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
  &:hover > div {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.background};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease;
  margin-top: 0.5rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 999;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('Navbar rendered, isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);
  
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <Nav>
      <Logo to="/">
        <FiDollarSign />
        ExpenseTracker
      </Logo>
      
      {isAuthenticated && (
        <NavLinks>
          <NavLink to="/dashboard" $active={isActive('/dashboard')}>
            <FiHome />
            Dashboard
          </NavLink>
          <NavLink to="/transactions" $active={isActive('/transactions')}>
            <FiDollarSign />
            Transactions
          </NavLink>
          <NavLink to="/budgets" $active={isActive('/budgets')}>
            <FiPieChart />
            Budgets
          </NavLink>
          <NavLink to="/reports" $active={isActive('/reports')}>
            <FiBarChart2 />
            Reports
          </NavLink>
        </NavLinks>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </ThemeToggle>
        
        {isAuthenticated ? (
          <UserSection>
            <UserName>{user?.name || 'User'}</UserName>
            <TooltipWrapper>
              <LogoutButton 
                onClick={handleLogoutClick} 
                aria-label="Logout"
                tabIndex={0}
              >
                <FaSignOutAlt />
              </LogoutButton>
              <Tooltip>Logout</Tooltip>
            </TooltipWrapper>
          </UserSection>
        ) : (
          <>
            <Button 
              variant="text" 
              size="small" 
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              size="small" 
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </>
        )}
        
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
          <FiMenu />
        </MobileMenuButton>
      </div>
      
      <Overlay $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
          <FiX />
        </CloseButton>
        
        <MobileNavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <FiHome />
                Dashboard
              </NavLink>
              <NavLink to="/transactions" onClick={() => setIsMobileMenuOpen(false)}>
                <FiDollarSign />
                Transactions
              </NavLink>
              <NavLink to="/budgets" onClick={() => setIsMobileMenuOpen(false)}>
                <FiPieChart />
                Budgets
              </NavLink>
              <NavLink to="/reports" onClick={() => setIsMobileMenuOpen(false)}>
                <FiBarChart2 />
                Reports
              </NavLink>
              <Button variant="secondary" onClick={handleLogoutClick}>
                <FaSignOutAlt />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <FiHome />
                Home
              </NavLink>
              <Button 
                variant="secondary" 
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  navigate('/register');
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </MobileNavLinks>
      </MobileMenu>

      <AnimatePresence>
        {isLogoutModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ModalContent
              initial={{ scale: 0.7, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -50 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.3 
              }}
            >
              <ModalTitle>Will see you soon! 👋</ModalTitle>
              <p>Are you sure you want to clock out?</p>
              <ModalButtons>
                <Button 
                  variant="secondary"
                  onClick={handleLogoutCancel}
                >
                  Stay
                </Button>
                <Button 
                  variant="primary"
                  onClick={handleLogoutConfirm}
                >
                  Clock Out
                </Button>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;