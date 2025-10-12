
import React from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface ErrorDisplayProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorDetails: React.FC<{ message: string }> = ({ message }) => {
    let title = "Ocorreu um Erro Inesperado";
    let suggestion = "Por favor, tente novamente. Se o problema persistir, tente ajustar seus filtros ou recarregar a página.";
    let details = message;

    if (message.toLowerCase().includes('api key not valid')) {
        title = "Erro de Chave de API";
        suggestion = "A chave de API configurada para o Gemini é inválida. Verifique a variável de ambiente GEMINI_API_KEY nas configurações do seu projeto.";
        details = "A API do Google retornou um erro de autenticação.";
    } else if (message.toLowerCase().includes('servidor') || message.toLowerCase().includes('http error') || message.toLowerCase().includes('networkerror')) {
        title = "Falha na Comunicação com a API";
        suggestion = "Não foi possível conectar com o servidor de geração. Verifique sua conexão com a internet ou tente novamente mais tarde.";
    } else if (message.toLowerCase().includes('prompt') || message.toLowerCase().includes('filtros') || message.toLowerCase().includes('bad request')) {
        title = "Erro na Configuração da Geração";
        suggestion = "A combinação de filtros atual pode ter causado um problema. Tente simplificar a sua seleção ou alterar o tipo de geração.";
    } else if (message.toLowerCase().includes('imagem')) {
        title = "Falha ao Gerar Imagem";
        suggestion = "Houve um problema ao criar a imagem. Isso pode ser temporário. Tente gerar a imagem novamente.";
    }

    return (
        <>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm mt-1 text-red-300">{message}</p>
            <div className="mt-3 border-t border-red-800 pt-2">
                <p className="text-sm font-semibold">Sugestão:</p>
                <p className="text-sm">{suggestion}</p>
            </div>
        </>
    );
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg p-4 z-[999]">
      <div className="bg-red-900/80 backdrop-blur-sm border border-red-700 text-red-200 px-4 py-3 rounded-lg relative flex gap-4 shadow-2xl animate-fade-in-up" role="alert">
        <div className="flex-shrink-0 pt-1">
          <AlertTriangleIcon className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-grow">
          <ErrorDetails message={message} />
        </div>
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-300 hover:text-white"
          aria-label="Fechar alerta"
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
    </div>
  );
};
