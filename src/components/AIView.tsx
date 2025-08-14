import { useState } from 'react';
import { Task, ProductivityStats } from '@/types/task';
import { AVAILABLE_CHARACTERS } from '@/types/character';
import { AIChat } from './AIChat';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, TrendingUp, Target } from 'lucide-react';
const characterAvatar = '/lovable-uploads/3ebb38af-6df7-4d03-92d3-a108904d9a1f.png';

interface AIViewProps {
  tasks: Task[];
  stats: ProductivityStats;
}

export function AIView({ tasks, stats }: AIViewProps) {
  const { getDisplayName } = useUserSettings();
  const selectedCharacter = AVAILABLE_CHARACTERS.find(c => c.id === 'ayanokoji') || AVAILABLE_CHARACTERS[0];

  const pendingTasks = tasks.filter(t => !t.completed);
  const overdueTasks = tasks.filter(t => 
    t.due_date && new Date(t.due_date) < new Date() && !t.completed
  );
  const urgentTasks = tasks.filter(t => t.isUrgent && !t.completed);

  return (
    <div className="space-y-6 macos-fade-in">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <img 
            src={characterAvatar} 
            alt="AI Assistant" 
            className="character-avatar"
          />
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Assistente IA</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Converse com assistentes inteligentes especializados em produtividade e estratégia pessoal.
          Obtenha insights personalizados com base nos seus dados e tarefas.
        </p>
      </div>

      {/* Status das Tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="macos-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{stats.productivityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="macos-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="macos-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="macos-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold">{urgentTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat */}
      <Card className="macos-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img 
              src={characterAvatar} 
              alt={selectedCharacter.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-2xl">{selectedCharacter.emoji}</div>
            Chat com {selectedCharacter.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] border rounded-lg">
            <AIChat
              tasks={tasks}
              stats={stats}
              className="h-full"
              userName={getDisplayName()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}