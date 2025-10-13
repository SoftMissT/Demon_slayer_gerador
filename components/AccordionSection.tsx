import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-left text-white"
      >
        <h3 className="font-semibold">{title}</h3>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};
