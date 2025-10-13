import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  startOpen?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="border border-gray-700/50 rounded-lg bg-gray-800/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-white">{title}</h3>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
