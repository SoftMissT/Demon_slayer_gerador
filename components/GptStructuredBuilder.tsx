// FIX: Create content for GptStructuredBuilder.tsx to resolve placeholder issues.
import React from 'react';
import type { GptParameters } from '../types';
import { Select } from './ui/Select';

interface GptStructuredBuilderProps {
    params: GptParameters;
    onParamsChange: (params: GptParameters) => void;
}

export const GptStructuredBuilder: React.FC<GptStructuredBuilderProps> = ({ params, onParamsChange }) => {
    const handleChange = (field: keyof GptParameters, value: any) => {
        onParamsChange({ ...params, [field]: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-gangofthree">Parâmetros Estruturados (GPT/DALL-E)</h3>
            <p className="text-sm text-gray-400">
                Estes parâmetros ajudam a IA a construir um prompt mais rico e detalhado para modelos como DALL-E 3, que respondem bem a descrições em linguagem natural.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Select
                    label="Tom / Atmosfera"
                    value={params.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                >
                    <option value="cinematic">Cinemático</option>
                    <option value="dark_fantasy">Fantasia Sombria</option>
                    <option value="anime">Anime</option>
                    <option value="epic">Épico</option>
                    <option value="minimalist">Minimalista</option>
                    <option value="vivid">Vívido</option>
                </Select>

                <Select
                    label="Estilo de Arte"
                    value={params.style}
                    onChange={(e) => handleChange('style', e.target.value)}
                >
                     <option value="illustration">Ilustração</option>
                    <option value="concept_art">Arte Conceitual</option>
                    <option value="digital_painting">Pintura Digital</option>
                    <option value="photorealistic">Fotorrealista</option>
                    <option value="3d_render">Render 3D</option>
                </Select>

                <Select
                    label="Composição / Ângulo"
                    value={params.composition}
                    onChange={(e) => handleChange('composition', e.target.value)}
                >
                    <option value="close_up">Close-up</option>
                    <option value="full_shot">Corpo Inteiro</option>
                    <option value="wide_shot">Plano Aberto</option>
                    <option value="dynamic_angle">Ângulo Dinâmico</option>
                    <option value="from_above">De Cima</option>
                </Select>
            </div>
        </div>
    );
};
