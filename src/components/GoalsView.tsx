import { useState } from 'react';
import { Goal, GoalTemplate } from '@/types/goals';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { useGameification } from '@/hooks/useGameification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameStatsDisplay } from './GameStatsDisplay';
import { GameNotification } from './GameNotification';
import { MegaGoalsDashboard } from './goals/MegaGoalsDashboard';
import { GoalChallengeSystem } from './goals/GoalChallengeSystem';
import { 
  Target, 
  Plus, 
  Trophy, 
  Calendar, 
  Clock, 
  Flame,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GoalsViewProps {
  className?: string;
}

export function GoalsView({ className }: GoalsViewProps) {
  const { allTasks } = useTasks();
  const { stats, notifications, removeNotification } = useGameification();
  const {
    activeGoals,
    completedGoals,
    expiredGoals,
    goalStats,
    availableTemplates,
    createGoalFromTemplate,
    deleteGoal,
    calculateGoalProgress
  } = useGoals(allTasks);

  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const getUnitLabel = (unit: Goal['unit'], value: number) => {
    switch (unit) {
      case 'tasks':
        return value === 1 ? 'tarefa' : 'tarefas';
      case 'hours':
        return value === 1 ? 'hora' : 'horas';
      case 'minutes':
        return value === 1 ? 'minuto' : 'minutos';
      case 'streak':
        return value === 1 ? 'dia' : 'dias';
      case 'points':
        return value === 1 ? 'ponto' : 'pontos';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'weekly':
        return <TrendingUp className="w-4 h-4" />;
      case 'monthly':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d restantes`;
    if (hours > 0) return `${hours}h restantes`;
    return 'Menos de 1h';
  };

  const handleCreateFromTemplate = (template: GoalTemplate) => {
    createGoalFromTemplate(template);
    setIsTemplateDialogOpen(false);
  };

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const current = calculateGoalProgress(goal);
    const progress = Math.min((current / goal.target) * 100, 100);
    const isCompleted = current >= goal.target;
    const isExpired = new Date() > goal.endDate && !isCompleted;

    return (
      <Card className="transition-all duration-200 hover:shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(goal.type)}
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {goal.rewards.badge && (
                <span className="text-lg">{goal.rewards.badge}</span>
              )}
              <Badge variant={isCompleted ? "default" : isExpired ? "destructive" : "secondary"}>
                {goal.type === 'daily' ? 'Diária' : 
                 goal.type === 'weekly' ? 'Semanal' : 
                 goal.type === 'monthly' ? 'Mensal' : 'Personalizada'}
              </Badge>
            </div>
          </div>
          <CardDescription>{goal.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">
                {current} / {goal.target} {getUnitLabel(goal.unit, goal.target)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% completo</span>
              <span>{formatTimeRemaining(goal.endDate)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-4 h-4" />
              <span>+{goal.rewards.points} pontos</span>
            </div>
            
            {isExpired && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => deleteGoal(goal.id)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Remover
              </Button>
            )}
            
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Concluída!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      {/* Notificações de gamificação */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <GameNotification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Header com estatísticas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">🎯 Metas & Recompensas</h1>
            <p className="text-muted-foreground">
              Defina objetivos e ganhe pontos por suas conquistas
            </p>
          </div>
          
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-medium">
                <Plus className="w-4 h-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Escolher Tipo de Meta</DialogTitle>
                <DialogDescription>
                  Selecione uma meta pré-definida ou crie uma personalizada
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {availableTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-soft hover:scale-105"
                    onClick={() => handleCreateFromTemplate(template)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{template.title}</CardTitle>
                        {template.rewards.badge && (
                          <span className="text-lg">{template.rewards.badge}</span>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline">
                          {template.type === 'daily' ? 'Diária' : 
                           template.type === 'weekly' ? 'Semanal' : 'Mensal'}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="w-3 h-3" />
                          <span>+{template.rewards.points}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas do sistema de gamificação */}
        <GameStatsDisplay stats={stats} className="mb-6" />
        
        {/* Resumo das metas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{goalStats.active}</div>
              <div className="text-sm text-muted-foreground">Ativas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{goalStats.completed}</div>
              <div className="text-sm text-muted-foreground">Concluídas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{goalStats.totalPointsEarned}</div>
              <div className="text-sm text-muted-foreground">Pontos Ganhos</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{goalStats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs com diferentes categorias de metas */}
      <Tabs defaultValue="arena" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="arena">
            🏟️ Arena
          </TabsTrigger>
          <TabsTrigger value="challenges">
            ⚔️ Desafios
          </TabsTrigger>
          <TabsTrigger value="active">
            Ativas ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Concluídas ({completedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expiradas ({expiredGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arena">
          <MegaGoalsDashboard />
        </TabsContent>

        <TabsContent value="challenges">
          <GoalChallengeSystem />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma meta ativa</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira meta para começar a ganhar pontos!
                </p>
                <Button onClick={() => setIsTemplateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Meta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma meta concluída ainda</h3>
                <p className="text-muted-foreground">
                  Complete suas primeiras metas para vê-las aqui!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredGoals.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma meta expirada</h3>
                <p className="text-muted-foreground">
                  Ótimo! Você tem conseguido manter suas metas em dia.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expiredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}