import React from 'react';
// FIX: Corrected type import from the now separate types.ts file.
import type { MidjourneyParameters as MidjourneyParametersType, MidjourneyParameter } from '../types';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Checkbox } from './ui/Checkbox';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';

interface MidjourneyParametersProps {
    params: MidjourneyParametersType;
    onParamsChange: (params: MidjourneyParametersType) => void;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
}

const ParamRow: React.FC<{
    label: string;
    param: MidjourneyParameter<any>;
    onToggle: (active: boolean) => void;
    children: React.ReactNode;
    enabled: boolean;
}> = ({ label, param, onToggle, children, enabled }) => (
    <div className="flex items-center gap-4">
        <Checkbox
            label=""
            checked={param.active}
            onChange={(e) => onToggle(e.target.checked)}
            disabled={!enabled}
        />
        <div className={`flex-grow ${(!enabled || !param.active) ? 'opacity-50' : ''}`}>
            {children}
        </div>
    </div>
);


export const MidjourneyParameters: React.FC<MidjourneyParametersProps> = ({ params, onParamsChange, enabled, onEnabledChange }) => {
    const handleParamChange = <K extends keyof MidjourneyParametersType>(field: K, value: Partial<MidjourneyParametersType[K]>) => {
        onParamsChange({ 
            ...params, 
            [field]: { ...params[field], ...value } 
        });
    };
    
    const handleReset = () => {
        const resetParams = { ...params };
        for (const key in resetParams) {
            resetParams[key as keyof MidjourneyParametersType].active = false;
        }
        onParamsChange(resetParams);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white font-gangofthree">Parâmetros Midjourney</h3>
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">Ativar</span>
                    <Switch
                        checked={enabled}
                        onChange={(e) => onEnabledChange(e.target.checked)}
                        aria-label="Ativar parâmetros do Midjourney"
                    />
                </div>
            </div>
             <p className="text-sm text-gray-400">
                Ajuste os parâmetros para controlar o resultado no Midjourney.
            </p>
            
            <div className={`transition-opacity duration-300 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ParamRow label="Aspect Ratio" param={params.aspectRatio} onToggle={(active) => handleParamChange('aspectRatio', { active })} enabled={enabled}>
                         <Select
                            label="Aspect Ratio (--ar)"
                            value={params.aspectRatio.value}
                            onChange={(e) => handleParamChange('aspectRatio', { value: e.target.value })}
                            disabled={!params.aspectRatio.active || !enabled}
                        >
                            <option value="1:1">1:1 (Quadrado)</option>
                            <option value="16:9">16:9 (Paisagem)</option>
                            <option value="9:16">9:16 (Retrato)</option>
                             <option value="4:7">4:7 (Vertical)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </Select>
                    </ParamRow>
                     <ParamRow label="Versão" param={params.version} onToggle={(active) => handleParamChange('version', { active })} enabled={enabled}>
                        <Select
                            label="Versão do Modelo"
                            value={params.version.value}
                            onChange={(e) => handleParamChange('version', { value: e.target.value })}
                            disabled={!params.version.active || !enabled}
                        >
                            <option value="6">--v 6</option>
                            <option value="6.1">--v 6.1</option>
                            <option value="7">--v 7</option>
                            <option value="Niji 6">--niji 6</option>
                        </Select>
                    </ParamRow>
                     <ParamRow label="Estilo" param={params.style} onToggle={(active) => handleParamChange('style', { active })} enabled={enabled}>
                         <Select
                            label="Estilo (--style)"
                            value={params.style.value}
                            onChange={(e) => handleParamChange('style', { value: e.target.value })}
                            disabled={!params.style.active || !enabled}
                        >
                            <option value="raw">Raw</option>
                            <option value="cute">Cute</option>
                            <option value="scenic">Scenic</option>
                            <option value="original">Original</option>
                        </Select>
                    </ParamRow>
                    <ParamRow label="Chaos" param={params.chaos} onToggle={(active) => handleParamChange('chaos', { active })} enabled={enabled}>
                        <Slider
                            label="Chaos (--c)"
                            min={0} max={100} step={1}
                            value={params.chaos.value}
                            onChange={(e) => handleParamChange('chaos', { value: parseInt(e.target.value) })}
                             disabled={!params.chaos.active || !enabled}
                        />
                    </ParamRow>
                     <ParamRow label="Stylize" param={params.stylize} onToggle={(active) => handleParamChange('stylize', { active })} enabled={enabled}>
                         <Slider
                            label="Stylize (--s)"
                            min={0} max={1000} step={1}
                            value={params.stylize.value}
                            onChange={(e) => handleParamChange('stylize', { value: parseInt(e.target.value) })}
                            disabled={!params.stylize.active || !enabled}
                        />
                    </ParamRow>
                    <ParamRow label="Qualidade" param={params.quality} onToggle={(active) => handleParamChange('quality', { active })} enabled={enabled}>
                        <Slider
                            label="Qualidade (--q)"
                            min={0.25} max={1} step={0.25}
                            value={params.quality.value}
                            onChange={(e) => handleParamChange('quality', { value: parseFloat(e.target.value) })}
                            disabled={!params.quality.active || !enabled}
                        />
                    </ParamRow>
                     <ParamRow label="Weird" param={params.weird} onToggle={(active) => handleParamChange('weird', { active })} enabled={enabled}>
                         <Slider
                            label="Weird (--w)"
                            min={0} max={3000} step={50}
                            value={params.weird.value}
                            onChange={(e) => handleParamChange('weird', { value: parseInt(e.target.value) })}
                            disabled={!params.weird.active || !enabled}
                        />
                    </ParamRow>
                </div>
                <div className="mt-6">
                    <Button variant="secondary" size="sm" onClick={handleReset} disabled={!enabled}>Resetar Parâmetros</Button>
                </div>
            </div>
        </div>
    );
};