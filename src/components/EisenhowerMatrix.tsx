import { Task } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { TaskItem } from './TaskItem';
import { useMemo } from 'react';

const QuadrantCard = ({ 
  title, 
  description, 
  tasks, 
  color, 
  icon: Icon,
  onTaskUpdate
}: {
  title: string;
  description: string;
  tasks: Task[];
  color: string;
  icon: any;
  onTaskUpdate: (id: string) => void;
}) => (
  <Card className={`h-full border-l-4 ${color}`}>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className="h-5 w-5" />
        {title}
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </CardTitle>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardHeader>
    <CardContent className="space-y-2 max-h-96 overflow-y-auto">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma tarefa neste quadrante
        </p>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onTaskUpdate(task.id)}
            onUpdate={() => {}}
            onDelete={() => {}}
          />
        ))
      )}
    </CardContent>
  </Card>
);

const TodayPriorities = ({ tasks }: { tasks: Task[] }) => (
  <Card className="border-l-4 border-l-primary">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Prioridades do Dia
        <Badge variant="default" className="ml-auto">
          {tasks.length}
        </Badge>
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Tarefas organizadas por importância para hoje
      </p>
    </CardHeader>
    <CardContent className="space-y-2 max-h-64 overflow-y-auto">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhuma tarefa programada para hoje
        </p>
      ) : (
        tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{task.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                {task.start_date && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(task.start_date, 'HH:mm')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              {(task.isUrgent === true) && (task.isImportant === true) && (
                <Badge variant="destructive" className="text-xs">Crítica</Badge>
              )}
              {(task.isUrgent !== true) && (task.isImportant === true) && (
                <Badge variant="default" className="text-xs">Importante</Badge>
              )}
              {(task.isUrgent === true) && (task.isImportant !== true) && (
                <Badge variant="secondary" className="text-xs">Urgente</Badge>
              )}
            </div>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

export function EisenhowerMatrix() {
  const { tasksByEisenhower, toggleTask, allTasks } = useTasks();

  const handleTaskUpdate = (id: string) => {
    toggleTask(id);
  };

  // Calcular prioridades do dia baseadas na Matriz de Eisenhower
  const todayPriorities = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayTasks = allTasks.filter(task => {
      if (task.completed) return false;
      
      // Incluir tarefas com data de início ou vencimento hoje
      const hasDateToday = (task.start_date && task.start_date >= todayStart && task.start_date < todayEnd) ||
                          (task.due_date && task.due_date >= todayStart && task.due_date < todayEnd);
      
      // Incluir tarefas urgentes e importantes mesmo sem data específica
      const isUrgentImportant = (task.isUrgent === true) && (task.isImportant === true);
      
      return hasDateToday || isUrgentImportant;
    });

    // Ordenar por prioridade: Urgente+Importante > Importante > Urgente > Normal
    return todayTasks.sort((a, b) => {
      const aPriority = ((a.isUrgent === true) && (a.isImportant === true)) ? 4 : 
                       ((a.isUrgent !== true) && (a.isImportant === true)) ? 3 :
                       ((a.isUrgent === true) && (a.isImportant !== true)) ? 2 : 1;
      const bPriority = ((b.isUrgent === true) && (b.isImportant === true)) ? 4 : 
                       ((b.isUrgent !== true) && (b.isImportant === true)) ? 3 :
                       ((b.isUrgent === true) && (b.isImportant !== true)) ? 2 : 1;
      return bPriority - aPriority;
    });
  }, [allTasks]);

  return (
    <div className="space-y-6">
      {/* Prioridades do Dia */}
      <TodayPriorities tasks={todayPriorities} />

      {/* Matriz de Eisenhower */}
      <div className="grid gap-4 md:grid-cols-2">
        <QuadrantCard
          title="Faça Imediatamente"
          description="Urgente e Importante - Crises e emergências"
          tasks={tasksByEisenhower['urgent_important']}
          color="border-l-red-500"
          icon={AlertTriangle}
          onTaskUpdate={handleTaskUpdate}
        />
        
        <QuadrantCard
          title="Agende"
          description="Importante mas não Urgente - Planejamento e prevenção"
          tasks={tasksByEisenhower['not_urgent_important']}
          color="border-l-blue-500"
          icon={Calendar}
          onTaskUpdate={handleTaskUpdate}
        />
        
        <QuadrantCard
          title="Delegue"
          description="Urgente mas não Importante - Interrupções e algumas reuniões"
          tasks={tasksByEisenhower['urgent_not_important']}
          color="border-l-yellow-500"
          icon={Clock}
          onTaskUpdate={handleTaskUpdate}
        />
        
        <QuadrantCard
          title="Elimine"
          description="Nem Urgente nem Importante - Distrações e atividades desnecessárias"
          tasks={tasksByEisenhower['not_urgent_not_important']}
          color="border-l-gray-400"
          icon={CheckCircle2}
          onTaskUpdate={handleTaskUpdate}
        />
      </div>
    </div>
  );
}