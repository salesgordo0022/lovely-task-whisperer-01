
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { TaskChecklistItem } from '@/types/task';

interface ChecklistSectionProps {
  checklistItems: Omit<TaskChecklistItem, 'id' | 'created_at' | 'updated_at' | 'task_id' | 'order_index'>[];
  setChecklistItems: (items: Omit<TaskChecklistItem, 'id' | 'created_at' | 'updated_at' | 'task_id' | 'order_index'>[]) => void;
}

export function ChecklistSection({ checklistItems, setChecklistItems }: ChecklistSectionProps) {
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklistItems([...checklistItems, { 
        title: newChecklistItem.trim(), 
        completed: false 
      }]);
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
      <div>
        <Label className="text-sm font-medium">📝 Checklist / Passos</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Adicione etapas ou itens de verificação para esta tarefa
        </p>
      </div>
      
      {/* Add new checklist item */}
      <div className="flex gap-2">
        <Input
          placeholder="Digite um passo ou item..."
          value={newChecklistItem}
          onChange={(e) => setNewChecklistItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
          className="h-8 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChecklistItem}
          disabled={!newChecklistItem.trim()}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Display checklist items */}
      {checklistItems.length > 0 && (
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border text-sm">
              <span className="text-xs text-muted-foreground min-w-[1.5rem]">
                {index + 1}.
              </span>
              <span className="flex-1 truncate">{item.title}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeChecklistItem(index)}
                className="h-6 w-6 p-0 hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
