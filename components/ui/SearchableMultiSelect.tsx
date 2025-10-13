import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

interface SearchableMultiSelectProps {
    label: string;
    options: readonly string[] | string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    tooltip?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({ label, options, selected, onChange, placeholder, tooltip }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLButtonElement>(null);
    const [theme, setTheme] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    useEffect(() => {
        if (selectRef.current) {
            const currentTheme = selectRef.current.closest('.theme-forge') ? 'theme-forge' : 'theme-alchemist';
            setTheme(currentTheme);
        }
    }, []);

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

    const handleToggle = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const displayValue = selected.length > 0
        ? selected.length > 2
            ? `${selected.length} selecionados`
            : selected.join(', ')
        : placeholder || 'Selecione...';

    const DropdownMenu = () => (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
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
                        key={option}
                        className="dropdown-option flex items-center"
                        onClick={() => handleToggle(option)}
                    >
                        <input
                            type="checkbox"
                            readOnly
                            checked={selected.includes(option)}
                            className="form-checkbox h-4 w-4 rounded mr-3"
                        />
                        {option}
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
                <span className="truncate">{displayValue}</span>
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
