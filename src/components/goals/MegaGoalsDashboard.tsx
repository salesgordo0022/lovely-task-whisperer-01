import React, { useState, useEffect } from 'react';
import { Goal } from '@/types/goals';
import { useGoals } from '@/hooks/useGoals';
import { useTasks } from '@/hooks/useTasks';
import { useGameification } from '@/hooks/useGameification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Star, 
  Crown, 
  Shield, 
  Target,
  Rocket,
  Medal,
  Sparkles,
  TrendingUp,
  Timer,
  Calendar,
  Award
} from 'lucide-react';

interface MegaGoalsDashboardProps {
  className?: string;
}

export function MegaGoalsDashboard({ className }: MegaGoalsDashboardProps) {
  const { allTasks } = useTasks();
  const { stats, celebrateSuccess } = useGameification();
  const { activeGoals, completedGoals, goalStats, calculateGoalProgress } = useGoals(allTasks);
  
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [powerUpActive, setPowerUpActive] = useState(false);

  // Sistema de Níveis de Meta
  const getGoalTier = (points: number): { tier: string; color: string; icon: React.ReactNode; multiplier: number } => {
    if (points >= 500) return { 
      tier: 'LENDÁRIO', 
      color: 'from-purple-600 via-pink-600 to-red-600', 
      icon: <Crown className="w-5 h-5" />,
      multiplier: 3.0
    };
    if (points >= 300) return { 
      tier: 'ÉPICO', 
      color: 'from-orange-500 via-red-500 to-pink-500', 
      icon: <Shield className="w-5 h-5" />,
      multiplier: 2.5
    };
    if (points >= 150) return { 
      tier: 'RARO', 
      color: 'from-blue-500 via-purple-500 to-indigo-500', 
      icon: <Star className="w-5 h-5" />,
      multiplier: 2.0
    };
    if (points >= 50) return { 
      tier: 'ÉPICO', 
      color: 'from-green-400 to-blue-500', 
      icon: <Medal className="w-5 h-5" />,
      multiplier: 1.5
    };
    return { 
      tier: 'COMUM', 
      color: 'from-gray-400 to-gray-600', 
      icon: <Target className="w-5 h-5" />,
      multiplier: 1.0
    };
  };

  // Sistema de Combos e Multiplicadores
  const calculateComboMultiplier = () => {
    const recentCompletions = completedGoals.filter(goal => {
      const completedDate = goal.updatedAt;
      const daysSince = (Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;

    if (recentCompletions >= 5) return { multiplier: 3.0, label: 'COMBO INSANO!' };
    if (recentCompletions >= 3) return { multiplier: 2.0, label: 'COMBO ÉPICO!' };
    if (recentCompletions >= 2) return { multiplier: 1.5, label: 'COMBO!' };
    return { multiplier: 1.0, label: null };
  };

  // Boss Meta (Meta Mega Desafio)
  const bossGoals = activeGoals.filter(goal => goal.rewards.points >= 300);
  const regularGoals = activeGoals.filter(goal => goal.rewards.points < 300);

  // Power-Up System
  const activatePowerUp = () => {
    setPowerUpActive(true);
    celebrateSuccess('🚀 POWER-UP ATIVADO! Próxima meta vale DOBRO!', 'achievement');
    setTimeout(() => setPowerUpActive(false), 30000); // 30 segundos
  };

  const AdvancedGoalCard = ({ goal, isBoss = false }: { goal: Goal; isBoss?: boolean }) => {
    const current = calculateGoalProgress(goal);
    const progress = Math.min((current / goal.target) * 100, 100);
    const tier = getGoalTier(goal.rewards.points);
    const isHovered = hoveredGoal === goal.id;

    return (
      <Card 
        className={`relative transition-all duration-300 ${
          isBoss 
            ? 'border-4 border-gradient-to-r from-red-500 to-purple-600 shadow-2xl scale-105' 
            : 'hover:scale-102 hover:shadow-xl'
        } ${isHovered ? 'animate-pulse' : ''}`}
        onMouseEnter={() => setHoveredGoal(goal.id)}
        onMouseLeave={() => setHoveredGoal(null)}
      >
        {isBoss && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-3 py-1 shadow-lg">
              👑 META BOSS
            </Badge>
          </div>
        )}

        {powerUpActive && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
              <Zap className="w-4 h-4 text-yellow-900" />
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white`}>
                {tier.icon}
              </div>
              <div>
                <CardTitle className={`text-lg ${isBoss ? 'text-purple-600 font-black' : ''}`}>
                  {goal.title}
                </CardTitle>
                <Badge variant="outline" className={`text-xs bg-gradient-to-r ${tier.color} text-white border-0`}>
                  {tier.tier}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {goal.rewards.badge && (
                <span className="text-2xl animate-bounce">{goal.rewards.badge}</span>
              )}
              <div className="text-right">
                <div className={`font-bold ${isBoss ? 'text-purple-600 text-xl' : 'text-lg'}`}>
                  +{goal.rewards.points * tier.multiplier} pts
                </div>
                <div className="text-xs text-muted-foreground">
                  x{tier.multiplier} multiplicador
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso da Conquista</span>
              <span className="font-bold">
                {current} / {goal.target}
              </span>
            </div>
            
            <div className="relative">
              <Progress 
                value={progress} 
                className={`h-3 ${isBoss ? 'bg-purple-100' : ''}`}
              />
              {isBoss && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-full animate-pulse" />
              )}
            </div>
            
            <div className="flex justify-between text-xs">
              <span className={`${progress >= 100 ? 'text-green-600 font-bold' : 'text-muted-foreground'}`}>
                {Math.round(progress)}% conquistado
              </span>
              {progress >= 75 && (
                <span className="text-orange-600 font-bold animate-pulse">
                  🔥 QUASE LÁ!
                </span>
              )}
            </div>
          </div>

          {/* Barra de Intensidade */}
          <div className="space-y-1">
            <div className="text-xs font-medium">Intensidade da Meta</div>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < Math.floor(goal.rewards.points / 100) 
                      ? 'bg-gradient-to-r from-green-400 to-red-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const combo = calculateComboMultiplier();

  return (
    <div className={className}>
      {/* Header Épico */}
      <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                🎯 ARENA DAS METAS
              </h1>
              <p className="text-xl text-purple-200">
                Conquiste objetivos épicos e ganhe recompensas lendárias!
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-black">{stats.level}</div>
              <div className="text-sm">NÍVEL ATUAL</div>
              <Progress value={(stats.totalPoints % 100)} className="w-24 mt-2" />
            </div>
          </div>
          
          {/* Sistema de Combo */}
          {combo.label && (
            <div className="flex items-center gap-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Flame className="w-6 h-6 text-orange-400 animate-bounce" />
              <div>
                <div className="font-bold text-lg">{combo.label}</div>
                <div className="text-sm">Multiplicador: x{combo.multiplier}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Power-Up Section */}
      <div className="mb-6 flex justify-center">
        <Button
          onClick={activatePowerUp}
          disabled={powerUpActive}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg transform transition hover:scale-105"
        >
          {powerUpActive ? (
            <>
              <Timer className="w-5 h-5 mr-2 animate-spin" />
              POWER-UP ATIVO!
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              ATIVAR POWER-UP
            </>
          )}
        </Button>
      </div>

      {/* Boss Goals Section */}
      {bossGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-black text-purple-600">METAS BOSS</h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-red-600 text-white">
              ULTRA DESAFIO
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bossGoals.map((goal) => (
              <AdvancedGoalCard key={goal.id} goal={goal} isBoss={true} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Goals */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">METAS ATIVAS</h2>
          <Badge variant="outline">{regularGoals.length} ativas</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {regularGoals.map((goal) => (
            <AdvancedGoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Achievement Showcase */}
      {stats.achievements.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-yellow-600">TROFÉUS CONQUISTADOS</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {stats.achievements.slice(-8).map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <div className="font-bold text-sm">{achievement.title}</div>
                  <div className="text-xs text-muted-foreground">+{achievement.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}