// FIX: Implemented the AboutTooltip component to resolve placeholder errors. It wraps a help icon with a tooltip and triggers an onClick event, intended to open the About modal.
import React from 'react';
import { Tooltip } from './ui/Tooltip';
import { HelpIcon } from './icons/HelpIcon';

interface AboutTooltipProps {
  onClick: () => void;
}

export const AboutTooltip: React.FC<AboutTooltipProps> = ({ onClick }) => {
  return (
    <Tooltip text="Sobre & Ajuda">
      <button 
        onClick={onClick}
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Sobre e Ajuda"
      >
        <HelpIcon className="w-6 h-6" />
      </button>
    </Tooltip>
  );
};
