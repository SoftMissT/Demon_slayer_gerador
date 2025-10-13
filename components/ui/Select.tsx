
import React, { useState, useRef, useEffect, Children, isValidElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

// FIX: Redefined SelectProps to correctly type this custom component. It now extends
// button attributes (since it renders a button) and omits conflicting properties
// like `onChange` and `value`, which are handled specially. This resolves
// event handler type mismatch errors.
interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'children'> {
  label: string;
  value: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  tooltip?: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, value, onChange, tooltip, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'down' | 'up'>('down');
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOpen = () => {
    if (!isOpen) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 250; // Altura estimada do dropdown (max-h-60 é 240px)
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
          setPosition('up');
        } else {
          setPosition('down');
        }
      }
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    if (onChange) {
      // Simula o objeto de evento de uma mudança de select real
      const event = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    setIsOpen(false);
  };

  const options = Children.toArray(children).filter(isValidElement).map(child => ({
      // FIX: Cast child.props to 'any' to safely access 'value' and 'children'.
      // The type was being inferred as 'unknown', causing a type error.
      value: (child.props as any).value as string,
      label: (child.props as any).children as React.ReactNode,
  }));

  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption?.label || 'Selecione...';
  const isPlaceholder = !selectedOption || !value;

  const dropdownClasses = `absolute z-20 w-full bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto ${
    position === 'up' ? 'bottom-full mb-1' : 'mt-1'
  }`;

  return (
    <div ref={ref} className="relative">
      {label && (
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-medium text-gray-400">{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className="select-button w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props} // Passa disabled, etc.
      >
        <span className={`truncate ${isPlaceholder ? 'text-gray-400' : 'text-white'}`}>{selectedLabel}</span>
        <svg className={`w-4 h-4 ml-2 transform transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, y: position === 'up' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'up' ? 5 : -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={dropdownClasses}
            style={{ originY: position === 'up' ? '100%' : '0%' }}
        >
          <ul>
            {options.map(option => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 ${String(value) === option.value ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};
