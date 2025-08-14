import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateChecklistItem?: (taskId: string, itemIndex: number, completed: boolean) => void;
}

export function TaskList({ tasks, onToggleTask, onUpdateTask, onDeleteTask, onUpdateChecklistItem }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
            <path d="M3 12v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-muted-foreground">
          Crie uma nova tarefa para começar a organizar seu dia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="task-enter"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskItem
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onUpdate={(updates) => onUpdateTask(task.id, updates)}
            onDelete={() => onDeleteTask(task.id)}
            onUpdateChecklistItem={onUpdateChecklistItem}
          />
        </div>
      ))}
    </div>
  );
}