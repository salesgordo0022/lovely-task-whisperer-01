import { Task, TaskCategory } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from './TaskItem';
import { CheckCircle2, Clock } from 'lucide-react';

interface CompletedTasksSectionProps {
  title: string;
  category: TaskCategory;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateChecklistItem?: (taskId: string, itemIndex: number, completed: boolean) => void;
}

export function CompletedTasksSection({
  title,
  category,
  tasks,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateChecklistItem,
}: CompletedTasksSectionProps) {
  // Ordenar tarefas concluídas por data de conclusão (mais recente primeiro)
  const sortedCompletedTasks = [...tasks].sort((a, b) => {
    const aDate = a.completed_at ? new Date(a.completed_at) : new Date(a.updated_at);
    const bDate = b.completed_at ? new Date(b.completed_at) : new Date(b.updated_at);
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {title}
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              {tasks.length}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluídas</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Nenhuma tarefa concluída</p>
            <p className="text-sm">As tarefas concluídas aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedCompletedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() => onToggleTask(task.id)}
                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                onDelete={() => onDeleteTask(task.id)}
                onUpdateChecklistItem={onUpdateChecklistItem}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}