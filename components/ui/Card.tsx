
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = "bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 transition-all duration-300";
  const clickableClasses = onClick ? "cursor-pointer hover:border-indigo-500 hover:shadow-indigo-500/20" : "";
  
  return (
    <div className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
