
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { Task, ProductivityStats } from '@/types/task';
import { AIService, AIAnalysis } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface ReportsViewProps {
  tasks: Task[];
  stats: ProductivityStats;
}

export function ReportsView({ tasks, stats }: ReportsViewProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateAIAnalysis();
  }, [tasks, stats]);

  const generateAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const analysis = await AIService.analyzeProductivity(tasks, stats);
      setAiAnalysis(analysis);
      toast({
        title: "Análise IA Concluída",
        description: "Novos insights de produtividade disponíveis!"
      });
    } catch (error) {
      toast({
        title: "Erro na Análise",
        description: "Não foi possível gerar a análise. Usando dados básicos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dados para gráficos
  const categoryData = [
    { name: 'Trabalho', value: tasks.filter(t => t.category === 'work').length, color: '#3b82f6' },
    { name: 'Pessoal', value: tasks.filter(t => t.category === 'personal').length, color: '#10b981' },
    { name: 'Agenda', value: tasks.filter(t => t.category === 'agenda').length, color: '#8b5cf6' }
  ];

  const completionData = [
    { name: 'Concluídas', value: stats.tasksCompleted, color: '#10b981' },
    { name: 'Pendentes', value: stats.totalTasks - stats.tasksCompleted, color: '#f59e0b' }
  ];

  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayTasks = tasks.filter(t => 
      new Date(t.created_at).toDateString() === date.toDateString()
    );
    return {
      day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      completed: dayTasks.filter(t => t.completed).length,
      total: dayTasks.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios de Produtividade</h2>
          <p className="text-muted-foreground">
            Análise inteligente dos seus dados com insights de IA
          </p>
        </div>
        <Button onClick={generateAIAnalysis} disabled={isLoading}>
          <Brain className="w-4 h-4 mr-2" />
          {isLoading ? 'Analisando...' : 'Gerar Análise IA'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="ai-insights">Insights IA</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Score de Produtividade</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.productivityScore}%</div>
                <Progress value={stats.productivityScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
                <p className="text-xs text-muted-foreground">
                  de {stats.totalTasks} tarefas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo de Foco</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(stats.focusTime / 60)}h</div>
                <p className="text-xs text-muted-foreground">
                  {stats.focusTime} minutos total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sequência</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <p className="text-xs text-muted-foreground">
                  dias consecutivos
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status de Conclusão</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Gerando insights com IA...</span>
                </div>
              </CardContent>
            </Card>
          ) : aiAnalysis ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Insights da IA
                  </CardTitle>
                  <CardDescription>
                    Análise inteligente dos seus padrões de produtividade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiAnalysis.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Recomendações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {aiAnalysis.priorityTasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Tarefas Prioritárias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {aiAnalysis.priorityTasks.map((task, index) => (
                      <Badge key={index} variant="destructive" className="mr-2 mb-2">
                        {task}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Dicas de Gestão de Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiAnalysis.timeManagementTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Clique em "Gerar Análise IA" para obter insights detalhados</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progresso Semanal</CardTitle>
              <CardDescription>
                Evolução das suas tarefas nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Concluídas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {aiAnalysis?.weeklyGoals && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Metas Semanais Sugeridas pela IA
                </CardTitle>
                <CardDescription>
                  Objetivos personalizados baseados na sua análise de produtividade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiAnalysis.weeklyGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 border-2 border-primary rounded"></div>
                    <p className="text-sm">{goal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Conclusão</span>
                  <span className="text-sm font-medium">
                    {stats.totalTasks > 0 ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0} 
                  className="h-2" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Produtividade Geral</span>
                  <span className="text-sm font-medium">{stats.productivityScore}%</span>
                </div>
                <Progress value={stats.productivityScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
