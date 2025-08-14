import { Trophy, Zap, Target, Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameStats } from '@/hooks/useGameification';

interface GameStatsDisplayProps {
  stats: GameStats;
  className?: string;
}

export function GameStatsDisplay({ stats, className }: GameStatsDisplayProps) {
  const getProgressToNextLevel = () => {
    const currentLevelPoints = (stats.level - 1) * 100;
    const nextLevelPoints = stats.level * 100;
    const progress = ((stats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };

  const getLevelIcon = () => {
    if (stats.level >= 10) return '👑';
    if (stats.level >= 5) return '🏆';
    if (stats.level >= 3) return '🥉';
    return '⭐';
  };

  const getStreakColor = () => {
    if (stats.currentStreak >= 30) return 'text-purple-600 animate-glow';
    if (stats.currentStreak >= 14) return 'text-blue-600 animate-heartbeat';
    if (stats.currentStreak >= 7) return 'text-orange-600 animate-pulse';
    if (stats.currentStreak >= 3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {/* Level */}
      <Card className="gamified-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nível</p>
              <p className="text-2xl font-bold animate-glow">{stats.level}</p>
            </div>
            <div className="text-3xl animate-bounce">{getLevelIcon()}</div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{(stats.level - 1) * 100}</span>
              <span>{stats.level * 100}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out progress-bar-animated"
                style={{ width: `${getProgressToNextLevel()}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points */}
      <Card className="gamified-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pontos</p>
              <p className="text-2xl font-bold score-display">{stats.totalPoints}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 animate-wiggle" />
          </div>
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card className="gamified-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas</p>
              <p className="text-2xl font-bold text-green-600">{stats.tasksCompleted}</p>
            </div>
            <Target className="h-8 w-8 text-green-500 hover:animate-celebration" />
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card className="gamified-card hover-lift">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sequência</p>
              <p className={cn("text-2xl font-bold", getStreakColor())}>
                {stats.currentStreak}
              </p>
            </div>
            <Flame className={cn("h-8 w-8", getStreakColor())} />
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {stats.achievements.length > 0 && (
        <Card className="col-span-2 lg:col-span-4 gamified-card hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-500 animate-bounce" />
              <h3 className="font-semibold">Conquistas Recentes</h3>
              <Badge variant="secondary" className="animate-pulse">
                {stats.achievements.length}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {stats.achievements.slice(-6).map((achievement) => (
                <Badge
                  key={achievement.id}
                  variant="outline"
                  className="flex items-center gap-1 p-2 achievement-popup hover:animate-wiggle"
                >
                  <span>{achievement.icon}</span>
                  <span className="text-xs">{achievement.title}</span>
                  <span className="text-xs text-muted-foreground">+{achievement.points}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}