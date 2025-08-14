import { ViewMode } from '@/types/task';
import { Button } from '@/components/ui/button';
import { List, Calendar, Kanban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export function TaskHeader({ viewMode, onViewModeChange, stats }: TaskHeaderProps) {
  const viewButtons = [
    { mode: 'list' as ViewMode, icon: List, label: 'Lista' },
    { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendário' },
    { mode: 'kanban' as ViewMode, icon: Kanban, label: 'Kanban' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Minhas Tarefas</h1>
        <p className="text-muted-foreground">
          {stats.pending} pendentes de {stats.total} tarefas
        </p>
      </div>

      <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
        {viewButtons.map(({ mode, icon: Icon, label }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(mode)}
            className={cn(
              'transition-smooth button-press',
              viewMode === mode && 'shadow-soft'
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}