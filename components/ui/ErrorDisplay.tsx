import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { CollapsibleSection } from './CollapsibleSection';

interface ErrorDisplayProps {
  message: string | null;
  onDismiss: () => void;
  activeView?: 'forge' | 'alchemist';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss, activeView = 'forge' }) => {
    const [title, setTitle] = useState('Ocorreu um Erro Inesperado');
    const [suggestion, setSuggestion] = useState('Por favor, tente novamente. Se o problema persistir, tente ajustar seus filtros ou recarregar a página.');
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (message) {
            const parts = message.split('|');
            if (parts.length === 3) {
                setTitle(parts[0]);
                setSuggestion(parts[1]);
                setDetails(parts[2]);
            } else {
                setTitle('Ocorreu um Erro Inesperado');
                setSuggestion('Por favor, tente novamente. Se o problema persistir, tente ajustar seus filtros ou recarregar a página.');
                setDetails(message);
            }
            const timer = setTimeout(() => {
                onDismiss();
            }, 10000); 
            return () => clearTimeout(timer);
        }
    }, [message, onDismiss]);
    
    const themeClass = activeView === 'forge' ? 'error-display-forge' : 'error-display-alchemist';

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-4 right-4 z-[2000] w-full max-w-md"
                >
                    <div className={`backdrop-blur-md text-white p-4 rounded-lg shadow-lg flex items-start gap-4 ${themeClass}`}>
                        <AlertTriangleIcon className="w-8 h-8 flex-shrink-0 mt-1" />
                        <div className="flex-grow">
                            <h4 className="font-bold font-gangofthree text-lg">{title}</h4>
                            <p className="text-sm opacity-90 mt-1">{suggestion}</p>
                            
                            {details && (
                                <div className="mt-3">
                                    <CollapsibleSection title="Detalhes Técnicos">
                                        <div className="mt-2 p-2 bg-black/30 rounded text-xs font-mono break-all">
                                            {details}
                                        </div>
                                    </CollapsibleSection>
                                </div>
                            )}

                        </div>
                        <button onClick={onDismiss} className="text-2xl leading-none flex-shrink-0 opacity-70 hover:opacity-100">&times;</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};