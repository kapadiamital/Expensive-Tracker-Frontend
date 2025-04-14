import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiBarChart2, FiDollarSign, FiPieChart, FiTarget } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import { fadeIn } from '../styles/animations';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 800px;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.background};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
`;

const CTASection = styled(motion.div)`
  background-color: ${({ theme }) => theme.primary}10;
  border-radius: 0.75rem;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const CTADescription = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.textSecondary};
  max-width: 800px;
  margin-bottom: 2rem;
`;

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
    <HomeContainer>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Take Control of Your Finances
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Track expenses, set budgets, and achieve your financial goals with our easy-to-use expense tracker application.
        </Subtitle>
        <ButtonGroup
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isAuthenticated ? (
            <Button 
              variant="primary" 
              size="large" 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="primary" 
                size="large" 
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
              <Button 
                variant="secondary" 
                size="large" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </>
          )}
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FeatureIcon>
            <FiDollarSign />
          </FeatureIcon>
          <FeatureTitle>Track Expenses</FeatureTitle>
          <FeatureDescription>
            Easily log and categorize your expenses and income. Get a clear picture of where your money is going.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FeatureIcon>
            <FiPieChart />
          </FeatureIcon>
          <FeatureTitle>Budget Management</FeatureTitle>
          <FeatureDescription>
            Set monthly budgets for different categories and get alerts when you're approaching your limits.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FeatureIcon>
            <FiBarChart2 />
          </FeatureIcon>
          <FeatureTitle>Insightful Reports</FeatureTitle>
          <FeatureDescription>
            Visualize your spending patterns with interactive charts and detailed reports to make informed decisions.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FeatureIcon>
            <FiTarget />
          </FeatureIcon>
          <FeatureTitle>Financial Goals</FeatureTitle>
          <FeatureDescription>
            Set savings goals and track your progress. Stay motivated and achieve your financial objectives.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
      
      <CTASection
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CTATitle>Ready to Take Control of Your Finances?</CTATitle>
        <CTADescription>
          Join thousands of users who have improved their financial well-being with our expense tracker.
        </CTADescription>
        {isAuthenticated ? (
          <Button 
            variant="primary" 
            size="large" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Button 
            variant="primary" 
            size="large" 
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </Button>
        )}
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;
