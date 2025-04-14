import React, { useContext, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDollarSign, FiAlignLeft, FiTag, FiCalendar } from 'react-icons/fi';
import { TransactionContext } from '../../context/TransactionContext';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../../utils/constants';
import DeleteConfirmationModal from './DeleteConfirmationModal';

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

  @media (max-width: 480px) {
    max-width: 90%;
  }
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

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
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
  ${props =>
    props.hasError &&
    css`
      animation: ${shake} 0.5s ease;
    `}

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2b2d42;
  font-size: 14px;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-radius: 12px;
  background: ${({ checked }) =>
    checked ? 'linear-gradient(135deg, #4361ee, #3a0ca3)' : '#f8f9fa'};
  color: ${({ checked }) => (checked ? 'white' : '#495057')};
  cursor: pointer;
  flex: 1;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: ${({ checked }) => (checked ? '600' : '500')};
  box-shadow: ${({ checked }) =>
    checked
      ? '0 8px 15px rgba(67, 97, 238, 0.3)'
      : '0 2px 5px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${({ checked }) => (checked ? 'transparent' : '#e9ecef')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ checked }) =>
      checked
        ? '0 10px 20px rgba(67, 97, 238, 0.4)'
        : '0 5px 10px rgba(0, 0, 0, 0.1)'};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 14px;
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

  @media (max-width: 480px) {
    left: 12px;
  }
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

  ${props =>
    props.hasError &&
    css`
      border-color: #ff6b6b;
      animation: ${shake} 0.5s ease;
    `}

  @media (max-width: 480px) {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }
`;

const Select = styled(Field)`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  appearance: none;
  background: white
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")
    no-repeat;
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

  @media (max-width: 480px) {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
    background-position: right 12px center;
    background-size: 16px;
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

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const FormError = styled(ErrorText)`
  margin-bottom: 16px;

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 24px;
  }
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

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
  }
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

const DeleteButton = styled(Button)`
  background: #ff6b6b;
  color: white;
  border: none;
  flex: 1;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #adb5bd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const WarningModalContent = styled(ModalContent)`
  max-width: 400px;
`;

const WarningText = styled.p`
  color: #2b2d42;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.4;
  }

  @media (max-width: 360px) {
    font-size: 13px;
    line-height: 1.3;
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

const EditTransactionModal = ({ transaction, isOpen, onClose, onOpenAddModal }) => {
  const { updateTransaction, deleteTransaction } = useContext(TransactionContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showTypeChangeWarning, setShowTypeChangeWarning] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!transaction) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getCategoriesForType = (type) => {
    return type === TRANSACTION_TYPES.INCOME
      ? TRANSACTION_CATEGORIES.INCOME
      : TRANSACTION_CATEGORIES.EXPENSE;
  };

  const initialCategory = transaction.category || '';
  const initialType = transaction.type || TRANSACTION_TYPES.EXPENSE;
  const validCategories = getCategoriesForType(initialType).map((c) => c.id);
  const isInitialCategoryValid = validCategories.includes(initialCategory);

  const initialValues = {
    type: initialType,
    amount: (transaction.amount || 0).toString(),
    description: transaction.description || '',
    category: isInitialCategoryValid ? initialCategory : '',
    date: transaction.date ? formatDate(transaction.date) : new Date().toISOString().split('T')[0],
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const validCategories = getCategoriesForType(values.type).map((c) => c.id);
      if (!validCategories.includes(values.category)) {
        setFormError('Please select a valid category for the transaction type.');
        return;
      }

      const transactionData = {
        ...values,
        amount: parseFloat(values.amount),
        date: new Date(values.date).toISOString(),
      };

      await updateTransaction(transaction._id, transactionData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Transaction error:', error);
      setFormError('Failed to update transaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTransaction(transaction._id);
      setShowDeleteModal(false);
      onClose();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setFormError('Failed to delete transaction.');
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
              <Title>Edit Transaction</Title>
              <CloseButton onClick={onClose}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, errors, touched }) => (
                  <>
                    <Form>
                      {formError && <FormError>{formError}</FormError>}

                      <FormGroup hasError={errors.type && touched.type}>
                        <Label>Transaction Type</Label>
                        <RadioGroup>
                          <RadioLabel
                            checked={values.type === TRANSACTION_TYPES.EXPENSE}
                            onClick={() => {
                              if (initialType === TRANSACTION_TYPES.INCOME) {
                                setShowTypeChangeWarning(true);
                              }
                            }}
                          >
                            <Field
                              type="radio"
                              name="type"
                              value={TRANSACTION_TYPES.EXPENSE}
                              style={{ display: 'none' }}
                            />
                            Expense
                          </RadioLabel>
                          <RadioLabel
                            checked={values.type === TRANSACTION_TYPES.INCOME}
                            onClick={() => {
                              if (initialType === TRANSACTION_TYPES.EXPENSE) {
                                setShowTypeChangeWarning(true);
                              }
                            }}
                          >
                            <Field
                              type="radio"
                              name="type"
                              value={TRANSACTION_TYPES.INCOME}
                              style={{ display: 'none' }}
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
                            {getCategoriesForType(values.type).map((category) => (
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
                        <DeleteButton
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={isSubmitting}
                        >
                          Delete
                        </DeleteButton>
                        <CancelButton type="button" onClick={onClose}>
                          Cancel
                        </CancelButton>
                        <SubmitButton type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </SubmitButton>
                      </ButtonGroup>
                    </Form>

                    {showTypeChangeWarning && (
                      <ModalOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <WarningModalContent
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ModalHeader>
                            <Title>Warning</Title>
                          </ModalHeader>
                          <ModalBody>
                            <WarningText>
                              Changing the transaction type may affect your financial reports. Instead, create a new transaction.
                            </WarningText>
                            <ButtonGroup>
                              <CancelButton
                                type="button"
                                onClick={() => setShowTypeChangeWarning(false)}
                              >
                                Cancel
                              </CancelButton>
                              <SubmitButton
                                type="button"
                                onClick={() => {
                                  setShowTypeChangeWarning(false);
                                  onClose();
                                  onOpenAddModal();
                                }}
                              >
                                Create New Transaction
                              </SubmitButton>
                            </ButtonGroup>
                          </ModalBody>
                        </WarningModalContent>
                      </ModalOverlay>
                    )}
                  </>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </AnimatePresence>
  );
};

export default EditTransactionModal;