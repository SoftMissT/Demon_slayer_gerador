import React from 'react';
import type { GeminiParameters as GeminiParametersType } from '../types';
import { Select } from './ui/Select';
import { Switch } from './ui/Switch';

interface GeminiParametersProps {
    params: GeminiParametersType;
    onParamsChange: (params: GeminiParametersType) => void;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
}

export const GeminiParameters: React.FC<GeminiParametersProps> = ({ params, onParamsChange, enabled, onEnabledChange }) => {
    const handleChange = (field: keyof GeminiParametersType, value: any) => {
        onParamsChange({ ...params, [field]: value });
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white font-gangofthree">Parâmetros de Alquimia (Gemini)</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">Ativar</span>
                    <Switch
                        checked={enabled}
                        onChange={(e) => onEnabledChange(e.target.checked)}
                        aria-label="Ativar parâmetros do Gemini"
                    />
                </div>
            </div>
            <p className="text-sm text-gray-400">
                Diretrizes para criar um prompt narrativo e visual para o Gemini (Nano Banana).
            </p>
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-4 transition-opacity duration-300 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                 <Select
                    label="Estilo de Arte"
                    value={params.artStyle}
                    onChange={(e) => handleChange('artStyle', e.target.value)}
                    disabled={!enabled}
                >
                    <option value="fotografia">Fotografia</option>
                    <option value="pintura_oleo">Pintura a Óleo</option>
                    <option value="anime_manga">Anime/Mangá</option>
                    <option value="arte_conceitual">Arte Conceitual</option>
                    <option value="aquarela">Aquarela</option>
                    <option value="pixel_art">Pixel Art</option>
                </Select>
                 <Select
                    label="Iluminação"
                    value={params.lighting}
                    onChange={(e) => handleChange('lighting', e.target.value)}
                    disabled={!enabled}
                >
                    <option value="cinematica">Cinemática</option>
                    <option value="luz_suave">Luz Suave</option>
                    <option value="neon">Neon</option>
                    <option value="por_do_sol">Pôr do Sol</option>
                    <option value="dramatica">Dramática</option>
                    <option value="ambiente">Ambiente</option>
                </Select>

                <Select
                    label="Paleta de Cores"
                    value={params.colorPalette}
                    onChange={(e) => handleChange('colorPalette', e.target.value)}
                    disabled={!enabled}
                >
                    <option value="vibrante">Vibrante</option>
                    <option value="monocromatica">Monocromática</option>
                    <option value="tons_pastel">Tons Pastel</option>
                    <option value="sombria">Sombria</option>
                    <option value="quente">Quente</option>
                    <option value="fria">Fria</option>
                </Select>

                <Select
                    label="Composição"
                    value={params.composition}
                    onChange={(e) => handleChange('composition', e.target.value)}
                    disabled={!enabled}
                >
                    <option value="close_up">Close-up</option>
                    <option value="retrato">Retrato</option>
                    <option value="plano_medio">Plano Médio</option>
                    <option value="plano_aberto">Plano Aberto</option>
                    <option value="paisagem">Paisagem</option>
                </Select>
                
                 <Select
                    label="Nível de Detalhe"
                    value={params.detailLevel}
                    onChange={(e) => handleChange('detailLevel', e.target.value)}
                    disabled={!enabled}
                >
                    <option value="detalhado">Detalhado</option>
                    <option value="hiper_realista">Hiper-realista</option>
                    <option value="simplista">Simplista</option>
                    <option value="esbocado">Esboçado</option>
                </Select>
            </div>
        </div>
    );
};
