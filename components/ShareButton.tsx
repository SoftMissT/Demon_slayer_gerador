import React, { useState } from 'react';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedinIcon } from './icons/LinkedinIcon';

const ShareIcon = () => (
    <svg className="share-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" />
        <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" />
        <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" />
        <path d="M8.59 13.51L15.41 17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export const ShareButton: React.FC = () => {
    const [buttonText, setButtonText] = useState('Compartilhar');
    const shareUrl = 'https://demon-slayer-gerador.vercel.app/';
    const shareText = 'Confira este incrível gerador de conteúdo para RPG de Demon Slayer! #KimetsuForge';

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(shareUrl);
        setButtonText('Copiado!');
        setTimeout(() => setButtonText('Compartilhar'), 2000);
    };

    const openSharePopup = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    };

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent('Kimetsu Forge - Gerador de Conteúdo para RPG')}`;

    return (
        <div className="tooltip-container">
            <button className="button-content" onClick={handleCopy}>
                <span className="text">{buttonText}</span>
                <ShareIcon />
            </button>
            <div className="tooltip-content">
                <div className="social-icons">
                    <a href="#" onClick={(e) => { e.preventDefault(); openSharePopup(twitterShareUrl); }} className="social-icon twitter" aria-label="Share on Twitter">
                        <TwitterIcon />
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); openSharePopup(facebookShareUrl); }} className="social-icon facebook" aria-label="Share on Facebook">
                        <FacebookIcon />
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); openSharePopup(linkedinShareUrl); }} className="social-icon linkedin" aria-label="Share on LinkedIn">
                        <LinkedinIcon />
                    </a>
                </div>
            </div>
        </div>
    );
};
