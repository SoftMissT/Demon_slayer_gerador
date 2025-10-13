import React from 'react';
import { Button } from './ui/Button';
import { DiscordIcon } from './icons/DiscordIcon';

interface AuthOverlayProps {
  onLoginClick: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLoginClick }) => (
    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <img src="https://i.imgur.com/M9BDKmO.png" alt="Kimetsu Forge Logo" className="w-24 h-24 mb-6 opacity-80" />
        <h3 className="text-2xl font-bold font-gangofthree text-white mb-4">Acesso à Forja Secreta</h3>
        <p className="text-gray-300 mb-6 max-w-md">Esta área é exclusiva para membros autorizados. Por favor, entre com sua conta do Discord para verificar seu acesso.</p>
        <Button 
            onClick={onLoginClick} 
            className="!w-auto !flex-row !gap-2 !px-6 !py-3 !text-base forge-button"
            variant="primary"
        >
            <DiscordIcon className="w-6 h-6" />
            Entrar com Discord
        </Button>
    </div>
);
