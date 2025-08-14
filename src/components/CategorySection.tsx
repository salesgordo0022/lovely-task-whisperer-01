import { Task, TaskCategory } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TaskItem } from './TaskItem';
import { MeetingTaskItem } from './MeetingTaskItem';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  category: TaskCategory;
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    urgent: number;
  };
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateChecklistItem?: (taskId: string, itemIndex: number, completed: boolean) => void;
}

export function CategorySection({
  title,
  category,
  tasks,
  stats,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateChecklistItem,
}: CategorySectionProps) {
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  // Ordenar tarefas por prioridade e data
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    // Para agenda, ordenar por data/hora
    if (category === 'agenda') {
      if (a.start_date && b.start_date) {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      }
      if (a.start_date) return -1;
      if (b.start_date) return 1;
    }
    
    // Para outras categorias, ordenar por prioridade
    const priorityOrder = { urgent: 3, important: 2, normal: 1 };
    if (a.priority !== b.priority) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            <Badge variant="outline" className="ml-2">
              {stats.total}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-3">
            {stats.urgent > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {stats.urgent} urgentes
              </Badge>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>{stats.completed}/{stats.total}</span>
            </div>
          </div>
        </div>
        
        {stats.total > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma tarefa nesta categoria</p>
            <p className="text-sm">Crie uma nova tarefa para começar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tarefas pendentes */}
            {sortedPendingTasks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {category === 'agenda' ? `Compromissos (${pendingTasks.length})` : `Pendentes (${pendingTasks.length})`}
                </h4>
                <div className="space-y-2">
                  {sortedPendingTasks.map((task) => (
                    category === 'agenda' ? (
                      <MeetingTaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={() => onToggleTask(task.id)}
                        onEdit={(task) => onUpdateTask(task.id, task)}
                        onDelete={() => onDeleteTask(task.id)}
                      />
                    ) : (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onToggleTask(task.id)}
                        onUpdate={(updates) => onUpdateTask(task.id, updates)}
                        onDelete={() => onDeleteTask(task.id)}
                        onUpdateChecklistItem={onUpdateChecklistItem}
                      />
                    )
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </CardContent>
    </Card>
  );
}