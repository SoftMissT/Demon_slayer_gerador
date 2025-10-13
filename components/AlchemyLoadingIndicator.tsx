import React from 'react';
import { PotionIcon } from './icons/PotionIcon';
import { CrystalIcon } from './icons/CrystalIcon';
import { TypingLoader } from './TypingLoader';

export const AlchemyLoadingIndicator: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full max-w-sm">
            <div className="relative w-24 h-24 mb-4">
                <CrystalIcon className="w-24 h-24 text-indigo-500/30 animate-pulse" />
                <PotionIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-purple-400 animate-spin-slow" />
            </div>
            <h3 className="text-lg font-bold font-gangofthree text-white">Destilando Prompts...</h3>
            <TypingLoader text="Consultando os éteres da criatividade..." className="text-gray-400 mt-2 h-5" />
        </div>
    );
};
