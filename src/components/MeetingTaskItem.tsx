import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Link as LinkIcon, 
  Users, 
  StickyNote,
  Bell,
  Edit, 
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { format, isSameDay, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MeetingTaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function MeetingTaskItem({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}: MeetingTaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isToday = task.start_date && isSameDay(task.start_date, new Date());
  const isPastMeeting = task.start_date && isPast(task.start_date) && !task.completed;
  const isUpcoming = task.start_date && !isPast(task.start_date);

  const getStatusColor = () => {
    if (task.completed) return 'border-green-200 bg-green-50/50 dark:bg-green-950/20';
    if (isPastMeeting) return 'border-red-200 bg-red-50/50 dark:bg-red-950/20';
    if (isToday) return 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20';
    if (isUpcoming) return 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20';
    return 'border-border bg-card';
  };

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm");
  };

  const formatTimeRange = () => {
    if (!task.start_date) return null;
    
    const startTime = format(task.start_date, 'HH:mm');
    if (task.due_date && isSameDay(task.start_date, task.due_date)) {
      const endTime = format(task.due_date, 'HH:mm');
      return `${startTime} - ${endTime}`;
    }
    return startTime;
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 macos-card-subtle border-l-4',
        getStatusColor(),
        task.completed && 'opacity-75'
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1 macos-button"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 
                  className={cn(
                    'font-medium text-sm sm:text-base mb-1 cursor-pointer',
                    task.completed && 'line-through text-muted-foreground'
                  )}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {task.title}
                </h3>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  {isPastMeeting && !task.completed && (
                    <Badge variant="destructive" className="text-xs">
                      Atrasado
                    </Badge>
                  )}
                  {isToday && !task.completed && (
                    <Badge variant="default" className="text-xs bg-orange-500">
                      Hoje
                    </Badge>
                  )}
                  {isUpcoming && (
                    <Badge variant="outline" className="text-xs">
                      Agendado
                    </Badge>
                  )}
                  {task.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Concluído
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8 p-0 macos-button"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive macos-button"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Main Info */}
            <div className="space-y-2">
              {/* Data e Horário */}
              {task.start_date && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{format(task.start_date, 'dd/MM/yyyy')}</span>
                  {formatTimeRange() && (
                    <>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{formatTimeRange()}</span>
                    </>
                  )}
                </div>
              )}

              {/* Local */}
              {task.location && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{task.location}</span>
                </div>
              )}

              {/* Participantes (resumido) */}
              {task.attendees && task.attendees.length > 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>
                    {task.attendees.length === 1 
                      ? '1 participante' 
                      : `${task.attendees.length} participantes`
                    }
                  </span>
                </div>
              )}

              {/* Lembrete */}
              {task.reminder_minutes && !task.completed && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Bell className="w-3 h-3" />
                  <span>
                    Lembrete {task.reminder_minutes < 60 
                      ? `${task.reminder_minutes} min` 
                      : `${Math.floor(task.reminder_minutes / 60)}h`
                    } antes
                  </span>
                </div>
              )}
            </div>

            {/* Link da reunião - destacado */}
            {task.meeting_url && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => window.open(task.meeting_url, '_blank')}
                >
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Entrar na reunião
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            )}

            {/* Detalhes expandidos */}
            {isExpanded && (
              <div className="mt-4 pt-3 border-t space-y-3">
                {/* Descrição */}
                {task.description && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Descrição</h4>
                    <p className="text-sm">{task.description}</p>
                  </div>
                )}

                {/* Participantes completos */}
                {task.attendees && task.attendees.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Participantes</h4>
                    <div className="flex flex-wrap gap-1">
                      {task.attendees.map((attendee, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notas da reunião */}
                {task.meeting_notes && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <StickyNote className="w-3 h-3" />
                      Notas/Agenda
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{task.meeting_notes}</p>
                  </div>
                )}

                {/* Link da reunião completo */}
                {task.meeting_url && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Link da reunião</h4>
                    <p className="text-xs text-muted-foreground break-all">{task.meeting_url}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}