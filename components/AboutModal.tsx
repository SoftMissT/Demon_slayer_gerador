import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { HeartIcon } from './icons/HeartIcon';
import { aboutContent } from '../lib/aboutContent';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReadmeSection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div>
        <h3 className="text-lg font-bold text-indigo-400 mb-2 font-gangofthree">{title}</h3>
        <div 
            className="prose prose-sm prose-invert max-w-none text-gray-300 space-y-2"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }}
        />
    </div>
);


export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  // Extracting sections from the long readme text
  const readmeText = aboutContent.readme_long;
  const sections = readmeText.split('## ').slice(1).map(section => {
      const parts = section.split('\\n\\n');
      const title = parts[0].replace(/\\/g, '');
      const content = parts.slice(1).join('<br />').replace(/\\n/g, '<br />').replace(/\*   /g, '• ');
      return { title, content };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sobre a Forja de Lendas">
      <div className="max-h-[80vh] overflow-y-auto pr-4 -mr-4 text-gray-300 space-y-6">
        
        {sections.map(({title, content}) => (
            <div key={title}>
                 <h3 className="text-lg font-bold text-indigo-400 mb-2 font-gangofthree">{title}</h3>
                 <div className="text-sm text-gray-300 space-y-2" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        ))}
        
      </div>
    </Modal>
  );
};
