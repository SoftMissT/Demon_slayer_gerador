import React from 'react';

interface FooterProps {
  onViewChange: (view: 'sobre') => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="w-full text-center p-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-500">
      <span>Forja de Lendas é uma ferramenta não oficial.</span>
      <button onClick={() => onViewChange('sobre')} className="underline hover:text-white ml-2">
        Sobre o projeto
      </button>
    </footer>
  );
};