import React from 'react';

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="input-main-container">
            <div className="poda-container">
                <div className="glow"></div>
                <div className="darkBorderBg"></div>
                <div className="border"></div>
                <div className="white"></div>
                <input 
                    className="input-field"
                    {...props}
                />
            </div>
        </div>
    </div>
);