import { useRef, useEffect } from 'react';
import { Task, ProductivityStats } from '@/types/task';
import { useCharacterChat } from '@/hooks/useCharacterChat';
import { useUserSettings } from '@/hooks/useUserSettings';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

interface AIChatProps {
  tasks: Task[];
  stats: ProductivityStats;
  className?: string;
  userName?: string;
}

export function AIChat({ tasks, stats, className, userName }: AIChatProps) {
  const { getDisplayName } = useUserSettings();
  const displayName = userName || getDisplayName();
  const { chatHistory, isLoading, sendMessage, clearHistory, initializeChat, character } = useCharacterChat(tasks, stats, displayName);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Chat history management

  // Inicializar chat apenas uma vez
  useEffect(() => {
    if (character && chatHistory.length === 0) {
      // Initialize chat for character
      initializeChat();
    }
  }, [character?.id, chatHistory.length, initializeChat]); // Usar character.id para evitar re-renders

  // Auto-scroll para baixo quando há novas mensagens
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          // Força o scroll para o final
          scrollElement.scrollTop = scrollElement.scrollHeight;
          // Auto-scroll to bottom
        }
      }
    };

    // Scroll imediato e depois de um pequeno delay para garantir que o DOM foi atualizado
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [chatHistory]);

  return (
    <div className={`flex flex-col h-full bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-large overflow-hidden ${className}`}>
      <ChatHeader 
        character={character}
        onClearHistory={clearHistory}
      />

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="py-4 space-y-2">
          {chatHistory.length === 0 && (
            <div className="text-center text-muted-foreground py-12 animate-macos-fade-in">
              <div className="text-4xl mb-4">{character.emoji}</div>
              <p className="text-lg font-medium mb-2">Olá! Eu sou {character.name}</p>
              <p className="text-sm">Inicie uma conversa comigo! Posso te ajudar com tarefas, motivação e produtividade.</p>
            </div>
          )}
          
          {chatHistory.map((msg, index) => (
            <ChatMessage
              key={`${msg.id}-${index}`}
              message={msg}
              character={character}
              displayName={displayName}
            />
          ))}

          {isLoading && (
            <TypingIndicator character={character} />
          )}
        </div>
      </ScrollArea>

      <ChatInput
        onSendMessage={sendMessage}
        character={character}
        isLoading={isLoading}
      />
    </div>
  );
}