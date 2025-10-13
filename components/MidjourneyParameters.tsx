
import React from 'react';
import type { MidjourneyParameters } from '../types';
import { Card } from './ui/Card';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';

interface MidjourneyParametersProps {
  params: MidjourneyParameters;
  setParams: React.Dispatch<React.SetStateAction<MidjourneyParameters>>;
}

const ParamRow: React.FC<{ label: string; children: React.ReactNode; active: boolean; onToggle: (active: boolean) => void; }> = 
({ label, children, active, onToggle }) => (
    <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-white flex-grow">
            <Switch checked={active} onChange={(e) => onToggle(e.target.checked)} />
            {label}
        </label>
        <div className={`flex-shrink-0 w-40 ${!active ? 'opacity-50 pointer-events-none' : ''}`}>
            {children}
        </div>
    </div>
);


export const MidjourneyParametersComponent: React.FC<MidjourneyParametersProps> = ({ params, setParams }) => {
  const handleParamChange = <K extends keyof MidjourneyParameters>(
    key: K,
    field: keyof MidjourneyParameters[K],
    value: MidjourneyParameters[K][keyof MidjourneyParameters[K]]
  ) => {
    setParams(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return (
    <Card className="!p-4 model-midjourney">
      <h3 className="text-lg font-bold text-white font-gangofthree mb-4">Parâmetros (Midjourney)</h3>
      <div className="space-y-3">
        <ParamRow label="Aspect Ratio (--ar)" active={params.aspectRatio.active} onToggle={(a) => handleParamChange('aspectRatio', 'active', a)}>
            <Select value={params.aspectRatio.value} onChange={(e) => handleParamChange('aspectRatio', 'value', e.target.value)} label="">
                <option value="1:1">1:1 (Quadrado)</option>
                <option value="16:9">16:9 (Paisagem)</option>
                <option value="9:16">9:16 (Retrato)</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
            </Select>
        </ParamRow>
        <ParamRow label="Versão (--v)" active={params.version.active} onToggle={(a) => handleParamChange('version', 'active', a)}>
             <Select value={params.version.value} onChange={(e) => handleParamChange('version', 'value', e.target.value)} label="">
                <option value="6">6</option>
                <option value="5.2">5.2</option>
                <option value="Niji 6">Niji 6 (Anime)</option>
            </Select>
        </ParamRow>
         <ParamRow label="Estilo (--style)" active={params.style.active} onToggle={(a) => handleParamChange('style', 'active', a)}>
             <Select value={params.style.value} onChange={(e) => handleParamChange('style', 'value', e.target.value)} label="">
                <option value="raw">Raw</option>
                <option value="cute">Cute</option>
                <option value="expressive">Expressive</option>
                <option value="scenic">Scenic</option>
            </Select>
        </ParamRow>
        <ParamRow label="Stylize (--s)" active={params.stylize.active} onToggle={(a) => handleParamChange('stylize', 'active', a)}>
            <Slider label="" value={params.stylize.value} onChange={(e) => handleParamChange('stylize', 'value', parseInt(e.target.value))} min={0} max={1000} step={50} />
        </ParamRow>
        <ParamRow label="Chaos (--c)" active={params.chaos.active} onToggle={(a) => handleParamChange('chaos', 'active', a)}>
            <Slider label="" value={params.chaos.value} onChange={(e) => handleParamChange('chaos', 'value', parseInt(e.target.value))} min={0} max={100} step={5} />
        </ParamRow>
      </div>
    </Card>
  );
};