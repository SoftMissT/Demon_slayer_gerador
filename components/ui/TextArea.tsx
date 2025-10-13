import React from 'react';
import { InfoTooltip } from './InfoTooltip';

// FIX: Added an optional 'tooltip' prop to support info icons next to the label, resolving prop-related type errors in FilterPanel.
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  tooltip?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, tooltip, ...props }) => {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
       <div className="input-main-container">
            <div className="poda-container">
                <div className="glow"></div>
                <div className="darkBorderBg"></div>
                <div className="border"></div>
                <div className="white"></div>
                <textarea
                  className="input-field textarea"
                  {...props}
                />
            </div>
        </div>
    </div>
  );
};