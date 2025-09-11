import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Character } from '@/types/character';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  character: Character;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, character, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const messageToSend = message;
    setMessage('');
    
    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      // Handle error sending message
    }
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: '📊', text: 'Como estou indo hoje?', label: 'Status' },
    { icon: '💪', text: 'Preciso de motivação!', label: 'Motivação' },
    { icon: '💡', text: 'Dicas para ser mais produtivo?', label: 'Dicas' },
    { icon: '➕', text: 'Crie uma tarefa: Estudar React por 2 horas', label: 'Criar Tarefa' },
    { icon: '📋', text: 'Mostre minhas tarefas pendentes', label: 'Ver Tarefas' },
  ];

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
      <div className="flex gap-2 mb-3">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Converse com ${character.name}...`}
          className="flex-1 bg-card border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-macos"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          size="icon"
          className="shadow-soft hover:shadow-medium transition-macos bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => setMessage(action.text)}
            className="text-xs bg-card/50 hover:bg-accent/80 border-border transition-macos"
            disabled={isLoading}
          >
            {action.icon} {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}