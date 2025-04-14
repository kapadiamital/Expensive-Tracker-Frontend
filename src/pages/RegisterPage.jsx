// src/pages/RegisterPage.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const RegisterContainer = styled.div`
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

const RegisterFormWrapper = styled(motion.div)`
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

const PasswordRequirements = styled.ul`
  font-size: 0.75rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
`;

const LoginPrompt = styled.div`
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading, error, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', {
        state: { message: 'Registration successful! Please check your email to verify your account.' },
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <RegisterContainer>
      <BackgroundOverlay />
      <RegisterFormWrapper
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
            Create Account
          </Title>
          <Subtitle
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Start managing your finances today
          </Subtitle>
        </FormHeader>

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
              <FiUser />
            </IconWrapper>
            <StyledInput
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
          </InputWrapper>

          <InputWrapper
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <IconWrapper>
              <FiMail />
            </IconWrapper>
            <StyledInput
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
          </InputWrapper>

          <InputWrapper
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <IconWrapper>
              <FiLock />
            </IconWrapper>
            <StyledInput
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </InputWrapper>

          <PasswordRequirements>
            <li>At least 8 characters long</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one lowercase letter</li>
            <li>Contains at least one number</li>
          </PasswordRequirements>

          <InputWrapper
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <IconWrapper>
              <FiLock />
            </IconWrapper>
            <StyledInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </InputWrapper>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <LoginPrompt>
            Already have an account? <Link to="/login">Sign in</Link>
          </LoginPrompt>
        </form>
      </RegisterFormWrapper>
    </RegisterContainer>
  );
};

export default RegisterPage;