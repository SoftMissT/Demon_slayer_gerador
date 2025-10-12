import React, { useState, useEffect, useMemo } from 'react';

const KATAKANA_CHARS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

const getRandomChar = () => KATAKANA_CHARS[Math.floor(Math.random() * KATAKANA_CHARS.length)];

const MatrixBackgroundComponent: React.FC = () => {
    const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const calculateGrid = () => {
            // Use a character size of 40px as defined in the CSS
            const charSize = 40;
            const cols = Math.ceil(window.innerWidth / charSize);
            const rows = Math.ceil(window.innerHeight / charSize);
            setGridSize({ cols, rows });
        };

        calculateGrid();
        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    const spans = useMemo(() => {
        const totalSpans = gridSize.cols * gridSize.rows;
        if (totalSpans === 0) return null;
        
        // Generate a bit more to be safe on weird resizes and prevent gaps
        return Array.from({ length: totalSpans }).map((_, i) => (
             <span key={i}>{getRandomChar()}</span>
        ));
    }, [gridSize.cols, gridSize.rows]);

    return (
        <div 
            className="jp-matrix fixed inset-0 z-[-1] "
            aria-hidden="true"
        >
            {spans}
        </div>
    );
};

export const MatrixBackground = React.memo(MatrixBackgroundComponent);