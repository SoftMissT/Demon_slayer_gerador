import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};

interface SelectProps {
  label: string;
  tooltip?: string;
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // FIX: Added disabled prop to allow the select to be disabled.
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, tooltip, options, value, onChange, placeholder = 'Selecione uma opção...', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const handleToggle = () => {
    // FIX: Prevent opening the dropdown if the component is disabled.
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const normalizedOptions = useMemo(() => options.map(opt => typeof opt === 'string' ? { value: opt, label: opt } : opt), [options]);
  const selectedOption = useMemo(() => normalizedOptions.find(opt => opt.value === value), [normalizedOptions, value]);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center text-left select-button min-h-[42px] disabled:bg-gray-800 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <span className={`truncate ${!disabled && value ? 'text-white' : 'text-gray-400'}`}>{selectedOption?.label || placeholder}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {!disabled && isOpen && createPortal(
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[100] custom-dropdown border border-gray-600 rounded-md shadow-lg"
          >
            <ul className="max-h-60 overflow-auto inner-scroll custom-dropdown">
              {normalizedOptions.map(option => (
                <li
                  key={option.value}
                  onClick={() => { if (!option.disabled) { onChange(option.value); setIsOpen(false); } }}
                  className={`dropdown-option ${option.value === value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </motion.div>,
          document.body
        )}
    </div>
  );
};
