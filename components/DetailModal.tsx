import React from 'react';
import { Modal } from './ui/Modal';
import { DetailPanel } from './DetailPanel';
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

const DetailModalComponent: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  item,
  ...props
}) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" panelClassName="!max-w-4xl w-full !bg-transparent !border-0 !p-0">
        <div className="max-h-[85vh]">
            <DetailPanel item={item} {...props} />
        </div>
    </Modal>
  );
};

export const DetailModal = React.memo(DetailModalComponent);
