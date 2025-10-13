
import React from 'react';
import type { MidjourneyParameters as MidjourneyParametersType, MidjourneyParam } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { TextInput } from './ui/TextInput';

interface MidjourneyParametersProps {
  params: MidjourneyParametersType;
  setParams: React.Dispatch<React.SetStateAction<MidjourneyParametersType>>;
}

export const MidjourneyParameters: React.FC<MidjourneyParametersProps> = ({ params, setParams }) => {

  const handleParamChange = (key: keyof MidjourneyParametersType, field: keyof MidjourneyParam, value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      }
    }));
  };

  const versions = ['6', '5.2', '5.1', 'Niji 6', 'Niji 5'];

  return (
      <div className="space-y-4">
        {/* Toggle + TextInput for Aspect Ratio */}
        <div className="flex items-end gap-2">
            <div className="flex-grow">
                 <TextInput 
                    label="Aspect Ratio" 
                    value={params.aspectRatio.value as string} 
                    onChange={e => handleParamChange('aspectRatio', 'value', e.target.value)}
                    disabled={!params.aspectRatio.active}
                    placeholder="Ex: 16:9"
                />
            </div>
            <Switch label="" checked={params.aspectRatio.active} onChange={e => handleParamChange('aspectRatio', 'active', e.target.checked)} />
        </div>

        {/* Toggle + Select for Version */}
        <div className="flex items-end gap-2">
            <div className="flex-grow">
                <Select label="Versão" value={params.version.value as string} onChange={e => handleParamChange('version', 'value', e.target.value)} disabled={!params.version.active}>
                    {versions.map(v => <option key={v} value={v}>{v}</option>)}
                </Select>
            </div>
            <Switch label="" checked={params.version.active} onChange={e => handleParamChange('version', 'active', e.target.checked)} />
        </div>

        {/* Toggle + Slider for Chaos */}
        <div className="flex items-end gap-2">
            <div className="flex-grow">
                 <Slider 
                    label="Chaos" 
                    min={0} max={100} step={1} 
                    value={params.chaos.value as number}
                    onChange={e => handleParamChange('chaos', 'value', parseInt(e.target.value, 10))}
                    disabled={!params.chaos.active}
                    tooltip="Quão variados e inesperados serão os resultados. (0-100)"
                />
            </div>
            <Switch label="" checked={params.chaos.active} onChange={e => handleParamChange('chaos', 'active', e.target.checked)} />
        </div>
        
        {/* Toggle + Slider for Stylize */}
        <div className="flex items-end gap-2">
            <div className="flex-grow">
                <Slider 
                    label="Stylize" 
                    min={0} max={1000} step={1}
                    value={params.stylize.value as number}
                    onChange={e => handleParamChange('stylize', 'value', parseInt(e.target.value, 10))}
                    disabled={!params.stylize.active}
                    tooltip="Quão artístico o Midjourney deve ser. (0-1000)"
                />
            </div>
            <Switch label="" checked={params.stylize.active} onChange={e => handleParamChange('stylize', 'active', e.target.checked)} />
        </div>
      </div>
  );
};
