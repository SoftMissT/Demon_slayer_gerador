import React, { useState, useRef, useEffect } from 'react';

interface SearchableMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxSelection?: number;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
  maxSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (maxSelection && selected.length >= maxSelection) {
        // Optional: show a toast or message that limit is reached
        return; 
      }
      onChange([...selected, option]);
    }
  };
  
  const isMaxSelected = maxSelection && selected.length >= maxSelection;

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-left flex justify-between items-center"
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(', ') : placeholder}
        </span>
        <svg className={`w-4 h-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-gray-900 border border-gray-700 rounded-md py-1 px-2 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul>
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option);
              const isDisabled = !!(!isSelected && isMaxSelected);
              return (
                <li
                  key={option}
                  onClick={() => !isDisabled && toggleOption(option)}
                  className={`px-3 py-2 flex items-center ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700'}`}
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
        </div>
      )}
    </div>
  );
};