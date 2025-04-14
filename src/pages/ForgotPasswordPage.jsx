import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { authService } from '../services/auth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { fadeIn } from '../styles/animations';

const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  max-width: 450px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-in-out;
  min-height: calc(100vh - 70px);
`;

const ForgotPasswordForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textSecondary};
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
`;

const ErrorMessage = styled(motion.div)`
  background-color: ${({ theme }) => theme.error}20;
  color: ${({ theme }) => theme.error};
  padding: 0.75rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled(motion.div)`
  background-color: ${({ theme }) => theme.success}20;
  color: ${({ theme }) => theme.success};
  padding: 0.75rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const LoginPrompt = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await authService.forgotPassword(email);
      setSuccess('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ForgotPasswordContainer>
      <ForgotPasswordForm onSubmit={handleSubmit}>
        <Header>
          <Title>Forgot Password</Title>
          <Subtitle>Enter your email to receive password reset instructions</Subtitle>
        </Header>
        
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiAlertCircle />
            {error}
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiCheckCircle />
            {success}
          </SuccessMessage>
        )}
        
        <InputWrapper>
          <IconWrapper>
            <FiMail />
          </IconWrapper>
          <StyledInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
        
        <LoginPrompt>
          Remember your password? <Link to="/login">Sign in</Link>
        </LoginPrompt>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
