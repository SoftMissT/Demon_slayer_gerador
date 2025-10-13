

import React from 'react';
import type { GptParameters } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';

interface GptStructuredBuilderProps {
  params: GptParameters;
  setParams: React.Dispatch<React.SetStateAction<GptParameters>>;
}

export const GptStructuredBuilder: React.FC<GptStructuredBuilderProps> = ({ params, setParams }) => {
  const handleParamChange = (key: keyof GptParameters, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const tones = ["Cinematic", "Dramatic", "Whimsical", "Dark & Moody", "Epic", "Serene"];
  const styles = ["Concept Art", "Photorealistic", "Digital Painting", "Illustration", "3D Render", "Pixel Art"];
  const compositions = ["Dynamic Angle", "Close-up Shot", "Wide Angle", "Symmetrical", "Rule of Thirds"];

  return (
     <div className="space-y-4">
        <Select label="Tom / Atmosfera" value={params.tone} onChange={(e) => handleParamChange('tone', e.target.value)}>
          {tones.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select label="Estilo de Arte" value={params.style} onChange={(e) => handleParamChange('style', e.target.value)}>
          {styles.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Composição / Ângulo" value={params.composition} onChange={(e) => handleParamChange('composition', e.target.value)}>
          {compositions.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>
  );
};
