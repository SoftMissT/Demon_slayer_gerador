import React, { useState } from 'react';

const ShareIcon = () => (
    <svg className="share-icon w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
);


export const ShareButton: React.FC = () => {
    const [buttonText, setButtonText] = useState('Compartilhar');
    const shareUrl = 'https://demon-slayer-gerador.vercel.app/';

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(shareUrl);
        setButtonText('Copiado!');
        setTimeout(() => setButtonText('Compartilhar'), 2000);
    };

    return (
        <button className="button-content" onClick={handleCopy}>
            <span className="text">{buttonText}</span>
            <ShareIcon />
        </button>
    );
};