import React from 'react';

export const AlchemyLoadingIndicator: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full max-w-md">
            <div className="loading-alch" />
            <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--accent)' }}>Destilando...</p>
            <p className="mt-2 text-gray-400 h-6">Aguarde enquanto os prompts são otimizados...</p>
        </div>
    );
};