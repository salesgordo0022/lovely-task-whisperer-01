
import { ProductivityStats } from '@/types/task';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, Target, TrendingUp, AlertTriangle, Home, Briefcase, Calendar } from 'lucide-react';

interface ProductivityDashboardProps {
  stats: ProductivityStats;
  tasksByCategory: {
    personal: { total: number; completed: number; urgent: number };
    work: { total: number; completed: number; urgent: number };
    agenda: { total: number; completed: number; urgent: number };
  };
}

export function ProductivityDashboard({ stats, tasksByCategory }: ProductivityDashboardProps) {
  const completionRate = stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0;

  const categories = [
    {
      name: 'Pessoal',
      icon: Home,
      data: tasksByCategory.personal,
      color: 'personal',
    },
    {
      name: 'Trabalho',
      icon: Briefcase,
      data: tasksByCategory.work,
      color: 'work',
    },
    {
      name: 'Agenda',
      icon: Calendar,
      data: tasksByCategory.agenda,
      color: 'agenda',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 macos-slide-up">
      {/* Score Principal - Ocupa mais espaço em telas maiores */}
      <Card className="sm:col-span-2 lg:col-span-2 macos-card-subtle">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="font-semibold text-sm sm:text-base">Produtividade Hoje</h3>
            </div>
            <Badge variant="outline" className="text-base sm:text-lg px-3 py-1 w-fit">
              {stats.productivityScore}%
            </Badge>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Tarefas concluídas</span>
                <span>{stats.tasksCompleted}/{stats.totalTasks}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-success mb-1">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-bold text-base sm:text-lg">{stats.tasksCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-warning mb-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-bold text-base sm:text-lg">{stats.totalTasks - stats.tasksCompleted}</span>
                </div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas por categoria - Stack em mobile, grid em desktop */}
      {categories.map((category, index) => (
        <Card key={category.name} className="sm:col-span-1 macos-card-subtle" style={{animationDelay: `${index * 100}ms`}}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <h4 className="font-medium text-xs sm:text-sm">{category.name}</h4>
              </div>
              {category.data.urgent > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-0">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {category.data.urgent}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">
                  {category.data.completed}/{category.data.total}
                </span>
              </div>
              
              <Progress 
                value={category.data.total > 0 ? (category.data.completed / category.data.total) * 100 : 0} 
                className="h-1.5" 
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
