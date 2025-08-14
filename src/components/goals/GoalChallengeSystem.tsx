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
  Swords, 
  Users, 
  Clock, 
  Target,
  Zap,
  Trophy,
  Star,
  Timer,
  Crown,
  Flame
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'endurance' | 'precision' | 'combo';
  timeLimit: number; // em minutos
  targetTasks: number;
  multiplier: number;
  icon: string;
  isActive: boolean;
  startTime?: Date;
  participantCount?: number;
}

const DAILY_CHALLENGES: Challenge[] = [
  {
    id: 'speed_demon',
    title: 'Demônio da Velocidade',
    description: 'Complete 3 tarefas em 30 minutos',
    type: 'speed',
    timeLimit: 30,
    targetTasks: 3,
    multiplier: 2.0,
    icon: '⚡',
    isActive: false,
    participantCount: 847
  },
  {
    id: 'marathon_master',
    title: 'Mestre da Maratona',
    description: 'Complete tarefas por 2 horas seguidas',
    type: 'endurance',
    timeLimit: 120,
    targetTasks: 8,
    multiplier: 3.0,
    icon: '🏃‍♂️',
    isActive: false,
    participantCount: 234
  },
  {
    id: 'precision_ace',
    title: 'Ás da Precisão',
    description: 'Complete 5 tarefas sem erros',
    type: 'precision',
    timeLimit: 60,
    targetTasks: 5,
    multiplier: 2.5,
    icon: '🎯',
    isActive: false,
    participantCount: 156
  },
  {
    id: 'combo_king',
    title: 'Rei do Combo',
    description: 'Complete tarefas em sequência perfeita',
    type: 'combo',
    timeLimit: 45,
    targetTasks: 4,
    multiplier: 4.0,
    icon: '🔥',
    isActive: false,
    participantCount: 89
  }
];

interface GoalChallengeSystemProps {
  className?: string;
}

