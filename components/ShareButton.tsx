import React, { useState } from 'react';
import { Tooltip } from './ui/Tooltip';
import { ShareIcon } from './icons/ShareIcon';

export const ShareButton: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText('https://demon-slayer-gerador.vercel.app');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip text={copied ? "Link Copiado!" : "Compartilhar"}>
            <button onClick={handleShare} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700" aria-label="Compartilhar">
                <ShareIcon className="w-6 h-6" />
            </button>
        </Tooltip>
    );
};
