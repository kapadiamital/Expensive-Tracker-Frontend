import React from 'react';
import styled, { css } from 'styled-components';
import { pulse } from '../../styles/animations';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  gap: 0.5rem;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.primary};
          color: white;
          &:hover {
            background-color: ${theme.primary}dd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'secondary':
        return css`
          background-color: transparent;
          color: ${theme.primary};
          border: 1px solid ${theme.primary};
          &:hover {
            background-color: ${theme.primary}10;
            transform: translateY(-2px);
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.primary};
          padding: 0.5rem 1rem;
          &:hover {
            background-color: ${theme.primary}10;
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.error};
          color: white;
          &:hover {
            background-color: ${theme.error}dd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'success':
        return css`
          background-color: ${theme.success};
          color: white;
          &:hover {
            background-color: ${theme.success}dd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `;
      default:
        return css`
          background-color: ${theme.primary};
          color: white;
          &:hover {
            background-color: ${theme.primary}dd;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `;
    }
  }}
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
  
  ${({ $animated }) =>
    $animated &&
    css`
      &:hover {
        animation: ${pulse} 0.5s ease-in-out;
      }
    `}
    
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

const Button = ({ variant, size, fullWidth, animated, children, ...props }) => {
  return (
    <StyledButton 
      $variant={variant} 
      $size={size} 
      $fullWidth={fullWidth} 
      $animated={animated} 
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
