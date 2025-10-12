import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { PotionIcon } from './icons/PotionIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { Tooltip } from './ui/Tooltip';

interface ImageGenerationPanelProps {
    initialPrompt: string;
}

export const ImageGenerationPanel: React.FC<ImageGenerationPanelProps> = ({ initialPrompt }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPrompt(initialPrompt);
        setImageData(null); // Reset image when prompt changes
    }, [initialPrompt]);
    
    const handleGenerateImage = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/generateImage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao gerar a imagem.');
            }
            const data = await response.json();
            setImageData(data.base64Image);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="prompt-card flex flex-col !p-4 h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-white font-gangofthree">Gerador de Imagem</h3>
            </div>
            
            <div className="flex-grow flex flex-col justify-between space-y-4">
                 <div className="flex-grow flex items-center justify-center bg-gray-900/50 rounded-md overflow-hidden relative">
                    {isLoading ? (
                        <AlchemyLoadingIndicator />
                    ) : imageData ? (
                        <>
                            <img 
                                src={`data:image/jpeg;base64,${imageData}`} 
                                alt="Imagem gerada pela IA" 
                                className="object-contain w-full h-full"
                            />
                            <Tooltip text="Baixar Imagem">
                                <a 
                                    href={`data:image/jpeg;base64,${imageData}`} 
                                    download={`kimetsu-forge-${Date.now()}.jpg`}
                                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </a>
                            </Tooltip>
                        </>
                    ) : (
                        <div className="text-center text-gray-500">
                             <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>A imagem gerada aparecerá aqui.</p>
                        </div>
                    )}
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva a imagem que você quer criar..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white text-sm resize-none font-mono"
                    rows={4}
                    disabled={isLoading}
                />
               
                <Button 
                    onClick={handleGenerateImage} 
                    disabled={isLoading || !prompt.trim()} 
                    className="alchemist-button w-full"
                >
                    <PotionIcon className="w-5 h-5" />
                    {isLoading ? 'Gerando Imagem...' : 'Gerar Imagem'}
                </Button>
            </div>
            
             {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
        </Card>
    );
};
