import React, { useState, useEffect } from 'react';

const MESSAGES = [
    'Consultando grimórios arcanos...',
    'Misturando essências astrais...',
    'Aguardando a fervura do caldeirão...',
    'Destilando o conhecimento proibido...',
    'Adicionando uma pitada de caos...',
    'Decifrando runas de criação...',
];

export const AlchemyLoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-6 w-full max-w-md">
            <style>{`
                .stir-spoon {
                    transform-origin: 50% 90%;
                    animation: stir 4s ease-in-out infinite;
                }
                @keyframes stir {
                    0%, 100% { transform: rotate(-20deg); }
                    50% { transform: rotate(20deg); }
                }
                .bubble {
                    transform-origin: 50% 100%;
                    animation: bubble-rise 2s ease-in infinite;
                    opacity: 0;
                }
                @keyframes bubble-rise {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-30px) scale(1); opacity: 0; }
                }
                .potion-surface {
                    animation: bubbling 1s ease-in-out infinite alternate;
                }
                @keyframes bubbling {
                    from { transform: translateY(0); }
                    to { transform: translateY(-2px); }
                }
            `}</style>
             <svg viewBox="0 0 100 100" className="w-48 h-48">
                {/* Cauldron */}
                <path d="M20 50 C20 30, 80 30, 80 50 L85 80 C85 90, 15 90, 15 80 Z" fill="#27272a" />
                <rect x="15" y="88" width="10" height="5" fill="#27272a" rx="2" />
                <rect x="75" y="88" width="10" height="5" fill="#27272a" rx="2" />
                
                {/* Potion */}
                <g>
                    <path d="M22 55 C30 50, 70 50, 78 55 Q78 70, 50 70 Q22 70, 22 55 Z" fill="#6d28d9" className="potion-surface" />
                    <path d="M22 55 C30 60, 70 60, 78 55 Q78 70, 50 70 Q22 70, 22 55 Z" fill="#4c1d95" />
                </g>

                {/* Bubbles */}
                <g>
                    <circle cx="40" cy="65" r="3" fill="#a78bfa" className="bubble" style={{ animationDelay: '0s' }} />
                    <circle cx="60" cy="65" r="2" fill="#a78bfa" className="bubble" style={{ animationDelay: '0.5s' }} />
                    <circle cx="50" cy="60" r="2.5" fill="#a78bfa" className="bubble" style={{ animationDelay: '1s' }} />
                     <circle cx="45" cy="62" r="1.5" fill="#a78bfa" className="bubble" style={{ animationDelay: '1.5s' }} />
                </g>
                
                {/* Spoon */}
                <g className="stir-spoon">
                    <rect x="48" y="10" width="4" height="60" fill="#a16207" rx="2" />
                    <ellipse cx="50" cy="70" rx="8" ry="5" fill="#a16207" />
                </g>
            </svg>
            <p className="mt-4 text-lg font-semibold text-indigo-400">Engenharia de Prompt em andamento...</p>
            <p className="mt-2 text-gray-400 transition-opacity duration-500 h-6">{message}</p>
        </div>
    );
};
