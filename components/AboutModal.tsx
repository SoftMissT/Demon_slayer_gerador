import React from 'react';
import { Modal } from './ui/Modal';
import { AboutPanel } from './AboutPanel';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      // Use panelClassName to apply custom styles and remove default padding/border
      panelClassName="!bg-transparent !border-0 !p-0 !max-w-3xl"
    >
        {/* Pass the onClose handler down to the panel */}
        <AboutPanel onClose={onClose} />
    </Modal>
  );
};
