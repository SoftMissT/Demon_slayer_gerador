

import React from 'react';
import type { GeminiParameters } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';

interface GeminiParametersProps {
  params: GeminiParameters;
  setParams: React.Dispatch<React.SetStateAction<GeminiParameters>>;
}

export const GeminiParametersComponent: React.FC<GeminiParametersProps> = ({ params, setParams }) => {
  const handleParamChange = (key: keyof GeminiParameters, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const artStyles = ["Anime/Manga", "Photorealistic", "Concept Art", "Digital Painting", "3D Render", "Pixel Art", "Fantasy Art"];
  const lightings = ["Cinematic Lighting", "Dramatic Lighting", "Soft Lighting", "Studio Lighting", "Natural Light", "Neon Glow"];
  const colorPalettes = ["Vibrant", "Monochromatic", "Pastel", "Dark & Moody", "Warm Tones", "Cool Tones"];
  const compositions = ["Dynamic Angle", "Close-up Shot", "Wide Angle", "Symmetrical", "Rule of Thirds", "Top-down view"];
  const detailLevels = ["Detailed", "Hyper-detailed", "Minimalist", "Stylized"];

  return (
    <div className="space-y-4">
        <Select label="Estilo de Arte" value={params.artStyle} onChange={(e) => handleParamChange('artStyle', e.target.value)}>
          {artStyles.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select label="Iluminação" value={params.lighting} onChange={(e) => handleParamChange('lighting', e.target.value)}>
          {lightings.map(l => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select label="Paleta de Cores" value={params.colorPalette} onChange={(e) => handleParamChange('colorPalette', e.target.value)}>
          {colorPalettes.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select label="Composição" value={params.composition} onChange={(e) => handleParamChange('composition', e.target.value)}>
          {compositions.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select label="Nível de Detalhe" value={params.detailLevel} onChange={(e) => handleParamChange('detailLevel', e.target.value)}>
          {detailLevels.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
  );
};
