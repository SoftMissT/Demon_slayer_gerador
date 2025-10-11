import React from 'react';
import { Modal } from './ui/Modal';
import { AboutPanel } from './AboutPanel';

// FIX: Implemented AboutModal component to resolve placeholder errors.
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sobre a Forja de Lendas">
        <div className="max-h-[70vh] overflow-y-auto pr-4">
             <AboutPanel />
        </div>
    </Modal>
  );
};
