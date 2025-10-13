import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

interface SearchableMultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  tooltip?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Selecione...',
  tooltip
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const handleToggle = () => {
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
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = useMemo(() =>
    options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [options, searchTerm]
  );

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
        className="flex items-center justify-between w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-left min-h-[42px] select-button"
      >
        <div className="flex flex-wrap gap-1 flex-grow">
          {selected.length === 0 ? <span className="text-gray-400">{placeholder}</span> : 
            selected.map(value => {
                const option = options.find(o => o.value === value);
                return (
                    <span key={value} className="bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                        {option?.label || value}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleToggleOption(value); }}
                            className="ml-1.5 text-indigo-200 hover:text-white"
                        >
                            &times;
                        </button>
                    </span>
                );
            })
          }
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
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
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-md py-1.5 px-2 text-white text-sm"
                autoFocus
              />
            </div>
            <ul className="max-h-60 overflow-auto inner-scroll custom-dropdown">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleToggleOption(option.value)}
                  className={`dropdown-option ${selected.includes(option.value) ? 'selected' : ''}`}
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
