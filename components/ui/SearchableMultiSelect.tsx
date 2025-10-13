import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface Option {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  
  const displayValue = selected.length > 0
    ? `${selected.length} selecionado(s)`
    : 'Nenhum';

  return (
    <div ref={selectRef}>
      <span className="block text-sm font-medium text-gray-400 mb-1">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-left flex items-center justify-between"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 py-2 px-3 text-white border-b border-gray-700 focus:outline-none"
            />
            <ul className="overflow-y-auto">
              {filteredOptions.map(option => (
                <li
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                  className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    readOnly
                    className="mr-2 form-checkbox h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 accent-indigo-500"
                  />
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
