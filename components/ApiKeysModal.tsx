import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { ApiKeys } from '../App';
import { validateAllApiKeys } from '../lib/client/validationService';
import { Spinner } from './ui/Spinner';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    content: React.ReactNode;
}

type ChatStep = 'welcome' | 'gemini' | 'openai' | 'deepseek' | 'validating' | 'done';

const PLACEHOLDERS: Record<ChatStep, string> = {
    welcome: 'Aguardando instruções...',
    gemini: 'Cole sua chave do Google Gemini aqui...',
    openai: 'Cole sua chave da OpenAI aqui...',
    deepseek: 'Cole sua chave da DeepSeek aqui...',
    validating: 'Validando chaves...',
    done: 'Configuração concluída!'
};

const openLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

export const ApiKeysModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (keys: ApiKeys) => void;
    currentKeys: ApiKeys;
}> = ({ isOpen, onClose, onSave, currentKeys }) => {
    const [step, setStep] = useState<ChatStep>('welcome');
    const [keys, setKeys] = useState<ApiKeys>({ gemini: '', openai: '', deepseek: '' });
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [isWaitingForSecret, setIsWaitingForSecret] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen) {
            setKeys(currentKeys);
            setInputValue('');
            setIsWaitingForSecret(false);
            
            const initialMessages: Message[] = [
                { id: 1, sender: 'bot', content: (
                    <span>
                        Olá! 🤖 Para forjar lendas, preciso das suas chaves de API. Elas são salvas <strong>apenas no seu navegador.</strong>
                    </span>
                )},
                { id: 2, sender: 'bot', content: (
                    <span>
                        Vamos começar. Por favor, cole sua chave do <strong>Google Gemini</strong>.
                        <br />
                        <button onClick={() => openLink('https://aistudio.google.com/app/apikey')} className="text-xs text-indigo-400 hover:underline mt-1">
                            (Não tem uma? Obtenha aqui)
                        </button>
                    </span>
                )}
            ];
            
            setMessages(initialMessages);
            setStep('gemini');
        } else {
            // Reset state when modal is closed
            setMessages([]);
            setStep('welcome');
            setIsWaitingForSecret(false);
        }
    }, [isOpen, currentKeys]);

    const addMessage = (sender: 'bot' | 'user', content: React.ReactNode) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, content }]);
    };
    
    const handleSend = async () => {
        if (!inputValue.trim() || step === 'done' || step === 'welcome' || isValidating) return;

        // --- Developer Override Flow ---
        const DEV_OVERRIDE_CODE = "forge_master_key_2025";
        const DEV_SECRET_PHRASE = process.env.NEXT_PUBLIC_DEV_SECRET_PHRASE;

        if (isWaitingForSecret) {
            if (inputValue.trim() === DEV_SECRET_PHRASE) {
                const devKeys: ApiKeys = {
                    gemini: process.env.NEXT_PUBLIC_DEV_GEMINI_KEY || '',
                    openai: process.env.NEXT_PUBLIC_DEV_OPENAI_KEY || '',
                    deepseek: process.env.NEXT_PUBLIC_DEV_DEEPSEEK_KEY || '',
                };
                onSave(devKeys);
                onClose();
            } else {
                addMessage('user', <code>Senha incorreta.</code>);
                addMessage('bot', <span className="text-red-400">❌ Senha secreta inválida. O processo foi reiniciado.</span>);
                setIsWaitingForSecret(false);
                // Reset to the beginning of the normal flow
                setTimeout(() => addMessage('bot', "Vamos tentar de novo. Por favor, insira sua chave do Google Gemini."), 500);
                setStep('gemini');
            }
            setInputValue('');
            return;
        }

        if (inputValue.trim() === DEV_OVERRIDE_CODE) {
             if (DEV_SECRET_PHRASE) {
                addMessage('user', <code>{DEV_OVERRIDE_CODE}</code>);
                addMessage('bot', "🔑 Código mestre recebido. Por favor, insira a senha de desenvolvimento para continuar.");
                setIsWaitingForSecret(true);
             }
             // Silently fail if the phrase is not set, to not expose the feature to regular users.
             setInputValue('');
             return;
        }
        // --- End Developer Override Flow ---
        
        const keyEntered = `****${inputValue.slice(-4)}`;
        addMessage('user', <code>{keyEntered}</code>);
        
        let nextStep: ChatStep = step;
        const newKeys = { ...keys };

        if (step === 'gemini') {
            newKeys.gemini = inputValue.trim();
            setTimeout(() => addMessage('bot', (
                 <span>
                    Ótimo! ✅ Agora, por favor, cole sua chave da <strong>OpenAI (GPT-4o)</strong>.
                    <br />
                    <button onClick={() => openLink('https://platform.openai.com/api-keys')} className="text-xs text-indigo-400 hover:underline mt-1">
                        (Obtenha aqui)
                    </button>
                </span>
            )), 500);
            nextStep = 'openai';
        } else if (step === 'openai') {
            newKeys.openai = inputValue.trim();
            setTimeout(() => addMessage('bot', (
                 <span>
                    Perfeito! ✨ Só falta mais uma. Cole sua chave da <strong>DeepSeek</strong>.
                    <br />
                    <button onClick={() => openLink('https://platform.deepseek.com/api_keys')} className="text-xs text-indigo-400 hover:underline mt-1">
                        (Obtenha aqui)
                    </button>
                </span>
            )), 500);
            nextStep = 'deepseek';
        } else if (step === 'deepseek') {
            const finalKeys = { ...newKeys, deepseek: inputValue.trim() };
            setKeys(finalKeys);
            setInputValue('');
            setStep('validating');
            setIsValidating(true);
            addMessage('bot', <div className="flex items-center gap-2"><Spinner size="sm" /><span>Validando chaves...</span></div>);

            const validationResult = await validateAllApiKeys(finalKeys);

            setIsValidating(false);

            if (validationResult.errors.length > 0) {
                const firstError = validationResult.errors[0];
                addMessage('bot', <span className="text-red-400">❌ Parece que a chave para <strong>{firstError}</strong> é inválida. Vamos tentar novamente.</span>);
                
                const updatedKeys = { ...finalKeys };
                let resetStep: ChatStep = 'gemini';
                
                if (firstError === 'Google Gemini') {
                    updatedKeys.gemini = '';
                    resetStep = 'gemini';
                    setTimeout(() => addMessage('bot', "Por favor, insira sua chave do Google Gemini novamente."), 500);
                } else if (firstError === 'OpenAI') {
                    updatedKeys.openai = '';
                    resetStep = 'openai';
                     setTimeout(() => addMessage('bot', "Por favor, insira sua chave da OpenAI novamente."), 500);
                } else if (firstError === 'DeepSeek') {
                    updatedKeys.deepseek = '';
                    resetStep = 'deepseek';
                     setTimeout(() => addMessage('bot', "Por favor, insira sua chave da DeepSeek novamente."), 500);
                }
                setKeys(updatedKeys);
                setStep(resetStep);
                return; // Prevent state update at the end
            } else {
                addMessage('bot', "Tudo pronto! 🚀 Suas chaves foram validadas. Clique em 'Salvar e Fechar' para começar a forjar!");
                setStep('done');
            }
            // Handled logic inside, just return
            return;
        }

        setKeys(newKeys);
        setStep(nextStep);
        setInputValue('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };
    
    const handleSaveAndClose = () => {
        onSave(keys);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} panelClassName="!p-0 !bg-transparent border-0">
            <div className="api-keys-chat-container">
                <div className="nav-bar">
                    <a>Configuração de Chaves de API</a>
                    <div className="close" onClick={onClose}>
                        <div className="line one"></div>
                        <div className="line two"></div>
                    </div>
                </div>
                <div className="messages-area">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message-bubble ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                            {msg.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="sender-area">
                    {isValidating ? (
                         <div className="flex items-center justify-center h-full w-[95%] text-gray-400">
                            <Spinner size="sm" />
                            <span className="ml-2">Validando...</span>
                        </div>
                    ) : step === 'done' ? (
                        <Button onClick={handleSaveAndClose} className="w-[95%]">
                           Salvar e Fechar
                        </Button>
                    ) : (
                        <div className="input-place">
                            <input
                                type={isWaitingForSecret ? 'text' : 'password'}
                                className="send-input"
                                placeholder={isWaitingForSecret ? 'Digite a senha...' : PLACEHOLDERS[step]}
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={step === 'welcome' || isValidating}
                                autoFocus
                            />
                            <div className="send" onClick={handleSend}>
                                <svg className="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve">
                                    <g><g><path fill="#6B6C7B" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.107,8.091c-14.042,12.136-20.26,30.342-15.908,48.016 l35.631,146.128L33.03,387.218c-4.352,17.674,1.866,35.88,15.908,48.016c14.042,12.136,33.703,15.313,51.107,8.091 l413.094-171.411c16.529-6.866,27.93-22.943,28.492-41.22C510.02,232.747,498.036,217.202,481.508,210.336z"></path></g></g>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};