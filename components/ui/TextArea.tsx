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
      <textarea
        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      />
    </div>
  );
};