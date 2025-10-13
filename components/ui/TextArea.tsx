// FIX: Implemented the TextArea component to replace placeholder content, resolving multiple module and syntax errors across the application.
import React from 'react';
import { InfoTooltip } from './InfoTooltip';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  tooltip?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, tooltip, ...props }) => {
  return (
    <div>
      {label && (
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-medium text-gray-400">{label}</span>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
      )}
      <textarea
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 resize-y"
        {...props}
      />
    </div>
  );
};
