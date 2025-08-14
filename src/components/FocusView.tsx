import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskItem } from './TaskItem';
import { 
  Timer, 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Target, 
  CheckCircle2,
  Clock,
  Zap,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

interface PomodoroState {
  isRunning: boolean;
  timeLeft: number; // em segundos
  currentCycle: 'work' | 'break';
  cycleCount: number;
  selectedTaskId: string | null;
  mode: 'pomodoro' | 'custom';
  customWorkTime: number;
  customBreakTime: number;
}

const WORK_TIME = 25 * 60; // 25 minutos
const SHORT_BREAK = 5 * 60; // 5 minutos
const LONG_BREAK = 15 * 60; // 15 minutos

export function FocusView({ tasks, onToggleTask, onUpdateTask, onDeleteTask }: FocusViewProps) {
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: WORK_TIME,
    currentCycle: 'work',
    cycleCount: 0,
    selectedTaskId: null,
    mode: 'pomodoro',
    customWorkTime: 25,
    customBreakTime: 5,
  });

  // Filtra tarefas pendentes para foco
  const pendingTasks = tasks.filter(task => !task.completed);
  const priorityTasks = pendingTasks.filter(task => task.priority === 'urgent' || task.priority === 'important');
  const todayTasks = pendingTasks.filter(task => {
    if (!task.due_date) return false;
    const today = new Date();
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === today.toDateString();
  });

  // Timer do Pomodoro
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (pomodoroState.isRunning && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (pomodoroState.timeLeft === 0) {
      // Ciclo concluído
      handleCycleComplete();
    }

    return () => clearInterval(interval);
  }, [pomodoroState.isRunning, pomodoroState.timeLeft]);

  const handleCycleComplete = () => {
    setPomodoroState(prev => {
      const newCycleCount = prev.currentCycle === 'work' ? prev.cycleCount + 1 : prev.cycleCount;
      const nextCycle = prev.currentCycle === 'work' ? 'break' : 'work';
      let nextTime: number;

      if (prev.mode === 'custom') {
        nextTime = nextCycle === 'work' ? prev.customWorkTime * 60 : prev.customBreakTime * 60;
      } else {
        if (nextCycle === 'break') {
          nextTime = newCycleCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
        } else {
          nextTime = WORK_TIME;
        }
      }

      return {
        ...prev,
        isRunning: false,
        timeLeft: nextTime,
        currentCycle: nextCycle,
        cycleCount: newCycleCount,
      };
    });
  };

  const startTimer = () => {
    setPomodoroState(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setPomodoroState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setPomodoroState(prev => {
      let timeLeft: number;
      if (prev.mode === 'custom') {
        timeLeft = prev.currentCycle === 'work' ? prev.customWorkTime * 60 : prev.customBreakTime * 60;
      } else {
        timeLeft = prev.currentCycle === 'work' ? WORK_TIME : 
                   prev.cycleCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
      }
      
      return {
        ...prev,
        isRunning: false,
        timeLeft,
      };
    });
  };

  const setCustomTime = (workTime: number, breakTime: number) => {
    setPomodoroState(prev => ({
      ...prev,
      mode: 'custom',
      customWorkTime: workTime,
      customBreakTime: breakTime,
      timeLeft: prev.currentCycle === 'work' ? workTime * 60 : breakTime * 60,
      isRunning: false,
    }));
  };

  const setPomodoroMode = () => {
    setPomodoroState(prev => ({
      ...prev,
      mode: 'pomodoro',
      timeLeft: prev.currentCycle === 'work' ? WORK_TIME : SHORT_BREAK,
      isRunning: false,
    }));
  };

  const selectTask = (taskId: string) => {
    setPomodoroState(prev => ({ ...prev, selectedTaskId: taskId }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    let totalTime: number;
    if (pomodoroState.mode === 'custom') {
      totalTime = pomodoroState.currentCycle === 'work' ? 
        pomodoroState.customWorkTime * 60 : pomodoroState.customBreakTime * 60;
    } else {
      totalTime = pomodoroState.currentCycle === 'work' ? WORK_TIME :
                  pomodoroState.cycleCount % 4 === 0 ? LONG_BREAK : SHORT_BREAK;
    }
    return ((totalTime - pomodoroState.timeLeft) / totalTime) * 100;
  };

  const selectedTask = pomodoroState.selectedTaskId 
    ? tasks.find(t => t.id === pomodoroState.selectedTaskId)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timer Pomodoro */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Sessão de Foco
            </CardTitle>
            <Tabs value={pomodoroState.mode} className="w-auto">
              <TabsList>
                <TabsTrigger value="pomodoro" onClick={setPomodoroMode}>
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger value="custom" onClick={() => setPomodoroState(prev => ({ ...prev, mode: 'custom' }))}>
                  Personalizado
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex gap-2">
            <Badge variant={pomodoroState.currentCycle === 'work' ? 'default' : 'secondary'}>
              {pomodoroState.currentCycle === 'work' ? (
                <>
                  <Target className="w-3 h-3 mr-1" />
                  Trabalho
                </>
              ) : (
                <>
                  <Coffee className="w-3 h-3 mr-1" />
                  Pausa
                </>
              )}
            </Badge>
            <Badge variant="outline">
              Ciclo {pomodoroState.cycleCount + 1}
            </Badge>
            <Badge variant="outline">
              {pomodoroState.mode === 'custom' ? 'Modo Personalizado' : 'Modo Pomodoro'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className={cn(
              "text-6xl font-mono font-bold mb-4",
              pomodoroState.currentCycle === 'work' ? "text-primary" : "text-green-600"
            )}>
              {formatTime(pomodoroState.timeLeft)}
            </div>
            <Progress 
              value={getProgress()} 
              className="h-3 mb-6"
            />
          </div>

          {/* Tarefa Selecionada */}
          {selectedTask && (
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Focando em:</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.title}</p>
                  </div>
                  <Badge variant={
                    selectedTask.priority === 'urgent' ? 'destructive' :
                    selectedTask.priority === 'important' ? 'default' : 'secondary'
                  }>
                    {selectedTask.priority === 'urgent' ? 'Urgente' :
                     selectedTask.priority === 'important' ? 'Importante' : 'Normal'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuração de Tempo Personalizado */}
          {pomodoroState.mode === 'custom' && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4" />
                  <h4 className="font-medium">Configurar Tempo Personalizado</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workTime" className="text-sm">Tempo de Trabalho (min)</Label>
                    <Input
                      id="workTime"
                      type="number"
                      min="1"
                      max="180"
                      value={pomodoroState.customWorkTime}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setCustomTime(value, pomodoroState.customBreakTime);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="breakTime" className="text-sm">Tempo de Pausa (min)</Label>
                    <Input
                      id="breakTime"
                      type="number"
                      min="1"
                      max="60"
                      value={pomodoroState.customBreakTime}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setCustomTime(pomodoroState.customWorkTime, value);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controles */}
          <div className="flex justify-center gap-3">
            {!pomodoroState.isRunning ? (
              <Button onClick={startTimer} size="lg" className="hover-lift">
                <Play className="w-4 h-4 mr-2" />
                Iniciar
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="outline" size="lg" className="hover-lift">
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            )}
            <Button onClick={resetTimer} variant="outline" size="lg">
              <Square className="w-4 h-4 mr-2" />
              Resetar
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{pomodoroState.cycleCount}</div>
              <div className="text-xs text-muted-foreground">Ciclos Completos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(pomodoroState.cycleCount * 25 / 60)}h {(pomodoroState.cycleCount * 25) % 60}m
              </div>
              <div className="text-xs text-muted-foreground">Tempo Focado</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Tarefas Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {priorityTasks.length}
              </div>
              <div className="text-xs text-muted-foreground">Alta Prioridade</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tarefas para Foco */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-4 h-4" />
            Tarefas para Foco
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tarefas de Hoje */}
          {todayTasks.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Para Hoje ({todayTasks.length})
              </h4>
              <div className="space-y-2">
                {todayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="space-y-2">
                    <TaskItem
                      task={task}
                      onToggle={() => onToggleTask(task.id)}
                      onUpdate={(updates) => onUpdateTask(task.id, updates)}
                      onDelete={() => onDeleteTask(task.id)}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => selectTask(task.id)}
                      disabled={task.completed}
                    >
                      <Target className="w-3 h-3 mr-1" />
                      Focar nesta tarefa
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarefas Prioritárias */}
          {priorityTasks.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Alta Prioridade ({priorityTasks.length})
              </h4>
              <div className="space-y-2">
                {priorityTasks
                  .filter(t => !todayTasks.includes(t))
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="space-y-2">
                      <TaskItem
                        task={task}
                        onToggle={() => onToggleTask(task.id)}
                        onUpdate={(updates) => onUpdateTask(task.id, updates)}
                        onDelete={() => onDeleteTask(task.id)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => selectTask(task.id)}
                        disabled={task.completed}
                      >
                        <Target className="w-3 h-3 mr-1" />
                        Focar nesta tarefa
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {pendingTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Todas as tarefas concluídas!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}