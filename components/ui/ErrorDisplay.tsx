import React, { useEffect } from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface ErrorDisplayProps {
  message: string | null;
  onDismiss: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 7000); // Auto-dismiss after 7 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-full max-w-sm animate-fade-in-up">
      <div className="bg-red-900/80 backdrop-blur-md border border-red-700 text-white p-4 rounded-lg shadow-lg flex items-start gap-3">
        <AlertTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h4 className="font-bold">Ocorreu um Erro</h4>
          <p className="text-sm text-red-200">{message}</p>
        </div>
        <button onClick={onDismiss} className="text-red-300 hover:text-white text-2xl leading-none flex-shrink-0">&times;</button>
      </div>
    </div>
  );
};
