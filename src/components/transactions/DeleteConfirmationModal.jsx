import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 480px) {
    max-width: 90%;
  }
`;

const ModalHeader = styled.div`
  padding: 24px;
  background: linear-gradient(90deg, #4361ee, #3a0ca3);
  color: white;
  border-radius: 20px 20px 0 0;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const ModalBody = styled.div`
  padding: 24px;

  @media (max-width: 480px) {
    padding: 16px;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 16px;
  }
`;

const Button = styled.button`
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex: 1;

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
  }

  @media (max-width: 360px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const CancelButton = styled(Button)`
  background: #f8f9fa;
  color: #495057;
  border: 2px solid #e9ecef;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }
`;

const ConfirmButton = styled(Button)`
  background: #ff6b6b;
  color: white;
  border: none;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`;

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
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
              <Title>Confirm Deletion</Title>
            </ModalHeader>
            <ModalBody>
              <WarningText>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </WarningText>
              <ButtonGroup>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
                <ConfirmButton onClick={onConfirm}>Delete</ConfirmButton>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;