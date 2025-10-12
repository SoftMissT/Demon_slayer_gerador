import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <textarea
        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      />
    </div>
  );
};
