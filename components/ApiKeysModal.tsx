
import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import useLocalStorage from '../hooks/useLocalStorage';
import type { ApiKeys } from '../types';

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeysModal: React.FC<ApiKeysModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useLocalStorage<ApiKeys>('kimetsu-forge-api-keys', { gemini: '', openai: '', deepseek: '' });
  const [localKeys, setLocalKeys] = useState(keys);

  useEffect(() => {
    if (isOpen) {
        setLocalKeys(keys);
    }
  }, [isOpen, keys]);

  const handleSave = () => {
    setKeys(localKeys);
    onClose();
  };
  
  const handleClear = () => {
      const cleared = { gemini: '', openai: '', deepseek: '' };
      setLocalKeys(cleared);
      setKeys(cleared);
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
       <div className="api-keys-chat-container -m-6">
            <div className="nav-bar">
                <a>Gerenciar Chaves de API</a>
                <div className="close" onClick={onClose}>
                    <div className="line one"></div>
                    <div className="line two"></div>
                </div>
            </div>
            <div className="messages-area">
                <div className="message-bubble bot-message">
                    Olá! Você pode optar por usar suas próprias chaves de API. Elas serão salvas <strong>apenas no seu navegador</strong> e nunca em nossos servidores.
                </div>
                 <div className="message-bubble bot-message">
                    Isso pode ser útil se você tiver seus próprios limites de uso ou preferir não usar as chaves da aplicação. Preencha os campos abaixo.
                </div>
            </div>
            <div className="sender-area">
                <div className="w-full space-y-3 px-4">
                    <div>
                        <label className="text-xs text-gray-400">Google Gemini (API_KEY)</label>
                        <input
                            type="password"
                            placeholder="Cole sua chave Gemini aqui..."
                            className="api-key-input"
                            value={localKeys.gemini}
                            onChange={(e) => setLocalKeys(k => ({...k, gemini: e.target.value}))}
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">OpenAI (GPT-4o)</label>
                        <input
                            type="password"
                            placeholder="Cole sua chave OpenAI aqui..."
                            className="api-key-input"
                            value={localKeys.openai}
                            onChange={(e) => setLocalKeys(k => ({...k, openai: e.target.value}))}
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">DeepSeek</label>
                        <input
                            type="password"
                            placeholder="Cole sua chave DeepSeek aqui..."
                            className="api-key-input"
                            value={localKeys.deepseek}
                            onChange={(e) => setLocalKeys(k => ({...k, deepseek: e.target.value}))}
                        />
                    </div>
                </div>
                 <div className="flex w-full justify-between mt-4 px-4 pb-2">
                    <Button variant="danger" size="sm" onClick={handleClear}>Usar Chaves Padrão</Button>
                    <Button variant="primary" size="sm" onClick={handleSave}>Salvar Chaves</Button>
                </div>
            </div>
        </div>
    </Modal>
  );
};
