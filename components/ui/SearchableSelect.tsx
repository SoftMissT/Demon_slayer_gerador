import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

interface SearchableSelectProps {
    label: string;
    options: readonly string[] | string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    tooltip?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, value, onChange, placeholder, tooltip }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLButtonElement>(null);
    const [theme, setTheme] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (isOpen && selectRef.current) {
            const currentTheme = selectRef.current.closest('.theme-forge') ? 'theme-forge' : 'theme-alchemist';
            setTheme(currentTheme);
        }
    }, [isOpen]);
    
    useEffect(() => {
        const updatePosition = () => {
            if (isOpen && selectRef.current) {
                const rect = selectRef.current.getBoundingClientRect();
                setDropdownPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };

        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition);
        }

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isOpen]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    const DropdownMenu = () => (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'circOut' }}
            className="custom-dropdown"
            style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
            }}
             onClick={(e) => e.stopPropagation()}
        >
            <div className="p-2">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="dropdown-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />
            </div>
            <ul className="max-h-52 overflow-y-auto">
                {filteredOptions.map((option) => (
                    <li
                        key={option || 'placeholder-key'}
                        className={`dropdown-option ${value === option ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option === '' ? (placeholder || 'Selecione...') : option}
                    </li>
                ))}
            </ul>
        </motion.div>
    );

    return (
        <div className="w-full">
            <div className="flex items-center gap-1.5 mb-1">
                <label className="text-sm font-medium">{label}</label>
                {tooltip && <InfoTooltip text={tooltip} />}
            </div>
            <button
                ref={selectRef}
                type="button"
                className="custom-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">{value || placeholder || 'Selecione...'}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && createPortal(
                    <div className={`fixed inset-0 z-[1000] ${theme}`} onClick={() => setIsOpen(false)}>
                        <DropdownMenu />
                    </div>,
                    document.body
                )}
            </AnimatePresence>
        </div>
    );
};