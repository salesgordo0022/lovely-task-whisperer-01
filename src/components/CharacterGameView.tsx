import { useState } from 'react';
import { Character } from '@/types/character';
import { useCharacterGame } from '@/hooks/useCharacterGame';
import { useTasks } from '@/hooks/useTasks';
import { useGameification } from '@/hooks/useGameification';
import { CharacterChat } from './CharacterChat';
import { Trail3D } from './Trail3D';
import { GameNotification } from './GameNotification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const characterAvatar = '/lovable-uploads/3ebb38af-6df7-4d03-92d3-a108904d9a1f.png';
import { 
  Heart, 
  Skull, 
  Flame, 
  Trophy, 
  RotateCcw, 
  Play,
  Target,
  Calendar,
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

interface CharacterGameViewProps {
  className?: string;
}

export function CharacterGameView({ className }: CharacterGameViewProps) {
  const { allTasks, productivityStats } = useTasks();
  const { notifications, removeNotification } = useGameification();
  const {
    availableCharacters,
    selectedCharacter,
    characterStats,
    characterGameData,
    selectCharacter,
    resetCharacter,
    todayTasks,
    todayCompletedTasks,
    trailProgress
  } = useCharacterGame(allTasks);

  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false);

  const handleSelectCharacter = (character: Character) => {
    selectCharacter(character);
    setIsCharacterDialogOpen(false);
  };

  const CharacterCard = ({ character }: { character: Character }) => (
    <Card 
      className="cursor-pointer macos-hover border-2 hover:border-primary"
      onClick={() => handleSelectCharacter(character)}
    >
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src={characterAvatar} 
            alt={character.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="text-4xl">{character.emoji}</div>
        </div>
        <CardTitle className="text-lg">{character.name}</CardTitle>
        <CardDescription className="text-sm">
          {character.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div 
          className="w-6 h-6 rounded-full mx-auto"
          style={{ backgroundColor: character.color }}
        />
      </CardContent>
    </Card>
  );

  if (!selectedCharacter || !characterStats) {
    return (
      <div className={`${className} macos-fade-in`}>
        {/* Notificações */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <GameNotification
              key={notification.id}
              {...notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={characterAvatar} 
                alt="Game Character" 
                className="character-avatar"
              />
              <h1 className="text-4xl font-bold">🎯 Metas das Tarefas</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Escolha seu personagem e embarque numa jornada épica de produtividade!
            </p>
          </div>

          {/* Como Funciona */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">📜 Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Trilha Diária</h3>
                  <p className="text-sm text-muted-foreground">
                    Cada tarefa é um ponto na trilha. Complete todas para vencer o dia!
                  </p>
                </div>
                <div>
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold">Sistema de Vidas</h3>
                  <p className="text-sm text-muted-foreground">
                    3 vidas no total. Perde uma vida se não completar o dia, ganha uma se completar!
                  </p>
                </div>
                <div>
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold">Ressurreição</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete um dia perfeito (3 vidas) para apagar uma morte do registro!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Personagem */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Escolha Seu Herói</CardTitle>
              <CardDescription>
                Cada personagem tem sua própria personalidade, mas todos são igualmente poderosos!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableCharacters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} macos-fade-in`}>
      {/* Notificações */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <GameNotification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="space-y-6">
        {/* Header com info do personagem */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={characterAvatar} 
              alt={selectedCharacter.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="text-6xl">{selectedCharacter.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold">{selectedCharacter.name}</h1>
              <p className="text-muted-foreground">{selectedCharacter.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={isCharacterDialogOpen} onOpenChange={setIsCharacterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Trocar Personagem
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Escolher Novo Personagem</DialogTitle>
                  <DialogDescription>
                    Atenção: Trocar de personagem resetará suas estatísticas!
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableCharacters.map((character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" onClick={resetCharacter}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3].map((i) => (
                  <Heart 
                    key={i} 
                    className={`w-4 h-4 ${i <= characterStats.lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Vidas</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{characterStats.deaths}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Skull className="w-3 h-3" />
                Mortes
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{characterStats.currentStreak}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Flame className="w-3 h-3" />
                Sequência
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{characterStats.totalDaysCompleted}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" />
                Dias Completos
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{characterStats.bestStreak}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Melhor Sequência
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso do dia */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>🗓️ Trilha de Hoje</CardTitle>
              <Badge variant={trailProgress === 100 ? "default" : "secondary"}>
                {characterStats.tasksCompletedToday}/{characterStats.totalTasksToday} tarefas
              </Badge>
            </div>
            <CardDescription>
              Complete todas as tarefas para conquistar o dia!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da Trilha</span>
                <span className="font-medium">{Math.round(trailProgress)}%</span>
              </div>
              <Progress value={trailProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Trilha 3D */}
        <Card>
          <CardHeader>
            <CardTitle>🛤️ Visualização da Trilha</CardTitle>
            <CardDescription>
              Veja seu personagem avançar conforme completa as tarefas!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Trail3D 
              character={selectedCharacter}
              stats={characterStats}
              todayTasks={todayTasks}
            />
          </CardContent>
        </Card>

        {/* Tarefas de hoje */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Tarefas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma tarefa para hoje. Crie algumas tarefas para começar suas metas!
              </p>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      task.completed ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      task.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'text-green-700 dark:text-green-300 line-through' : ''}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground">
                          {task.description}
                        </div>
                      )}
                    </div>
                    <Badge variant={task.completed ? "default" : "secondary"}>
                      {task.completed ? "✅ Completa" : "⏳ Pendente"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat com Personagem */}
        <CharacterChat 
          tasks={allTasks}
          stats={productivityStats}
        />
      </div>
    </div>
  );
}