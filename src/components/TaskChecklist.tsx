import { useState } from 'react';
import { TaskChecklistItem } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface TaskChecklistProps {
  checklist: TaskChecklistItem[];
  onAddItem: (title: string) => void;
  onToggleItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export function TaskChecklist({ 
  checklist, 
  onAddItem, 
  onToggleItem, 
  onRemoveItem 
}: TaskChecklistProps) {
  const [newItemTitle, setNewItemTitle] = useState('');

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onAddItem(newItemTitle.trim());
      setNewItemTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4" />
            Checklist
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {completedItems}/{totalItems}
          </Badge>
        </div>
        {totalItems > 0 && (
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder="Adicionar passo..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            size="sm" 
            onClick={handleAddItem}
            disabled={!newItemTitle.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {checklist.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum passo adicionado ainda
            </p>
          ) : (
            checklist.map((item, index) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => onToggleItem(item.id)}
                  className="flex-shrink-0"
                />
                
                <span 
                  className={`flex-1 text-sm ${
                    item.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {item.title}
                </span>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}