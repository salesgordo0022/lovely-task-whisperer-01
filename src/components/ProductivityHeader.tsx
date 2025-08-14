import { ViewMode, ProductivityStats } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, Calendar, TrendingUp, Flame, Clock, Grid3X3, BarChart3, Trophy, Brain, Menu, CheckCircle2, Workflow, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@/components/UserButton';
import { useMemo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
interface ProductivityHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  productivityStats: ProductivityStats;
}
export function ProductivityHeader({
  viewMode,
  onViewModeChange,
  productivityStats
}: ProductivityHeaderProps) {
  // Memoização dos botões para evitar re-renders
  const viewButtons = useMemo(() => [{
    mode: 'productivity' as ViewMode,
    icon: Target,
    label: 'Produtividade',
    shortLabel: 'Prod',
    mobileLabel: 'Prod'
  }, {
    mode: 'completed' as ViewMode,
    icon: CheckCircle2,
    label: 'Concluídas',
    shortLabel: 'Concl',
    mobileLabel: 'Feito'
  }, {
    mode: 'ai' as ViewMode,
    icon: Brain,
    label: 'AI Assistant',
    shortLabel: 'AI',
    mobileLabel: 'AI'
  }, {
    mode: 'calendar' as ViewMode,
    icon: Calendar,
    label: 'Calendário',
    shortLabel: 'Cal',
    mobileLabel: 'Cal'
  }, {
    mode: 'focus' as ViewMode,
    icon: Zap,
    label: 'Foco',
    shortLabel: 'Foco',
    mobileLabel: 'Foco'
  }, {
    mode: 'eisenhower' as ViewMode,
    icon: Grid3X3,
    label: 'Matriz',
    shortLabel: 'Matriz',
    mobileLabel: 'Matriz'
  }, {
    mode: 'goals' as ViewMode,
    icon: Trophy,
    label: 'Metas',
    shortLabel: 'Metas',
    mobileLabel: 'Metas'
  }, {
    mode: 'reports' as ViewMode,
    icon: BarChart3,
    label: 'Relatórios',
    shortLabel: 'Rel',
    mobileLabel: 'Rel'
  }, {
    mode: 'notes' as ViewMode,
    icon: StickyNote,
    label: 'Anotações',
    shortLabel: 'Notas',
    mobileLabel: 'Notas'
  }], []);
  // Memoização da cor do score
  const scoreColor = useMemo(() => {
    const score = productivityStats.productivityScore;
    if (score >= 80) return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950';
    return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
  }, [productivityStats.productivityScore]);
  return (
    <div className="responsive-padding bg-background/95 backdrop-blur-sm border-b">
      {/* Cabeçalho Principal */}
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        {/* Linha 1: Título e Score */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">NOTEBOOK</h1>
            <Badge variant="outline" className={cn('px-2 py-1 text-xs font-semibold w-fit shrink-0', scoreColor)}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {productivityStats.productivityScore}% Score
            </Badge>
          </div>
          
          {/* Controles no desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <UserButton />
            <ThemeToggle />
          </div>
        </div>

        {/* Linha 2: Estatísticas */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{productivityStats.tasksCompleted}</span>
            <span className="hidden sm:inline">de {productivityStats.totalTasks} concluídas hoje</span>
            <span className="sm:hidden">/{productivityStats.totalTasks} hoje</span>
          </div>
          
          {productivityStats.streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="font-medium text-foreground">{productivityStats.streak}</span>
              <span className="hidden sm:inline">dias em sequência</span>
              <span className="sm:hidden">dias</span>
            </div>
          )}
          
          {productivityStats.focusTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span className="font-medium text-foreground">{Math.round(productivityStats.focusTime / 60)}h</span>
              <span className="hidden sm:inline">de foco</span>
            </div>
          )}
        </div>

        {/* Linha 3: Navegação */}
        <div className="flex items-center justify-between gap-2">
          {/* Menu Desktop - Abas completas */}
          <div className="hidden xl:flex items-center space-x-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
            {viewButtons.map(({ mode, icon: Icon, label }) => (
              <Button 
                key={mode} 
                variant={viewMode === mode ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => onViewModeChange(mode)} 
                className={cn(
                  'transition-all duration-200 text-xs whitespace-nowrap',
                  viewMode === mode && 'shadow-soft'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Menu Tablet - Abas resumidas */}
          <div className="hidden md:flex xl:hidden items-center space-x-1 bg-muted/50 p-1 rounded-lg overflow-x-auto max-w-full">
            {viewButtons.map(({ mode, icon: Icon, shortLabel }) => (
              <Button 
                key={mode} 
                variant={viewMode === mode ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => onViewModeChange(mode)} 
                className={cn(
                  'transition-all duration-200 text-xs px-2 whitespace-nowrap',
                  viewMode === mode && 'shadow-soft'
                )}
              >
                <Icon className="w-4 h-4 mr-1" />
                {shortLabel}
              </Button>
            ))}
          </div>

          {/* Menu Mobile - Scroll horizontal de ícones */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center space-x-1 min-w-max">
              {viewButtons.map(({ mode, icon: Icon, mobileLabel }) => (
                <Button 
                  key={mode} 
                  variant={viewMode === mode ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => onViewModeChange(mode)} 
                  className={cn(
                    'transition-all duration-200 text-xs px-2 py-2 min-w-[60px] whitespace-nowrap flex-shrink-0',
                    viewMode === mode && 'shadow-soft bg-primary text-primary-foreground'
                  )}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {mobileLabel}
                </Button>
              ))}
            </div>
          </div>

          {/* Controles no mobile */}
          <div className="flex sm:hidden items-center gap-2 ml-2">
            <UserButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}