import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, placeholder, tooltip }) => {
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

    const filteredOptions = useMemo(() => 
        options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]);

    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const displayValue = value || placeholder || 'Selecione...';
    
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
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center text-left select-button min-h-[42px]"
            >
                <span className={`truncate ${value ? 'text-white' : 'text-gray-400'}`}>{displayValue}</span>
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
                            className="w-full bg-gray-900 border-gray-700 rounded-md py-1.5 px-2 text-white text-sm"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-auto inner-scroll custom-dropdown">
                        {filteredOptions.map(option => (
                            <li key={option}
                                onClick={() => handleSelect(option)}
                                className={`dropdown-option ${option === value ? 'selected' : ''}`}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </motion.div>,
                document.body
            )}
        </div>
    );
};
