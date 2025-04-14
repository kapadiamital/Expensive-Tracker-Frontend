import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.$fullPage ? '100vh' : '100%'};
  width: 100%;
`;

const LoaderSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.border || '#f3f3f3'};
  border-top: 4px solid ${({ theme }) => theme.primary || '#3498db'};
  border-radius: 50%;
  width: ${props => props.$size || '40px'};
  height: ${props => props.$size || '40px'};
  animation: ${spin} 1s linear infinite;
`;

const Loader = ({ fullPage = false, size = '40px' }) => {
  return (
    <LoaderContainer $fullPage={fullPage}>
      <LoaderSpinner $size={size} />
    </LoaderContainer>
  );
};

export default Loader;
