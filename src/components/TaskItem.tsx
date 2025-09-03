import { useState, useEffect } from 'react';
import { Task, TaskCategory, TaskPriority, TaskChecklistItem } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Check, 
  Edit2, 
  Trash2, 
  Calendar,
  Save,
  X,
  Briefcase,
  User,
  GraduationCap,
  AlertCircle,
  Clock,
  Star,
  Zap,
  CheckSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onGameEvent?: (event: 'task_completed' | 'task_created' | 'task_updated') => void;
  onUpdateChecklistItem?: (taskId: string, itemIndex: number, completed: boolean) => void;
}

export function TaskItem({ task, onToggle, onUpdate, onDelete, onGameEvent, onUpdateChecklistItem }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const handleToggle = () => {
    if (!task.completed) {
      // Task is being completed
      setIsCompleting(true);
      setShowCelebration(true);
      
      // Trigger celebration animation
      setTimeout(() => {
        onToggle();
        onGameEvent?.('task_completed');
        setIsCompleting(false);
      }, 300);
      
      // Hide celebration after animation
      setTimeout(() => {
        setShowCelebration(false);
      }, 1500);
    } else {
      // Task is being uncompleted
      onToggle();
    }
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    
    onUpdate({
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
      category: editCategory,
      priority: editPriority,
    });
    onGameEvent?.('task_updated');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleChecklistItemToggle = (itemIndex: number) => {
    if (onUpdateChecklistItem && task.checklist && task.checklist[itemIndex]) {
      const currentItem = task.checklist[itemIndex];
      onUpdateChecklistItem(task.id, itemIndex, !currentItem.completed);
      
      // Check if all items are completed to auto-complete the task
      const willBeCompleted = !currentItem.completed;
      const otherItems = task.checklist.filter((_, index) => index !== itemIndex);
      const allOthersCompleted = otherItems.every(item => item.completed);
      
      if (willBeCompleted && allOthersCompleted && task.checklist.length > 0 && !task.completed) {
        setTimeout(() => {
          onToggle();
          onGameEvent?.('task_completed');
        }, 500);
      }
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'work': return Briefcase;
      case 'personal': return User;
      case 'agenda': return GraduationCap;
    }
  };

  const getCategoryLabel = (category: TaskCategory) => {
    switch (category) {
      case 'work': return 'Trabalho';
      case 'personal': return 'Pessoal';
      case 'agenda': return 'Agenda';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'important': return 'text-yellow-600 bg-yellow-50';
      case 'normal': return 'text-green-600 bg-green-50';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return 'Urgente';
      case 'important': return 'Importante';
      case 'normal': return 'Normal';
    }
  };

  const CategoryIcon = getCategoryIcon(task.category);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;

  return (
    <div className="relative macos-slide-up">
      <Card className={cn(
        'transition-all duration-300 relative macos-card-subtle',
        task.completed && 'opacity-75',
        isOverdue && 'border-red-200 bg-red-50/50',
        isCompleting && 'bg-green-50 macos-spring',
        showCelebration && 'bg-green-100 macos-bounce'
      )}>
        <CardContent className="p-4">
          {/* Celebration overlay */}
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="font-bold">+10 pontos!</span>
                  <Zap className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}

          {isEditing ? (
          // Edit Mode
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="font-medium"
            />
            
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={2}
            />

            <div className="flex gap-2">
              <Select value={editCategory} onValueChange={(value) => setEditCategory(value as TaskCategory)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="work">Trabalho</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>

              <Select value={editPriority} onValueChange={(value) => setEditPriority(value as TaskPriority)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="important">Importante</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-3">
            {/* Header */}
            <div 
              className={cn(
                "flex items-start gap-3 cursor-pointer rounded p-1 -m-1 transition-colors",
                task.checklist.length > 0 && "hover:bg-muted/50"
              )}
              onClick={() => task.checklist.length > 0 && setShowChecklist(!showChecklist)}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggle}
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    'font-medium text-sm',
                    task.completed && 'line-through text-muted-foreground'
                  )}>
                    {task.title}
                  </h3>
                  
                  {isOverdue && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}

                  {task.checklist.length > 0 && (
                    <div className="flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                      </span>
                      {showChecklist ? (
                        <ChevronUp className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
                
                {task.description && (
                  <p className={cn(
                    'text-sm text-muted-foreground mt-1',
                    task.completed && 'line-through'
                  )}>
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={cn('text-xs', `category-${task.category}`)}
                >
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {getCategoryLabel(task.category)}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', getPriorityColor(task.priority))}
                >
                  {getPriorityLabel(task.priority)}
                </Badge>
              </div>

              {task.due_date && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue ? 'text-red-600' : 'text-muted-foreground'
                )}>
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.due_date), 'dd/MM/yyyy')}
                </div>
              )}
            </div>

            {/* Checklist Section */}
            {showChecklist && task.checklist.length > 0 && (
              <div className="mt-3 pt-3 border-t bg-muted/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Checklist ({task.checklist.filter(item => item.completed).length}/{task.checklist.length})
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowChecklist(false)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {task.checklist.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group hover:shadow-sm",
                        item.completed 
                          ? "bg-green-50 border-green-200 hover:bg-green-100" 
                          : "bg-background hover:bg-muted/50 hover:border-primary/30"
                      )}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-muted/60 rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground group-hover:bg-primary/10 transition-colors">
                        {index + 1}
                      </div>
                      
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => handleChecklistItemToggle(index)}
                        className={cn(
                          "h-4 w-4 transition-all duration-200",
                          item.completed && "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        )}
                      />
                      
                      <span className={cn(
                        'flex-1 text-sm transition-all duration-200 select-none',
                        item.completed 
                          ? 'line-through text-green-700/70 font-medium' 
                          : 'text-foreground group-hover:text-primary'
                      )}>
                        {item.title}
                      </span>
                      
                      {item.completed && (
                        <div className="flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600 animate-in fade-in duration-200" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {task.checklist.every(item => item.completed) && task.checklist.length > 0 && !task.completed && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
                    <p className="text-sm text-green-700 font-medium">
                      ✅ Todos os itens concluídos! A tarefa será finalizada automaticamente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}