export function GoalChallengeSystem({ className }: GoalChallengeSystemProps) {
  const { allTasks } = useTasks();
  const { addPoints, celebrateSuccess } = useGameification();
  const [challenges, setChallenges] = useState<Challenge[]>(DAILY_CHALLENGES);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Weekly Tournament System
  const [tournament, setTournament] = useState({
    name: 'Torneio Semanal de Produtividade',
    participants: 1247,
    myPosition: 42,
    prize: 1000,
    endsIn: '2d 14h 32m',
    topPlayers: [
      { name: 'TaskMaster_2024', points: 2850, avatar: '👑' },
      { name: 'ProductivityNinja', points: 2640, avatar: '🥷' },
      { name: 'GoalCrusher', points: 2480, avatar: '💪' }
    ]
  });

  // Começar desafio
  const startChallenge = (challenge: Challenge) => {
    const updatedChallenges = challenges.map(c => 
      c.id === challenge.id 
        ? { ...c, isActive: true, startTime: new Date() }
        : { ...c, isActive: false }
    );
    
    setChallenges(updatedChallenges);
    setActiveChallenge({ ...challenge, isActive: true, startTime: new Date() });
    setChallengeProgress(0);
    setTimeRemaining(challenge.timeLimit * 60); // converter para segundos
    
    celebrateSuccess(`🚀 Desafio "${challenge.title}" iniciado!`, 'achievement');
  };

  // Timer do desafio ativo
  useEffect(() => {
    if (activeChallenge && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Desafio terminou
            finishChallenge(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeChallenge, timeRemaining]);

  // Finalizar desafio
  const finishChallenge = (successful: boolean) => {
    if (!activeChallenge) return;

    if (successful) {
      const bonusPoints = 100 * activeChallenge.multiplier;
      addPoints(bonusPoints, `🏆 Desafio "${activeChallenge.title}" concluído!`);
      celebrateSuccess(`🎯 DESAFIO COMPLETO! +${bonusPoints} pontos!`, 'achievement');
    } else {
      celebrateSuccess(`⏰ Tempo esgotado no desafio "${activeChallenge.title}"`, 'warning');
    }

    setActiveChallenge(null);
    setChallengeProgress(0);
    setTimeRemaining(0);
    
    // Reset challenge
    setChallenges(prev => prev.map(c => ({ ...c, isActive: false })));
  };

  // Calcular progresso do desafio baseado nas tarefas
  useEffect(() => {
    if (activeChallenge) {
      const recentTasks = allTasks.filter(task => {
        if (!task.completed_at || !activeChallenge.startTime) return false;
        return new Date(task.completed_at) >= activeChallenge.startTime;
      });

      const progress = Math.min(recentTasks.length, activeChallenge.targetTasks);
      setChallengeProgress(progress);

      if (progress >= activeChallenge.targetTasks) {
        finishChallenge(true);
      }
    }
  }, [allTasks, activeChallenge]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChallengeColor = (type: Challenge['type']) => {
    switch (type) {
      case 'speed': return 'from-blue-500 to-cyan-500';
      case 'endurance': return 'from-green-500 to-emerald-500';
      case 'precision': return 'from-purple-500 to-pink-500';
      case 'combo': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={className}>
      {/* Desafio Ativo */}
      {activeChallenge && (
        <Card className="mb-6 border-4 border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-bounce">{activeChallenge.icon}</span>
                <div>
                  <CardTitle className="text-xl text-orange-600">
                    DESAFIO ATIVO: {activeChallenge.title}
                  </CardTitle>
                  <p className="text-orange-500">{activeChallenge.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-orange-500">restante</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progresso do Desafio</span>
                <span className="font-bold">
                  {challengeProgress} / {activeChallenge.targetTasks} tarefas
                </span>
              </div>
              
              <Progress 
                value={(challengeProgress / activeChallenge.targetTasks) * 100} 
                className="h-3"
              />
              
              <div className="flex justify-between items-center">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  x{activeChallenge.multiplier} Multiplicador
                </Badge>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => finishChallenge(false)}
                >
                  Abandonar Desafio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desafios Diários */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Swords className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-600">DESAFIOS DIÁRIOS</h2>
          <Badge variant="outline">Resetam em 14h 32m</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id}
              className={`transition-all duration-300 hover:scale-102 ${
                challenge.isActive ? 'ring-2 ring-orange-500' : 'hover:shadow-lg'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getChallengeColor(challenge.type)} flex items-center justify-center text-2xl shadow-lg`}>
                      {challenge.icon}
                    </div>
                    <div>
                      <CardTitle className="text-base">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold">{challenge.timeLimit}min</div>
                    <div className="text-muted-foreground">Tempo</div>
                  </div>
                  <div>
                    <div className="font-bold">{challenge.targetTasks}</div>
                    <div className="text-muted-foreground">Tarefas</div>
                  </div>
                  <div>
                    <div className="font-bold">x{challenge.multiplier}</div>
                    <div className="text-muted-foreground">Multiplicador</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{challenge.participantCount} participantes</span>
                  </div>
                  
                  <Button
                    size="sm"
                    disabled={!!activeChallenge}
                    onClick={() => startChallenge(challenge)}
                    className={`bg-gradient-to-r ${getChallengeColor(challenge.type)} text-white border-0`}
                  >
                    {challenge.isActive ? 'Em Progresso' : 'Iniciar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Torneio Semanal */}
      <Card className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <CardTitle className="text-xl">{tournament.name}</CardTitle>
                <p className="text-purple-200">
                  {tournament.participants.toLocaleString()} gladiadores competindo
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                #{tournament.myPosition}
              </div>
              <div className="text-sm text-purple-200">sua posição</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ranking dos Top Players */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                TOP 3 GLADIADORES
              </h3>
              
              <div className="space-y-2">
                {tournament.topPlayers.map((player, index) => (
                  <div 
                    key={player.name}
                    className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                  >
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <span className="text-lg">{player.avatar}</span>
                    <div className="flex-1">
                      <div className="font-bold">{player.name}</div>
                      <div className="text-sm text-purple-200">
                        {player.points.toLocaleString()} pontos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Informações do Prêmio */}
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                PRÊMIOS ÉPICOS
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-lg font-bold text-yellow-400">
                    🏆 1º Lugar
                  </div>
                  <div>1.000 pontos + Título "Mestre Supremo"</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-lg font-bold text-gray-300">
                    🥈 2º-3º Lugar
                  </div>
                  <div>500 pontos + Título "Gladiador Elite"</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-lg font-bold text-orange-400">
                    🥉 Top 10
                  </div>
                  <div>200 pontos + Título "Competidor"</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Badge className="bg-yellow-400 text-yellow-900 text-lg px-4 py-2">
              ⏰ Termina em: {tournament.endsIn}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}