import React, { useState, useEffect } from 'react';
import { AnvilIcon } from './icons/AnvilIcon';
import { TypingLoader } from './TypingLoader';
import { GeminiIcon } from './icons/GeminiIcon';
import { GptIcon } from './icons/GptIcon';

interface ForgeLoadingIndicatorProps {
    aiFocus: Record<string, string> | null;
}

const STEPS = [
    { model: 'DeepSeek', task: 'Conceitualizando ideia base...', icon: <GeminiIcon className="w-5 h-5" /> },
    { model: 'Gemini', task: 'Estruturando lore e mecânicas...', icon: <GeminiIcon className="w-5 h-5" /> },
    { model: 'GPT-4o', task: 'Aplicando polimento narrativo final...', icon: <GptIcon className="w-5 h-5" /> },
];


export const ForgeLoadingIndicator: React.FC<ForgeLoadingIndicatorProps> = ({ aiFocus }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % STEPS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 w-full max-w-md">
            <div className="relative w-24 h-24 mb-6">
                <AnvilIcon className="w-24 h-24 text-gray-600 animate-pulse" />
                <div className="spark-container">
                    <div className="spark"></div>
                    <div className="spark"></div>
                    <div className="spark"></div>
                    <div className="spark"></div>
                </div>
            </div>
            <h2 className="text-2xl font-bold font-gangofthree text-white">Forjando...</h2>
            
            <div className="mt-4 w-full text-left p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full flex-shrink-0">
                        {STEPS[currentStep].icon}
                    </div>
                    <TypingLoader
                        key={currentStep}
                        text={STEPS[currentStep].task}
                        className="text-indigo-300"
                    />
                </div>
            </div>
        </div>
    );
};
