import { useCallback, useEffect, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import { Task, TaskChecklistItem } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TaskCreateForm } from '@/components/TaskCreateForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Workflow } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProcessMapViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: (task: any) => void;
  onUpdateChecklistItem: (taskId: string, itemIndex: number, completed: boolean) => void;
}

export function ProcessMapView({ tasks, onCreateTask, onUpdateChecklistItem }: ProcessMapViewProps) {
  // SEO: título, descrição e canonical
  useEffect(() => {
    document.title = 'Organograma de Processos | Notebook';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Organograma de tarefas: visualize processos, conecte atividades e conclua checklists.');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  // Layout persistido
  const [positions, setPositions] = useLocalStorage<Record<string, { x: number; y: number }>>('process-map-positions', {});
  const [storedEdges, setStoredEdges] = useLocalStorage<Edge[]>('process-map-edges', []);

  // Nó selecionado
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Nós do React Flow a partir das tarefas
  const initialNodes: Node[] = useMemo(() => {
    return tasks.map((t, idx) => ({
      id: t.id,
      data: { label: t.title },
      position: positions[t.id] || { x: 80 + (idx % 5) * 180, y: 80 + Math.floor(idx / 5) * 120 },
      type: 'default',
    }));
  }, [tasks, positions]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storedEdges);

  // Persistir edges quando mudarem
  useEffect(() => {
    setStoredEdges(edges);
  }, [edges, setStoredEdges]);

  // Atualizar posições no localStorage quando arrastar
  const onNodeDragStop = useCallback((_: any, node: Node) => {
    setPositions((prev) => ({ ...prev, [node.id]: { x: node.position.x, y: node.position.y } }));
  }, [setPositions]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, [setEdges]);

  // Tarefa selecionada
  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId) || null, [tasks, selectedTaskId]);

  const handleToggleChecklist = (taskId: string, index: number, completed: boolean) => {
    onUpdateChecklistItem(taskId, index, completed);
  };

  return (
    <main className="grid grid-cols-1 xl:grid-cols-4 gap-6" role="main">
      {/* Canvas */}
      <section className="xl:col-span-3 min-h-[60vh]" aria-labelledby="mapa-processos">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle id="mapa-processos" className="flex items-center gap-2">
              <Workflow className="w-5 h-5" /> Organograma de Processos
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <TaskCreateForm onSubmit={onCreateTask} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="h-[70vh]">
            <div className="w-full h-full rounded-md border">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                onNodeClick={(_, n) => setSelectedTaskId(n.id)}
                onNodeDragStop={onNodeDragStop}
                proOptions={{ hideAttribution: true }}
              >
                <MiniMap zoomable pannable />
                <Controls />
                <Background />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Detalhes */}
      <aside className="xl:col-span-1" aria-label="Detalhes da tarefa selecionada">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalhes</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedTask ? (
              <p className="text-sm text-muted-foreground">Selecione uma tarefa no mapa para ver os detalhes.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{selectedTask.title}</h3>
                  <Badge variant={selectedTask.completed ? 'secondary' : 'outline'}>
                    {selectedTask.completed ? 'Concluída' : 'Pendente'}
                  </Badge>
                </div>
                {selectedTask.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTask.description}</p>
                )}

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Checklist (processo)</h4>
                  <ScrollArea className="max-h-60 pr-2">
                    {selectedTask.checklist?.length ? (
                      <div className="space-y-2">
                        {selectedTask.checklist.map((item: TaskChecklistItem, index: number) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card">
                            <Checkbox
                              checked={item.completed}
                              onCheckedChange={(checked) => handleToggleChecklist(selectedTask.id, index, Boolean(checked))}
                            />
                            <span className={item.completed ? 'line-through text-muted-foreground text-sm' : 'text-sm'}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Esta tarefa não possui checklist.</p>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
