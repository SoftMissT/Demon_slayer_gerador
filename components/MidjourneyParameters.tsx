import React from 'react';
import type { MidjourneyParameters as MidjourneyParametersType } from '../types';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';
import { AnimatePresence, motion } from 'framer-motion';

interface MidjourneyParametersProps {
    params: MidjourneyParametersType;
    onParamsChange: (params: MidjourneyParametersType) => void;
    enabled: boolean;
    onEnabledChange: (enabled: boolean) => void;
}

const ParameterControl: React.FC<{
    label: string;
    paramKey: keyof MidjourneyParametersType;
    params: MidjourneyParametersType;
    onParamsChange: (params: MidjourneyParametersType) => void;
    enabled: boolean;
    children: React.ReactNode;
}> = ({ label, paramKey, params, onParamsChange, enabled, children }) => {
    const param = params[paramKey];

    const handleParamChange = (value: Partial<typeof param>) => {
        onParamsChange({
            ...params,
            [paramKey]: { ...params[paramKey], ...value }
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-400">{label}</label>
                <Switch
                    checked={param.active}
                    onChange={(e) => handleParamChange({ active: e.target.checked })}
                    disabled={!enabled}
                />
            </div>
            <div className={`${(!enabled || !param.active) ? 'opacity-50' : ''}`}>
                {React.cloneElement(children as React.ReactElement<any>, { disabled: !param.active || !enabled })}
            </div>
        </div>
    );
}

export const MidjourneyParameters: React.FC<MidjourneyParametersProps> = ({ params, onParamsChange, enabled, onEnabledChange }) => {

    const handleReset = () => {
        onParamsChange({
            aspectRatio: { ...params.aspectRatio, active: false },
            version: { ...params.version, active: false },
            style: { ...params.style, active: false },
            stylize: { ...params.stylize, active: false },
            chaos: { ...params.chaos, active: false },
            quality: { ...params.quality, active: false },
            weird: { ...params.weird, active: false },
            artStyle: { ...params.artStyle, active: false },
            lighting: { ...params.lighting, active: false },
            colorPalette: { ...params.colorPalette, active: false },
            composition: { ...params.composition, active: false },
            detailLevel: { ...params.detailLevel, active: false },
        });
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
            
            <AnimatePresence initial={false}>
                {enabled && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="border-b border-gray-700/50 pb-4 mb-4">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Parâmetros Descritivos</h4>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4">
                                <ParameterControl label="Estilo de Arte" paramKey="artStyle" {...{ params, onParamsChange, enabled }}>
                                    <Select label="" value={params.artStyle.value} onChange={(e) => onParamsChange({ ...params, artStyle: { ...params.artStyle, value: e.target.value }})}>
                                        <option value="anime_manga">Anime/Mangá</option>
                                        <option value="arte_conceitual">Arte Conceitual</option>
                                        <option value="photorealistic">Fotorrealista</option>
                                        <option value="pintura_oleo">Pintura a Óleo</option>
                                        <option value="illustration">Ilustração</option>
                                        <option value="3d_render">Render 3D</option>
                                        <option value="aquarela">Aquarela</option>
                                        <option value="pixel_art">Pixel Art</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Iluminação" paramKey="lighting" {...{ params, onParamsChange, enabled }}>
                                    <Select label="" value={params.lighting.value} onChange={(e) => onParamsChange({ ...params, lighting: { ...params.lighting, value: e.target.value }})}>
                                        <option value="cinematica">Cinemática</option>
                                        <option value="dramatica">Dramática</option>
                                        <option value="luz_suave">Luz Suave</option>
                                        <option value="neon">Neon</option>
                                        <option value="por_do_sol">Pôr do Sol</option>
                                        <option value="ambiente">Ambiente</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Paleta de Cores" paramKey="colorPalette" {...{ params, onParamsChange, enabled }}>
                                    <Select label="" value={params.colorPalette.value} onChange={(e) => onParamsChange({ ...params, colorPalette: { ...params.colorPalette, value: e.target.value }})}>
                                        <option value="vibrante">Vibrante</option>
                                        <option value="sombria">Sombria</option>
                                        <option value="monocromatica">Monocromática</option>
                                        <option value="tons_pastel">Tons Pastel</option>
                                        <option value="quente">Quente</option>
                                        <option value="fria">Fria</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Composição" paramKey="composition" {...{ params, onParamsChange, enabled }}>
                                    <Select label="" value={params.composition.value} onChange={(e) => onParamsChange({ ...params, composition: { ...params.composition, value: e.target.value }})}>
                                        <option value="retrato">Retrato</option>
                                        <option value="close_up">Close-up</option>
                                        <option value="plano_medio">Plano Médio</option>
                                        <option value="full_shot">Corpo Inteiro</option>
                                        <option value="wide_shot">Plano Aberto</option>
                                        <option value="paisagem">Paisagem</option>
                                        <option value="dynamic_angle">Ângulo Dinâmico</option>
                                    </Select>
                                </ParameterControl>
                                <div className="xl:col-span-2">
                                    <ParameterControl label="Nível de Detalhe" paramKey="detailLevel" {...{ params, onParamsChange, enabled }}>
                                        <Select label="" value={params.detailLevel.value} onChange={(e) => onParamsChange({ ...params, detailLevel: { ...params.detailLevel, value: e.target.value }})}>
                                            <option value="detalhado">Detalhado</option>
                                            <option value="hiper_realista">Hiper-realista</option>
                                            <option value="simplista">Simplista</option>
                                            <option value="esbocado">Esboçado</option>
                                        </Select>
                                    </ParameterControl>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3">Parâmetros Técnicos</h4>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4">
                                <ParameterControl label="Aspect Ratio (--ar)" paramKey="aspectRatio" {...{ params, onParamsChange, enabled }}>
                                    <Select
                                        label=""
                                        value={params.aspectRatio.value}
                                        onChange={(e) => onParamsChange({ ...params, aspectRatio: { ...params.aspectRatio, value: e.target.value } })}
                                    >
                                        <option value="1:1">1:1 (Quadrado)</option>
                                        <option value="16:9">16:9 (Paisagem)</option>
                                        <option value="9:16">9:16 (Retrato)</option>
                                        <option value="4:7">4:7 (Vertical)</option>
                                        <option value="4:3">4:3</option>
                                        <option value="3:4">3:4</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Versão do Modelo" paramKey="version" {...{ params, onParamsChange, enabled }}>
                                    <Select
                                        label=""
                                        value={params.version.value}
                                        onChange={(e) => onParamsChange({ ...params, version: { ...params.version, value: e.target.value } })}
                                    >
                                        <option value="7">--v 7</option>
                                        <option value="6.1">--v 6.1</option>
                                        <option value="6">--v 6</option>
                                        <option value="Niji 6">--niji 6</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Estilo (--style)" paramKey="style" {...{ params, onParamsChange, enabled }}>
                                    <Select
                                        label=""
                                        value={params.style.value}
                                        onChange={(e) => onParamsChange({ ...params, style: { ...params.style, value: e.target.value } })}
                                    >
                                        <option value="raw">Raw</option>
                                        <option value="cute">Cute</option>
                                        <option value="scenic">Scenic</option>
                                        <option value="original">Original</option>
                                    </Select>
                                </ParameterControl>
                                <ParameterControl label="Chaos (--c)" paramKey="chaos" {...{ params, onParamsChange, enabled }}>
                                    <Slider
                                        label=""
                                        min={0} max={100} step={1}
                                        value={params.chaos.value}
                                        onChange={(e) => onParamsChange({ ...params, chaos: { ...params.chaos, value: parseInt(e.target.value) } })}
                                    />
                                </ParameterControl>
                                <ParameterControl label="Stylize (--s)" paramKey="stylize" {...{ params, onParamsChange, enabled }}>
                                    <Slider
                                        label=""
                                        min={0} max={1000} step={1}
                                        value={params.stylize.value}
                                        onChange={(e) => onParamsChange({ ...params, stylize: { ...params.stylize, value: parseInt(e.target.value) } })}
                                    />
                                </ParameterControl>
                                <ParameterControl label="Qualidade (--q)" paramKey="quality" {...{ params, onParamsChange, enabled }}>
                                    <Slider
                                        label=""
                                        min={0.25} max={1} step={0.25}
                                        value={params.quality.value}
                                        onChange={(e) => onParamsChange({ ...params, quality: { ...params.quality, value: parseFloat(e.target.value) } })}
                                    />
                                </ParameterControl>
                                <ParameterControl label="Weird (--w)" paramKey="weird" {...{ params, onParamsChange, enabled }}>
                                    <Slider
                                        label=""
                                        min={0} max={3000} step={50}
                                        value={params.weird.value}
                                        onChange={(e) => onParamsChange({ ...params, weird: { ...params.weird, value: parseInt(e.target.value) } })}
                                    />
                                </ParameterControl>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button variant="secondary" size="sm" onClick={handleReset} disabled={!enabled}>Resetar Parâmetros</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};