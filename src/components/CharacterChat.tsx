import { useState, useRef, useEffect } from 'react';
import { Task, ProductivityStats } from '@/types/task';
import { useCharacterChat } from '@/hooks/useCharacterChat';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

interface CharacterChatProps {
  tasks: Task[];
  stats: ProductivityStats;
  className?: string;
}

export function CharacterChat({ tasks, stats, className }: CharacterChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getDisplayName } = useUserSettings();
  const displayName = getDisplayName();
  const { chatHistory, isLoading, sendMessage, clearHistory, initializeChat, character } = useCharacterChat(tasks, stats, displayName);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Inicializar chat na primeira abertura apenas uma vez
  useEffect(() => {
    if (isExpanded && character && chatHistory.length === 0) {
      initializeChat();
    }
  }, [isExpanded, character?.id, chatHistory.length, initializeChat]); // Usar character.id para evitar re-renders

  // Auto-scroll para baixo quando há novas mensagens
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory]);


  if (!isExpanded) {
    return (
      <div className={className}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-large bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 z-50 transition-macos hover:scale-110"
          size="lg"
        >
          <div className="text-3xl">{character.emoji}</div>
        </Button>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 h-[600px] shadow-large border-2 border-border/50 backdrop-blur-sm bg-background/95 z-50 overflow-hidden animate-macos-slide-up ${className}`}>
      <ChatHeader 
        character={character}
        onClearHistory={clearHistory}
        onMinimize={() => setIsExpanded(false)}
        showMinimize={true}
      />

      <CardContent className="flex flex-col h-[480px] p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="py-4 space-y-2">
            {chatHistory.length === 0 && (
              <div className="text-center text-muted-foreground py-8 animate-macos-fade-in">
                <div className="text-3xl mb-3">{character.emoji}</div>
                <p className="text-sm font-medium mb-1">Olá! Eu sou {character.name}</p>
                <p className="text-xs">Como posso te ajudar hoje?</p>
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
      </CardContent>
    </Card>
  );
}