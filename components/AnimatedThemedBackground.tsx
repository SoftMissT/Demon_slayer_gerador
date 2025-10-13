import React from 'react';

const Sparks: React.FC = () => (
    <div className="sparks-container">
        {Array.from({ length: 50 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 3}s`,
            };
            return <div key={i} className="spark" style={style}></div>
        })}
    </div>
);

const Smoke: React.FC = () => (
    <div className="smoke-container">
        {Array.from({ length: 15 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 150 + 100}px`,
                height: `${Math.random() * 150 + 100}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 15}s`,
                '--x-drift': Math.random() * 200 - 100,
            } as React.CSSProperties;
            return <div key={i} className="smoke-puff" style={style}></div>
        })}
    </div>
);

export const AnimatedThemedBackground: React.FC<{ view: 'forge' | 'alchemist' }> = React.memo(({ view }) => (
    <div className="app-background" aria-hidden="true">
        {view === 'forge' ? <Sparks /> : <Smoke />}
    </div>
));
