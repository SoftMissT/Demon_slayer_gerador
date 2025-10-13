import React from 'react';

export const ForgeLoadingIndicator: React.FC<{ aiFocus: Record<string, string> | null }> = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full max-w-md">
            <div className="loading-forge" />
            <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--accent)'}}>Forjando...</p>
            <p className="mt-2 text-gray-400 h-6">Aguarde enquanto o item é criado...</p>
        </div>
    );
};