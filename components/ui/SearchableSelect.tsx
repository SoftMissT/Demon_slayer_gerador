import React, { useState, useRef, useEffect, Children, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

interface SearchableSelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'children'> {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  placeholder?: string;
  tooltip?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, children, value, onChange, placeholder = "Selecione...", tooltip, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [style, setStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = () => {
    if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 240; // max-h-60

        const newStyle: React.CSSProperties = {
            position: 'fixed',
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            zIndex: 50,
        };

        if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
            newStyle.bottom = `${window.innerHeight - rect.top}px`;
        } else {
            newStyle.top = `${rect.bottom}px`;
        }
        setStyle(newStyle);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const parentScroller = ref.current?.closest('.inner-scroll');
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('resize', handleClose);
    window.addEventListener('scroll', handleClose, true);
    parentScroller?.addEventListener('scroll', handleClose);

    return () => {
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('scroll', handleClose, true);
      parentScroller?.removeEventListener('scroll', handleClose);
    };
  }, [isOpen]);

  const handleToggleOpen = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
    if(isOpen) {
        setSearchTerm("");
    }
  };

  const handleOptionClick = (optionValue: string) => {
    const event = {
      target: { value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    setIsOpen(false);
    setSearchTerm("");
  };

  const options = Children.toArray(children).filter(isValidElement).map(child => ({
      value: (child.props as any).value as string,
      label: (child.props as any).children as React.ReactNode,
      disabled: (child.props as any).disabled as boolean,
  }));
  
  const filteredOptions = options.filter(option =>
    !option.disabled && typeof option.label === 'string' && option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);
  const selectedLabel = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption || !value;
  
  const dropdownClasses = `custom-dropdown border border-gray-600 rounded-md shadow-lg max-h-60 flex flex-col`;

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
        {...props}
      >
        <span className={`truncate ${isPlaceholder ? 'text-gray-400' : 'text-white'}`}>{selectedLabel}</span>
        <svg className={`w-4 h-4 ml-2 transform transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      <AnimatePresence>
      {isOpen && document.body && createPortal(
        <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -5 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className={dropdownClasses}
            style={style}
        >
          <div className="p-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="overflow-auto flex-grow">
            {filteredOptions.map(option => {
              const isSelected = String(value) === option.value;
              return (
                  <li
                      key={option.value}
                      onClick={() => handleOptionClick(option.value)}
                      className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  >
                      {option.label}
                  </li>
              );
            })}
          </ul>
        </motion.div>,
        document.body
      )}
      </AnimatePresence>
    </div>
  );
};