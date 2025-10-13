// FIX: Implemented the LightbulbIcon component to resolve 'not a module' error. This file was empty.
import React from 'react';

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15.09 14.32a1 1 0 0 1-.28.95A4.8 4.8 0 0 1 12 16a4.8 4.8 0 0 1-2.81-.73 1 1 0 0 1-.28-.95A2.4 2.4 0 0 1 9.2 12h5.6a2.4 2.4 0 0 1 .29 2.32Z" />
    <path d="M12 2a6 6 0 0 0-5 9.33a7 7 0 0 0 10 0A6 6 0 0 0 12 2Z" />
    <path d="M12 16v2" />
    <path d="M10 20h4" />
  </svg>
);
