import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AVAILABLE_CHARACTERS, Character } from '@/types/character';
import { 
  Target, 
  ClipboardList, 
  FlaskConical, 
  Gamepad2, 
  Microscope, 
  Search, 
  Zap, 
  BookOpen, 
  Scale, 
  Wine 
} from 'lucide-react';

// Mapeamento de ícones para cada personagem
const CHARACTER_ICONS: Record<string, any> = {
  ayanokoji: Target,
  light: ClipboardList,
  senku: FlaskConical,
  shikamaru: Gamepad2,
  kurisu: Microscope,
  sherlock: Search,
  tony: Zap,
  hermione: BookOpen,
  saul: Scale,
  tyrion: Wine
};

interface CharacterSelectorProps {
  selectedCharacterId: string;
  onCharacterSelect: (characterId: string) => void;
}

export function CharacterSelector({ selectedCharacterId, onCharacterSelect }: CharacterSelectorProps) {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {AVAILABLE_CHARACTERS.map((character) => (
          <Card
            key={character.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedCharacterId === character.id
                ? 'ring-2 ring-primary shadow-lg scale-105'
                : 'hover:ring-1 hover:ring-primary/50'
            }`}
            onClick={() => onCharacterSelect(character.id)}
            onMouseEnter={() => setHoveredCharacter(character.id)}
            onMouseLeave={() => setHoveredCharacter(null)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-background"
                    style={{ backgroundColor: character.color }}
                  >
                    {(() => {
                      const IconComponent = CHARACTER_ICONS[character.id];
                      return IconComponent ? <IconComponent size={28} /> : null;
                    })()}
                  </div>
                  <div className="absolute -top-1 -right-1 text-xl">
                    {character.emoji}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">
                    {character.name}
                  </h3>
                  
                  {selectedCharacterId === character.id && (
                    <Badge variant="default" className="text-xs">
                      Ativo
                    </Badge>
                  )}
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {character.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hoveredCharacter && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-background flex-shrink-0"
                style={{ backgroundColor: AVAILABLE_CHARACTERS.find(c => c.id === hoveredCharacter)?.color }}
              >
                {(() => {
                  const IconComponent = CHARACTER_ICONS[hoveredCharacter];
                  return IconComponent ? <IconComponent size={20} /> : null;
                })()}
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  {AVAILABLE_CHARACTERS.find(c => c.id === hoveredCharacter)?.name}
                  <span className="text-lg">
                    {AVAILABLE_CHARACTERS.find(c => c.id === hoveredCharacter)?.emoji}
                  </span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  {AVAILABLE_CHARACTERS.find(c => c.id === hoveredCharacter)?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}