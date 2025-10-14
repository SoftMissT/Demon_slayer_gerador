import React, { useRef, useEffect } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const baseClasses = "relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg p-4 transition-all duration-300 overflow-hidden";
  const clickableClasses = onClick ? "cursor-pointer hover:border-[var(--accent-primary)] hover:shadow-[0_0_15px_var(--accent-glow)]" : "";
  
  return (
    <div ref={cardRef} className={`${baseClasses} ${clickableClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};