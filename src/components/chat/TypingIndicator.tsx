import { Character } from '@/types/character';

interface TypingIndicatorProps {
  character: Character;
}

export function TypingIndicator({ character }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 mb-4 animate-macos-fade-in">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-xl border border-primary/10 shadow-soft">
          {character.emoji}
        </div>
      </div>
      
      <div className="bg-card border border-border p-4 rounded-2xl rounded-bl-md shadow-soft">
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
            style={{animationDelay: '0ms'}}
          />
          <div 
            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
            style={{animationDelay: '150ms'}}
          />
          <div 
            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
            style={{animationDelay: '300ms'}}
          />
        </div>
      </div>
    </div>
  );
}