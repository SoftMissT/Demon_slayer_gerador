import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, ...props }) => {
  return (
    <div>
      <label className="flex justify-between items-center text-sm font-medium text-gray-400 mb-1">
        <span>{label}</span>
        <span className="bg-gray-700 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        {...props}
      />
    </div>
  );
};
