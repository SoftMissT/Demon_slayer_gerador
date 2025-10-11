import React from 'react';
import { Modal } from './ui/Modal';
// FIX: Corrected import path for DetailPanel component.
import { DetailPanel } from '../DetailPanel';
// FIX: Corrected import path for types.
import type { GeneratedItem } from '../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GeneratedItem | null;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  item,
  ...props
}) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
        <div className="max-h-[80vh] -m-6">
            <DetailPanel item={item} {...props} />
        </div>
    </Modal>
  );
};