import React, { useState, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDollarSign, FiAlignLeft, FiTag, FiCalendar } from 'react-icons/fi';
import { TransactionContext } from '../../context/TransactionContext';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';

// Animations
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(67, 97, 238, 0); }
  100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

// Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 20px 20px 0 0;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg) scale(1.1);
  }

  &:active {
    transform: rotate(90deg) scale(0.95);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
  ${props => props.hasError && css`
    animation: ${shake} 0.5s ease;
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2b2d42;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-radius: 12px;
  background: ${({ checked }) => (checked ? 'linear-gradient(135deg, #4361ee, #3a0ca3)' : '#f8f9fa')};
  color: ${({ checked }) => (checked ? 'white' : '#495057')};
  cursor: pointer;
  flex: 1;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: ${({ checked }) => (checked ? '600' : '500')};
  box-shadow: ${({ checked }) => (checked ? '0 8px 15px rgba(67, 97, 238, 0.3)' : '0 2px 5px rgba(0, 0, 0, 0.05)')};
  border: 1px solid ${({ checked }) => (checked ? 'transparent' : '#e9ecef')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ checked }) => (checked ? '0 10px 20px rgba(67, 97, 238, 0.4)' : '0 5px 10px rgba(0, 0, 0, 0.1)')};
  }

  &:active {
    transform: translateY(0);
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #adb5bd;
  z-index: 1;
  transition: all 0.3s ease;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
    
    ~ ${IconWrapper} {
      color: #4361ee;
      transform: translateY(-50%) scale(1.1);
    }
  }

  ${props => props.hasError && css`
    border-color: #ff6b6b;
    animation: ${shake} 0.5s ease;
  `}
`;

const Select = styled(Field)`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  appearance: none;
  background: white url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4361ee;
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
    
    ~ ${IconWrapper} {
      color: #4361ee;
      transform: translateY(-50%) scale(1.1);
    }
  }

  &:hover {
    background-color: #f8f9fa;
  }
`;

const ErrorText = styled.div`
  margin-top: 8px;
  color: #ff6b6b;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;
  flex: 1;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: white;
  border: none;
  flex: 2;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(67, 97, 238, 0.4);
    animation: ${pulse} 1.5s infinite;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    animation: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(30deg);
    transition: all 0.5s ease;
  }

  &:hover::after {
    left: 100%;
  }
`;

const validationSchema = Yup.object({
  type: Yup.string().required('Please select transaction type'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Please enter a valid number'),
  description: Yup.string()
    .required('Description is required')
    .max(100, 'Description too long'),
  category: Yup.string().required('Please select a category'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
});

const AddTransactionModal = ({ isOpen, onClose }) => {
  const { addTransaction } = useContext(TransactionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const transactionData = {
        ...values,
        amount: parseFloat(values.amount),
        date: values.date ? new Date(values.date).toISOString() : null,
      };
      
      await addTransaction(transactionData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <Title>Add New Transaction</Title>
              <CloseButton onClick={onClose}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Formik
                initialValues={{
                  type: 'expense',
                  amount: '',
                  description: '',
                  category: '',
                  date: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <Form>
                    <FormGroup hasError={errors.type && touched.type}>
                      <Label>Transaction Type</Label>
                      <RadioGroup>
                        <RadioLabel checked={values.type === 'expense'}>
                          <Field
                            type="radio"
                            name="type"
                            value="expense"
                            style={{ display: 'none' }}
                            onChange={() => {
                              setFieldValue('type', 'expense');
                              setFieldValue('category', '');
                            }}
                          />
                          Expense
                        </RadioLabel>
                        <RadioLabel checked={values.type === 'income'}>
                          <Field
                            type="radio"
                            name="type"
                            value="income"
                            style={{ display: 'none' }}
                            onChange={() => {
                              setFieldValue('type', 'income');
                              setFieldValue('category', '');
                            }}
                          />
                          Income
                        </RadioLabel>
                      </RadioGroup>
                      <ErrorMessage name="type" component={ErrorText} />
                    </FormGroup>

                    <FormGroup hasError={errors.amount && touched.amount}>
                      <Label>Amount</Label>
                      <InputWrapper>
                        <IconWrapper>
                          <FiDollarSign size={18} />
                        </IconWrapper>
                        <Input
                          name="amount"
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          hasError={errors.amount && touched.amount}
                        />
                      </InputWrapper>
                      <ErrorMessage name="amount" component={ErrorText} />
                    </FormGroup>

                    <FormGroup hasError={errors.description && touched.description}>
                      <Label>Description</Label>
                      <InputWrapper>
                        <IconWrapper>
                          <FiAlignLeft size={18} />
                        </IconWrapper>
                        <Input
                          name="description"
                          type="text"
                          placeholder="Enter description"
                          hasError={errors.description && touched.description}
                        />
                      </InputWrapper>
                      <ErrorMessage name="description" component={ErrorText} />
                    </FormGroup>

                    <FormGroup hasError={errors.category && touched.category}>
                      <Label>Category</Label>
                      <InputWrapper>
                        <IconWrapper>
                          <FiTag size={18} />
                        </IconWrapper>
                        <Select
                          name="category"
                          as="select"
                          onChange={(e) => setFieldValue('category', e.target.value)}
                        >
                          <option value="">Select a category</option>
                          {(values.type === 'expense'
                            ? TRANSACTION_CATEGORIES.EXPENSE
                            : TRANSACTION_CATEGORIES.INCOME
                          ).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Select>
                      </InputWrapper>
                      <ErrorMessage name="category" component={ErrorText} />
                    </FormGroup>

                    <FormGroup hasError={errors.date && touched.date}>
                      <Label>Date</Label>
                      <InputWrapper>
                        <IconWrapper>
                          <FiCalendar size={18} />
                        </IconWrapper>
                        <Input
                          name="date"
                          type="date"
                          hasError={errors.date && touched.date}
                        />
                      </InputWrapper>
                      <ErrorMessage name="date" component={ErrorText} />
                    </FormGroup>

                    <ButtonGroup>
                      <CancelButton type="button" onClick={onClose}>
                        Cancel
                      </CancelButton>
                      <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Processing...' : 'Add Transaction'}
                      </SubmitButton>
                    </ButtonGroup>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;