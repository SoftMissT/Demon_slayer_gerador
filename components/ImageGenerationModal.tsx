import React from 'react';
import { Modal } from './ui/Modal';
import { ImageGenerationPanel } from './ImageGenerationPanel';
import type { MidjourneyParameters, GptParameters } from '../types';

// These are default/placeholder values to satisfy the ImageGenerationPanel's props.
// The actual image generation for this modal relies primarily on the initial prompt.
const INITIAL_MJ_PARAMS: MidjourneyParameters = {
    aspectRatio: { active: false, value: '16:9' },
    chaos: { active: false, value: 10 },
    quality: { active: false, value: 1 },
    style: { active: false, value: '' },
    stylize: { active: false, value: 250 },
    version: { active: false, value: '6.0' },
    weird: { active: false, value: 250 },
};

const INITIAL_GPT_PARAMS: GptParameters = {
    tone: 'Cinematic', style: 'Concept Art', composition: 'Dynamic Angle'
};


interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
}

export const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({ isOpen, onClose, prompt }) => {
  if (!isOpen || !prompt) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerar Imagem a partir de Prompt" panelClassName="!max-w-2xl w-full">
      <div className="p-1 pt-4">
        <ImageGenerationPanel
          initialPrompt={prompt}
          mjParams={INITIAL_MJ_PARAMS}
          gptParams={INITIAL_GPT_PARAMS}
        />
      </div>
    </Modal>
  );
};