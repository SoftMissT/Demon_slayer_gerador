import React from 'react';
import { ShareButton } from './ShareButton';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-2 sm:p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
                <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-10 h-10" />
                <h1 className="text-xl sm:text-2xl font-bold font-gangofthree text-white hidden sm:block">
                    Kimetsu Forge
                </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                 <ShareButton />
            </div>
        </header>
    );
};