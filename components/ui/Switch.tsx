import React from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // O label é tratado externamente para maior flexibilidade
}

export const Switch: React.FC<SwitchProps> = ({ ...props }) => {
  return (
    <label className="switch">
      <input type="checkbox" {...props} />
      <span className="slider"></span>
    </label>
  );
};
