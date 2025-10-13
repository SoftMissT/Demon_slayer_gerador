import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoTooltip } from './InfoTooltip';

interface SearchableMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelection?: number;
  tooltip?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
  maxSelection,
  tooltip,
}) => {
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
  };

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (maxSelection && selected.length >= maxSelection) {
        return; 
      }
      onChange([...selected, option]);
    }
  };
  
  const isMaxSelected = maxSelection && selected.length >= maxSelection;

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const dropdownClasses = `custom-dropdown border border-gray-600 rounded-md shadow-lg max-h-60 flex flex-col`;

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggleOpen}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-left flex justify-between items-center"
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </span>
        <svg className={`w-4 h-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
          <div className="p-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-1 px-2 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="overflow-y-auto">
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option);
              const isDisabled = !!(!isSelected && isMaxSelected);
              return (
                <li
                  key={option}
                  onClick={() => !isDisabled && toggleOption(option)}
                  className={`px-3 py-2 flex items-center dropdown-option ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    disabled={isDisabled}
                    className="mr-2 accent-indigo-500"
                  />
                  <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option}</span>
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