
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { TaskCategory, TaskPriority } from '@/types/task';
import { classifyEisenhower, getQuadrantLabel, getQuadrantColor } from '@/utils/eisenhowerClassifier';

interface EisenhowerSectionProps {
  isUrgent: boolean;
  setIsUrgent: (urgent: boolean) => void;
  isImportant: boolean;
  setIsImportant: (important: boolean) => void;
  // Dados para auto-classificação
  category?: TaskCategory;
  priority?: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  checklistCount?: number;
}

export function EisenhowerSection({
  isUrgent,
  setIsUrgent,
  isImportant,
  setIsImportant,
  category = 'personal',
  priority = 'normal',
  dueDate,
  startDate,
  estimatedTime,
  checklistCount = 0,
}: EisenhowerSectionProps) {
  const [suggestion, setSuggestion] = useState<ReturnType<typeof classifyEisenhower> | null>(null);
  const [showReasons, setShowReasons] = useState(false);

  // Recalcular sugestão quando os dados mudam
  useEffect(() => {
    const result = classifyEisenhower({
      category,
      priority,
      dueDate,
      startDate,
      estimatedTime,
      checklistCount,
    });
    setSuggestion(result);
  }, [category, priority, dueDate, startDate, estimatedTime, checklistCount]);

  const applySuggestion = () => {
    if (suggestion) {
      setIsUrgent(suggestion.isUrgent);
      setIsImportant(suggestion.isImportant);
    }
  };

  const hasSuggestion = suggestion && (suggestion.isUrgent !== isUrgent || suggestion.isImportant !== isImportant);
  const quadrantColor = getQuadrantColor(isUrgent, isImportant);

  return (
    <div className={`space-y-3 p-3 border rounded-lg transition-colors ${quadrantColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <Label className="text-sm font-medium">Matriz de Eisenhower</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Classifique por urgência e importância
          </p>
        </div>
        {hasSuggestion && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={applySuggestion}
            className="text-xs h-7 gap-1 shrink-0"
          >
            <Lightbulb className="h-3 w-3" />
            Auto
          </Button>
        )}
      </div>

      {/* Sugestão automática */}
      {suggestion && suggestion.reasons.length > 0 && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setShowReasons(!showReasons)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3" />
            {showReasons ? 'Ocultar análise' : `Ver análise (${suggestion.reasons.length} critérios)`}
          </button>
          {showReasons && (
            <div className="text-xs space-y-1 bg-background/60 p-2 rounded border border-border/50">
              {suggestion.reasons.map((reason, i) => (
                <p key={i}>{reason}</p>
              ))}
              <p className="text-muted-foreground mt-1.5 pt-1.5 border-t border-border/50">
                Sugestão: <strong>{getQuadrantLabel(suggestion.isUrgent, suggestion.isImportant)}</strong>
              </p>
            </div>
          )}
        </div>
      )}
      
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
      
      <div className="text-xs font-medium bg-background/50 p-2 rounded">
        {getQuadrantLabel(isUrgent, isImportant)}
      </div>
    </div>
  );
}
