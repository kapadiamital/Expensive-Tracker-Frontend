import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const ModalContent = styled.div`
  max-height: 70vh; /* Try a smaller value */
  overflow-y: auto;
  padding: 1rem;
  -webkit-overflow-scrolling: touch; /* For better mobile scrolling */
`;



const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef();
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.9 }}
  transition={{ duration: 0.2 }}
  className={`${sizeClasses[size]} w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col`}
  ref={modalRef}
>
  <div className="flex justify-between items-center p-4 border-b">
    <h3 className="text-lg font-semibold">{title}</h3>
    <button 
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close modal"
    >
      <FaTimes />
    </button>
  </div>
  <ModalContent>
    {children}
  </ModalContent>
</motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
