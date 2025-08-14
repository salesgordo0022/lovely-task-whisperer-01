
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EisenhowerSectionProps {
  isUrgent: boolean;
  setIsUrgent: (urgent: boolean) => void;
  isImportant: boolean;
  setIsImportant: (important: boolean) => void;
}

export function EisenhowerSection({
  isUrgent,
  setIsUrgent,
  isImportant,
  setIsImportant,
}: EisenhowerSectionProps) {
  const getQuadrantText = () => {
    if (isUrgent && isImportant) return "📋 Quadrante 1: Faça imediatamente";
    if (!isUrgent && isImportant) return "📅 Quadrante 2: Agende";
    if (isUrgent && !isImportant) return "🔄 Quadrante 3: Delegue";
    if (!isUrgent && !isImportant) return "🗑️ Quadrante 4: Elimine";
    return "";
  };

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
      <div>
        <Label className="text-sm font-medium">Matriz de Eisenhower</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Classifique a tarefa conforme urgência e importância
        </p>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Switch
            id="urgent"
            checked={isUrgent}
            onCheckedChange={setIsUrgent}
          />
          <Label htmlFor="urgent" className="text-sm cursor-pointer">
            🔥 Urgente
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="important"
            checked={isImportant}
            onCheckedChange={setIsImportant}
          />
          <Label htmlFor="important" className="text-sm cursor-pointer">
            ⭐ Importante
          </Label>
        </div>
      </div>
      
      {(isUrgent || isImportant) && (
        <div className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
          {getQuadrantText()}
        </div>
      )}
    </div>
  );
}
