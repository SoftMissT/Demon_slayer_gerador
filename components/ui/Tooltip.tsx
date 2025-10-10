import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative flex items-center" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} w-max max-w-xs z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 border border-gray-700 rounded-lg shadow-sm transition-opacity duration-300`}
        >
          {text}
        </div>
      )}
    </div>
  );
};
