import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChatMessage as ChatMessageType } from '@/services/aiService';
import { Character } from '@/types/character';

interface ChatMessageProps {
  message: ChatMessageType;
  character: Character;
  displayName?: string;
}

export function ChatMessage({ message, character, displayName }: ChatMessageProps) {
  console.log('=== RENDERIZANDO MENSAGEM ===');
  console.log('Tipo:', message.isUser ? 'USUÁRIO' : 'IA');
  console.log('Conteúdo:', message.content);
  console.log('ID:', message.id);
  console.log('Timestamp:', message.timestamp);
  
  return (
    <div className={`flex gap-3 w-full mb-4 animate-macos-fade-in ${
      message.isUser ? 'justify-end' : 'justify-start'
    }`}
    style={{ minHeight: '60px' }} // Garantir altura mínima para visibilidade
    >
      {!message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-xl border border-primary/10 shadow-soft">
            {character.emoji}
          </div>
        </div>
      )}
      
      <div className={`max-w-[75%] flex flex-col ${
        message.isUser ? 'items-end' : 'items-start'
      }`}>
        <div className={`p-4 rounded-2xl shadow-soft transition-macos border-2 ${
          message.isUser
            ? 'bg-primary text-primary-foreground ml-auto rounded-br-md border-primary/30'
            : 'bg-card border border-border mr-auto rounded-bl-md'
        }`}
        style={{ 
          minWidth: '60px',
          maxWidth: '100%',
          wordBreak: 'break-word'
        }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
            {message.content}
          </p>
        </div>
        
        <div className={`flex items-center gap-2 mt-1 px-2 ${
          message.isUser ? 'flex-row-reverse' : 'flex-row'
        }`}>
          {message.isUser && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
              {displayName ? displayName.charAt(0).toUpperCase() : 'EU'}
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </span>
        </div>
      </div>

      {message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-soft">
            {displayName ? displayName.charAt(0).toUpperCase() : 'EU'}
          </div>
        </div>
      )}
    </div>
  );
}