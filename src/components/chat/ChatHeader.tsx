import { Button } from '@/components/ui/button';
import { Trash2, Minimize2 } from 'lucide-react';
import { Character } from '@/types/character';

interface ChatHeaderProps {
  character: Character;
  onClearHistory: () => void;
  onMinimize?: () => void;
  showMinimize?: boolean;
}

export function ChatHeader({ character, onClearHistory, onMinimize, showMinimize }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-2xl border border-primary/10 shadow-soft">
          {character.emoji}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{character.name}</h3>
          <p className="text-sm text-muted-foreground">Seu assistente pessoal</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-macos"
          title="Limpar histórico"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        {showMinimize && onMinimize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="h-9 w-9 p-0 hover:bg-accent transition-macos"
            title="Minimizar"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}