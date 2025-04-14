import React from 'react';
import { styled } from 'styled-components';
import { slideDown } from '../../styles/animations';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
`;

const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme, $error }) => $error ? theme.error : theme.border};
  border-radius: 0.375rem;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $error }) => $error ? theme.error : theme.primary};
    box-shadow: 0 0 0 2px ${({ theme, $error }) => $error ? theme.error + '30' : theme.primary + '30'};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 0.75rem;
  margin-top: 0.5rem;
  animation: ${slideDown} 0.2s ease-in-out;
`;

const Input = ({ label, error, ...props }) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput $error={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input;
