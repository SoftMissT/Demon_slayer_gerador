import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      // Wait for the exit animation to complete before unmounting
      const timer = setTimeout(() => setIsRendered(false), 300); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-75' : 'bg-opacity-0'}`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl border border-gray-700 flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white font-gangofthree">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};