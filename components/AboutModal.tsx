// FIX: Implemented the AboutModal component to resolve placeholder errors. This component now renders the content from `lib/aboutContent.ts` inside a modal dialog, providing users with information about the application.
import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { HeartIcon } from './icons/HeartIcon';
import { aboutContent } from '../lib/aboutContent';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={aboutContent.title}>
      <div className="max-h-[80vh] overflow-y-auto pr-4 -mr-4 text-gray-300 space-y-6">
        <p className="text-gray-300">{aboutContent.introduction}</p>

        {aboutContent.sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-lg font-bold text-indigo-400 mb-2 font-gangofthree">{section.title}</h3>
            <div className="space-y-3 pl-2 border-l-2 border-gray-700">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {'heading' in item && <h4 className="font-semibold text-white">{item.heading}</h4>}
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="border-t border-gray-700 pt-4 mt-4">
             <h3 className="text-lg font-bold text-indigo-400 mb-2 font-gangofthree">{aboutContent.support.title}</h3>
             <p className="text-sm text-gray-400 mb-4">{aboutContent.support.text}</p>
             <Button 
                onClick={() => window.open('https://github.com/sponsors', '_blank')} 
                className="w-full"
            >
                <HeartIcon className="w-5 h-5" />
                <span>Apoiar no GitHub</span>
            </Button>
        </div>

      </div>
    </Modal>
  );
};