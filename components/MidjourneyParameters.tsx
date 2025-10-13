

import React from 'react';
import type { MidjourneyParameters, MidjourneyParam } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Switch } from './ui/Switch';
import { TextInput } from './ui/TextInput';

interface MidjourneyParametersProps {
  params: MidjourneyParameters;
  setParams: React.Dispatch<React.SetStateAction<MidjourneyParameters>>;
}

export const MidjourneyParametersComponent: React.FC<MidjourneyParametersProps> = ({ params, setParams }) => {
  const handleParamChange = (key: keyof MidjourneyParameters, value: string | number | boolean, field: 'value' | 'active' = 'value') => {
    setParams(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const aspectRatios = ["1:1", "2:3", "3:2", "4:5", "5:4", "16:9", "9:16"];
  const versions = ["6.0", "5.2", "5.1", "Niji 6", "Niji 5"];
  const styles = ["raw", "cute", "expressive", "scenic"];

  const descriptiveParams: (keyof MidjourneyParameters)[] = ['artStyle', 'lighting', 'colorPalette', 'composition', 'detailLevel'];

  return (
    <Card className="!p-4 model-midjourney">
      <h3 className="text-lg font-bold text-white font-gangofthree mb-4">Parâmetros Técnicos (Midjourney)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Technical Parameters */}
        <div className="space-y-4">
            <div>
                <Switch label="Aspect Ratio (--ar)" checked={params.aspectRatio.active} onChange={e => handleParamChange('aspectRatio', e.target.checked, 'active')} />
                {params.aspectRatio.active && (
                    <Select label="" value={params.aspectRatio.value as string} onChange={e => handleParamChange('aspectRatio', e.target.value)}>
                        {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </Select>
                )}
            </div>
             <div>
                <Switch label="Version (--v)" checked={params.version.active} onChange={e => handleParamChange('version', e.target.checked, 'active')} />
                {params.version.active && (
                    <Select label="" value={params.version.value as string} onChange={e => handleParamChange('version', e.target.value)}>
                        {versions.map(v => <option key={v} value={v}>{v}</option>)}
                    </Select>
                )}
            </div>
             <div>
                <Switch label="Style (--style)" checked={params.style.active} onChange={e => handleParamChange('style', e.target.checked, 'active')} />
                {params.style.active && (
                    <Select label="" value={params.style.value as string} onChange={e => handleParamChange('style', e.target.value)}>
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                )}
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <Switch label="Stylize (--s)" checked={params.stylize.active} onChange={e => handleParamChange('stylize', e.target.checked, 'active')} />
                {params.stylize.active && <Slider label="" value={Number(params.stylize.value)} onChange={e => handleParamChange('stylize', Number(e.target.value))} min={0} max={1000} step={50} tooltip="Quão artístico o Midjourney deve ser." />}
            </div>
            <div>
                <Switch label="Chaos (--c)" checked={params.chaos.active} onChange={e => handleParamChange('chaos', e.target.checked, 'active')} />
                {params.chaos.active && <Slider label="" value={Number(params.chaos.value)} onChange={e => handleParamChange('chaos', Number(e.target.value))} min={0} max={100} step={5} tooltip="Quão variado e inesperado o resultado será." />}
            </div>
             <div>
                <Switch label="Weird (--w)" checked={params.weird.active} onChange={e => handleParamChange('weird', e.target.checked, 'active')} />
                {params.weird.active && <Slider label="" value={Number(params.weird.value)} onChange={e => handleParamChange('weird', Number(e.target.value))} min={0} max={3000} step={100} tooltip="Introduz elementos bizarros e não convencionais." />}
            </div>
        </div>
        
        {/* Descriptive Parameters */}
        <div className="col-span-1 md:col-span-2 space-y-3 pt-3 border-t border-gray-700/50">
           <h4 className="text-base font-bold text-white mb-2">Parâmetros Descritivos</h4>
            {descriptiveParams.map(key => (
                 <div key={key}>
                    <Switch 
                        // FIX: Cast `key` to a string before calling `.replace()` to resolve a type error where `key` could be a number.
                        label={String(key).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                        checked={params[key].active} 
                        onChange={e => handleParamChange(key, e.target.checked, 'active')} 
                    />
                    {params[key].active && (
                        <TextInput 
                            label=""
                            value={params[key].value as string} 
                            onChange={e => handleParamChange(key, e.target.value)}
                            className="mt-1"
                        />
                    )}
                 </div>
            ))}
        </div>
      </div>
    </Card>
  );
};