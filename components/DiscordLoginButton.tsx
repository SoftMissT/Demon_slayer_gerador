import React from 'react';
import { DiscordIcon } from './icons/DiscordIcon';

interface DiscordLoginButtonProps {
  onClick: () => void;
}

export const DiscordLoginButton: React.FC<DiscordLoginButtonProps> = ({ onClick }) => {
  return (
    <div className="tooltip-container" onClick={onClick}>
      <div className="borde-back">
        <div className="icon">
          <DiscordIcon className="w-8 h-8" />
        </div>
      </div>
      <div className="tooltip">
        Logar com o Discord
      </div>
    </div>
  );
};