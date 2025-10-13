import React, { useState, useEffect } from 'react';
import { AnvilIcon } from './icons/AnvilIcon';
import { TypingLoader } from './TypingLoader';
import type { FilterState } from '../types';

const MESSAGES = [
    'Aquecendo a fornalha com ventos ancestrais...',
    'Consultando os pergaminhos de aço Nichirin...',
    'Martelando a realidade em forma de lenda...',
    'Temperando a criação em águas místicas...',
    'Aguardando o alinhamento das estrelas...',
    'Invocando a centelha da inspiração divina...',
    'Polindo a lâmina da narrativa...',
    'O eco do martelo ressoa no vazio...',
];

interface ForgeLoadingIndicatorProps {
    aiFocus?: Record<string, string> | null;
    activeFilters?: FilterState | null;
}

export const ForgeLoadingIndicator: React.FC<ForgeLoadingIndicatorProps> = ({ aiFocus, activeFilters }) => {
    const [message, setMessage] = useState(MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    const category = activeFilters?.category;
    const tematica = (activeFilters && Object.values(activeFilters).find(v => typeof v === 'string' && v && !['', 'Aleatória', 'Aleatório'].includes(v) && v.length > 3));

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full h-full">
            <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-400 blur-2xl opacity-40 animate-pulse"></div>
                <AnvilIcon className="w-24 h-24 text-gray-400 animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-bold font-gangofthree text-white">Forjando...</h3>
            {category && <p className="text-indigo-400">{category}{tematica ? ` • ${tematica}` : ''}</p>}
            <TypingLoader text={message} className="text-gray-400 mt-2 h-5" />

            {aiFocus && (
                <div className="text-xs mt-4 space-y-1 font-mono text-gray-500 border-t border-gray-700 pt-3">
                    {aiFocus.aiFocusGemini && <p>Foco Gemini: {aiFocus.aiFocusGemini}</p>}
                    {aiFocus.aiFocusGpt && <p>Foco GPT: {aiFocus.aiFocusGpt}</p>}
                    {aiFocus.aiFocusDeepSeek && <p>Foco DeepSeek: {aiFocus.aiFocusDeepSeek}</p>}
                </div>
            )}
        </div>
    );
};
