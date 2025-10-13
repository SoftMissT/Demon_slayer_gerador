import React from 'react';
// FIX: Aliased the MidjourneyParameters type to resolve a name collision with the component.
import type { MidjourneyParameters as MidjourneyParametersType, MidjourneyParam } from '../types';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { TextInput } from './ui/TextInput';

interface MidjourneyParametersProps {
  params: MidjourneyParametersType;
  setParams: React.Dispatch<React.SetStateAction<MidjourneyParametersType>>;
}

export const MidjourneyParameters: React.FC<MidjourneyParametersProps> = ({ params, setParams }) => {
  const handleToggle = (key: keyof MidjourneyParametersType) => {
    setParams(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key]?.active } as MidjourneyParam,
    }));
  };

  const handleChange = (key: keyof MidjourneyParametersType, value: string | number) => {
    setParams(prev => ({
      ...prev,
      [key]: { ...prev[key], value } as MidjourneyParam,
    }));
  };
  
  return (
    <div className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
            <div className="flex-grow"><TextInput label="Aspect Ratio (--ar)" value={params.aspectRatio.value.toString()} onChange={(e) => handleChange('aspectRatio', e.target.value)} /></div>
            <Switch label="" checked={params.aspectRatio.active} onChange={() => handleToggle('aspectRatio')} />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-grow"><TextInput label="Version (--v)" value={params.version.value.toString()} onChange={(e) => handleChange('version', e.target.value)} /></div>
            <Switch label="" checked={params.version.active} onChange={() => handleToggle('version')} />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-grow"><TextInput label="Style (--style)" value={params.style.value.toString()} onChange={(e) => handleChange('style', e.target.value)} /></div>
            <Switch label="" checked={params.style.active} onChange={() => handleToggle('style')} />
        </div>
         <div className="flex items-center gap-4">
            <div className="flex-grow"><Slider label="Chaos (--chaos)" min={0} max={100} step={1} value={Number(params.chaos.value)} onChange={(e) => handleChange('chaos', Number(e.target.value))} tooltip="Quão variado/inesperado será o resultado." /></div>
            <Switch label="" checked={params.chaos.active} onChange={() => handleToggle('chaos')} />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-grow"><Slider label="Stylize (--s)" min={0} max={1000} step={1} value={Number(params.stylize.value)} onChange={(e) => handleChange('stylize', Number(e.target.value))} tooltip="Quão artístico será o resultado." /></div>
            <Switch label="" checked={params.stylize.active} onChange={() => handleToggle('stylize')} />
        </div>
        <div className="flex items-center gap-4">
            <div className="flex-grow"><Slider label="Weird (--w)" min={0} max={3000} step={1} value={Number(params.weird.value)} onChange={(e) => handleChange('weird', Number(e.target.value))} tooltip="Explora estéticas e composições incomuns." /></div>
            <Switch label="" checked={params.weird.active} onChange={() => handleToggle('weird')} />
        </div>
    </div>
  );
};