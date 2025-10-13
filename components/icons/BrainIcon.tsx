// FIX: Implemented the BrainIcon component to resolve 'not a module' error. This file was empty.
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 6 5.5v-1A2.5 2.5 0 0 1 8.5 2h1Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 18 5.5v-1A2.5 2.5 0 0 0 15.5 2h-1Z" />
    <path d="M6 8.5a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 3 12v-1A2.5 2.5 0 0 1 5.5 8.5h1Z" />
    <path d="M18 8.5a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-2.5-2.5h-1Z" />
    <path d="M6 15.5a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 3 19v-1a2.5 2.5 0 0 1 2.5-2.5h1Z" />
    <path d="M18 15.5a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5v-1a2.5 2.5 0 0 0-2.5-2.5h-1Z" />
  </svg>
);
