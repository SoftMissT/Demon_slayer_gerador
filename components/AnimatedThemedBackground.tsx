import React, { useState, useEffect } from 'react';

const Sparks: React.FC = () => {
    const [styles, setStyles] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        setStyles(Array.from({ length: 50 }).map(() => ({
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 3}s`,
        })));
    }, []);

    return (
        <div className="sparks-container">
            {styles.map((style, i) => (
                <div key={i} className="spark" style={style}></div>
            ))}
        </div>
    );
};

export const AnimatedThemedBackground: React.FC = React.memo(() => (
    <div className="app-background" aria-hidden="true">
        <Sparks />
    </div>
));