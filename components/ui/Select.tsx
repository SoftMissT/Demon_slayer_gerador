import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { InfoTooltip } from './InfoTooltip';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// FIX: Used Omit to resolve type conflict for the 'onChange' property. This allows a custom signature while retaining other HTML attributes.
// FIX: Added 'disabled' prop to the component interface.
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label: string;
    options: readonly string[] | string[] | SelectOption[];
    value: string;
    onChange: (value: string) => void;
    tooltip?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, options, value, onChange, tooltip, placeholder, disabled, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
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


    const normalizedOptions: SelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedLabel = normalizedOptions.find(opt => opt.value === value)?.label || placeholder || 'Selecione...';

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
        >
            <ul className="max-h-60 overflow-y-auto">
                {placeholder && <li className="dropdown-option disabled">{placeholder}</li>}
                {normalizedOptions.map((option) => (
                    <li
                        key={option.value}
                        className={`dropdown-option ${value === option.value && !option.disabled ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                    >
                        {option.label}
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
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">{selectedLabel}</span>
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