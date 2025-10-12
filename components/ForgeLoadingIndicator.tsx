import React, { useState, useEffect } from 'react';

const MESSAGES = [
    'Aquecendo a fornalha...',
    'Martelando o aço da criação...',
    'Temperando a lâmina da imaginação...',
    'Consultando os pergaminhos do ferreiro...',
    'Canalizando o espírito do artesão...',
    'Polindo os detalhes da lenda...',
];

export const ForgeLoadingIndicator: React.FC = () => {
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
                .hammer {
                    transform-origin: 90% 90%;
                    animation: hammer-strike 1.5s ease-in-out infinite;
                }
                @keyframes hammer-strike {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-45deg); }
                }
                .spark {
                    animation: sparks-fly 0.7s forwards;
                    opacity: 0;
                }
                @keyframes sparks-fly {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
                }
                .metal-bar-start {
                    animation: heat-bar 10s linear infinite alternate;
                }
                 @keyframes heat-bar {
                    0% { stop-color: #6b7280; } /* gray-500 */
                    50% { stop-color: #f97316; } /* orange-500 */
                    100% { stop-color: #fef08a; } /* yellow-200 */
                }
            `}</style>
            <svg viewBox="0 0 100 100" className="w-48 h-48">
                {/* Anvil */}
                <path d="M10 60 H90 L85 65 L80 65 L80 80 L70 85 L30 85 L20 80 L20 65 L15 65 Z" fill="#4b5563" />
                <rect x="30" y="85" width="40" height="10" fill="#4b5563" />

                {/* Metal Bar */}
                <defs>
                    <linearGradient id="heatGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" className="metal-bar-start" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
                <rect x="25" y="55" width="50" height="5" fill="url(#heatGradient)" />
                
                {/* Hammer */}
                <g className="hammer">
                    <rect x="70" y="10" width="25" height="15" fill="#6b7280" rx="2" />
                    <rect x="78" y="25" width="8" height="40" fill="#a16207" />
                </g>

                {/* Sparks */}
                <g transform="translate(50 55)">
                    <circle cx="0" cy="0" r="1.5" fill="#f59e0b" className="spark" style={{ animationDelay: '0.75s', '--tx': '-20px', '--ty': '-30px' } as React.CSSProperties} />
                    <circle cx="0" cy="0" r="1" fill="#facc15" className="spark" style={{ animationDelay: '0.75s', '--tx': '10px', '--ty': '-40px' } as React.CSSProperties}/>
                    <circle cx="0" cy="0" r="1.5" fill="#f59e0b" className="spark" style={{ animationDelay: '0.75s', '--tx': '25px', '--ty': '-25px' } as React.CSSProperties}/>
                </g>
            </svg>
            <p className="mt-4 text-lg font-semibold text-indigo-400">Forjando item...</p>
            <p className="mt-2 text-gray-400 transition-opacity duration-500 h-6">{message}</p>
        </div>
    );
};
