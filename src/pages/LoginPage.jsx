// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/money.png') repeat;
  opacity: 0.1;
  z-index: 1;
`;

const LoginFormWrapper = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  z-index: 2;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  color: #1e3c72;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: #666;
`;

const InputWrapper = styled(motion.div)`
  position: relative;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #999;
`;

const StyledInput = styled(Input)`
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #1e3c72;
    box-shadow: 0 0 0 3px rgba(30, 60, 114, 0.1);
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 99, 132, 0.1);
  color: #ff6384;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  padding: 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ForgotPassword = styled(Link)`
  align-self: flex-end;
  font-size: 0.875rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #2a5298;
  }
`;

const SignupPrompt = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;

  a {
    color: #1e3c72;
    font-weight: 600;
    transition: color 0.3s ease;

    &:hover {
      color: #2a5298;
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, loading, error, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
    }
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <LoginContainer>
      <BackgroundOverlay />
      <LoginFormWrapper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <FormHeader>
          <Title
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Sign In
          </Title>
          <Subtitle
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Access your financial dashboard
          </Subtitle>
        </FormHeader>

        {successMessage && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {successMessage}
          </SuccessMessage>
        )}

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <InputWrapper
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <IconWrapper>
              <FiMail />
            </IconWrapper>
            <StyledInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </InputWrapper>

          <InputWrapper
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <IconWrapper>
              <FiLock />
            </IconWrapper>
            <StyledInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
          </InputWrapper>

          <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <SignupPrompt>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </SignupPrompt>
        </form>
      </LoginFormWrapper>
    </LoginContainer>
  );
};

export default LoginPage;