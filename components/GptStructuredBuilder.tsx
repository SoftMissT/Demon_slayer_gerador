import React from 'react';
import type { GptParameters } from '../types';
import { Select } from './ui/Select';
import { Switch } from './ui/Switch';
import { AnimatePresence, motion } from 'framer-motion';

interface GptStructuredBuilderProps {
    params: GptParameters;
    onParamsChange: (params: GptParameters) => void;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
}

export const GptStructuredBuilder: React.FC<GptStructuredBuilderProps> = ({ params, onParamsChange, enabled, onEnabledChange }) => {
    const handleChange = (field: keyof GptParameters, value: any) => {
        onParamsChange({ ...params, [field]: value });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white font-gangofthree">Parâmetros Estruturados (GPT/DALL-E)</h3>
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-300">Ativar</span>
                    <Switch
                        checked={enabled}
                        onChange={(e) => onEnabledChange(e.target.checked)}
                        aria-label="Ativar parâmetros do GPT/DALL-E"
                    />
                </div>
            </div>
            <p className="text-sm text-gray-400">
                Estes parâmetros ajudam a IA a construir um prompt mais rico e detalhado para modelos como DALL-E 3, que respondem bem a descrições em linguagem natural.
            </p>
            <AnimatePresence initial={false}>
                {enabled && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto', marginTop: '16px' },
                            collapsed: { opacity: 0, height: 0, marginTop: '0px' }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            <Select
                                label="Tom / Atmosfera"
                                value={params.tone}
                                onChange={(e) => handleChange('tone', e.target.value)}
                                disabled={!enabled}
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
                                disabled={!enabled}
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
                                disabled={!enabled}
                            >
                                <option value="close_up">Close-up</option>
                                <option value="full_shot">Corpo Inteiro</option>
                                <option value="wide_shot">Plano Aberto</option>
                                <option value="dynamic_angle">Ângulo Dinâmico</option>
                                <option value="from_above">De Cima</option>
                            </Select>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};