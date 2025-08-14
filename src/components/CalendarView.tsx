import { useState } from 'react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskItem } from './TaskItem';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export function CalendarView({ tasks, onToggleTask, onUpdateTask, onDeleteTask }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Filtra tarefas para o dia selecionado
  const tasksForSelectedDate = tasks.filter(task => 
    task.due_date && isSameDay(new Date(task.due_date), selectedDate)
  );

  // Conta tarefas por dia para mostrar indicadores no calendário
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  // Renderiza indicadores de tarefas no calendário
  const renderDayContent = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    const urgentTasks = dayTasks.filter(task => task.priority === 'urgent');
    const completedTasks = dayTasks.filter(task => task.completed);
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className={cn(
          "text-sm font-medium",
          isToday(date) && "text-primary font-bold"
        )}>
          {format(date, 'd')}
        </span>
        {dayTasks.length > 0 && (
          <div className="flex gap-1 mt-1">
            {urgentTasks.length > 0 && (
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
            {completedTasks.length < dayTasks.length && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            )}
            {completedTasks.length === dayTasks.length && dayTasks.length > 0 && (
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            )}
          </div>
        )}
      </div>
    );
  };

  const formatSelectedDate = format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendário de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            className="w-full pointer-events-auto"
            components={{
              DayContent: ({ date }) => renderDayContent(date)
            }}
          />
          
          {/* Legenda */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Legenda:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Tarefas urgentes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Tarefas pendentes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Todas concluídas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarefas do dia selecionado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {formatSelectedDate}
          </CardTitle>
          {tasksForSelectedDate.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="outline">
                {tasksForSelectedDate.length} tarefas
              </Badge>
              {tasksForSelectedDate.some(t => t.priority === 'urgent') && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Urgente
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma tarefa para este dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate
                .sort((a, b) => {
                  // Urgentes primeiro, depois importantes, depois normais
                  const priorityOrder = { urgent: 0, important: 1, normal: 2 };
                  return priorityOrder[a.priority] - priorityOrder[b.priority];
                })
                .map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onToggleTask(task.id)}
                    onUpdate={(updates) => onUpdateTask(task.id, updates)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}