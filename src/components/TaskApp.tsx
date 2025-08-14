
import { useState, useMemo, lazy, Suspense, memo, useCallback } from 'react';
import { ViewMode } from '@/types/task';
import { useTasks } from '@/hooks/useTasks';
import { ProductivityHeader } from './ProductivityHeader';
import { MemoizedProductivityDashboard } from './optimized/MemoizedProductivityDashboard';
import { MemoizedCategorySection } from './optimized/MemoizedCategorySection';
import { CompletedTasksSection } from './CompletedTasksSection';
import { QuickActions } from './QuickActions';
import { TaskCreateForm } from './TaskCreateForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Lazy loading para views pesadas
const CalendarView = lazy(() => import('./CalendarView').then(module => ({ default: module.CalendarView })));
const FocusView = lazy(() => import('./FocusView').then(module => ({ default: module.FocusView })));
const EisenhowerMatrix = lazy(() => import('./EisenhowerMatrix').then(module => ({ default: module.EisenhowerMatrix })));
const ReportsView = lazy(() => import('./ReportsView').then(module => ({ default: module.ReportsView })));
const CharacterGameView = lazy(() => import('./CharacterGameView').then(module => ({ default: module.CharacterGameView })));
const AIView = lazy(() => import('./AIView').then(module => ({ default: module.AIView })));
const ProcessMapView = lazy(() => import('./ProcessMapView').then(module => ({ default: module.ProcessMapView })));
const NotesView = lazy(() => import('./NotesView').then(module => ({ default: module.NotesView })));

// Loading component otimizado
const ViewLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

// Componente principal memoizado
const TaskAppContent = memo(function TaskAppContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('productivity');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'personal' | 'work' | 'agenda' | 'all'>('all');
  const taskManager = useTasks();

  // Memoização para evitar re-renders desnecessários
  const filteredTasks = useMemo(() => {
    const baseTasks = viewMode === 'productivity' 
      ? taskManager.allTasks.filter(t => !t.completed)  // Na aba produtividade, só tarefas pendentes
      : taskManager.allTasks;
    
    if (activeCategory === 'all') return baseTasks;
    return baseTasks.filter(t => t.category === activeCategory);
  }, [taskManager.allTasks, activeCategory, viewMode]);

  const categoryTasks = useMemo(() => ({
    personal: viewMode === 'productivity' 
      ? taskManager.allTasks.filter(t => t.category === 'personal' && !t.completed)
      : taskManager.allTasks.filter(t => t.category === 'personal'),
    work: viewMode === 'productivity' 
      ? taskManager.allTasks.filter(t => t.category === 'work' && !t.completed)
      : taskManager.allTasks.filter(t => t.category === 'work'),
    agenda: viewMode === 'productivity' 
      ? taskManager.allTasks.filter(t => t.category === 'agenda' && !t.completed)
      : taskManager.allTasks.filter(t => t.category === 'agenda'),
  }), [taskManager.allTasks, viewMode]);

  // Memoização das funções de callback
  const handleTaskCreate = useCallback((taskData: any) => {
    taskManager.createTask(taskData);
    setIsCreateDialogOpen(false);
  }, [taskManager.createTask]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleCategoryChange = useCallback((category: 'personal' | 'work' | 'agenda' | 'all') => {
    setActiveCategory(category);
  }, []);

  return (
    <div className="min-h-screen bg-background macos-fade-in">
      <div className="max-w-7xl mx-auto responsive-padding py-3 sm:py-4 lg:py-6">
        {/* Header responsivo */}
        <ProductivityHeader 
          viewMode={viewMode} 
          onViewModeChange={handleViewModeChange}
          productivityStats={taskManager.productivityStats}
        />

        {/* Conteúdo baseado no modo de visualização */}
        {viewMode === 'productivity' && (
          <>
            {/* Dashboard de produtividade otimizado */}
            <MemoizedProductivityDashboard 
              stats={taskManager.productivityStats}
              tasksByCategory={taskManager.tasksByCategory}
            />

            {/* Ações rápidas com layout responsivo */}
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <QuickActions 
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                filters={taskManager.filters}
                onFiltersChange={taskManager.setFilters}
              />
              
              {/* Botão flutuante otimizado para todas as telas */}
              <div className="flex justify-end mt-3 sm:mt-4">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="
                        sm:relative fixed bottom-4 right-4 z-50 sm:z-auto 
                        rounded-full sm:rounded-lg 
                        h-12 w-12 sm:h-auto sm:w-auto 
                        p-0 sm:px-4 sm:py-2
                        shadow-lg sm:shadow-md
                        bg-primary hover:bg-primary/90 
                        text-primary-foreground
                        macos-button
                        touch-target
                      "
                    >
                      <Plus className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="sr-only sm:not-sr-only sm:inline">Nova Tarefa</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="
                    sm:max-w-md 
                    w-[calc(100vw-1rem)] sm:w-full 
                    mx-2 sm:mx-0
                    max-h-[90vh] overflow-y-auto
                  ">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">Criar Nova Tarefa</DialogTitle>
                    </DialogHeader>
                    <TaskCreateForm onSubmit={handleTaskCreate} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Seções por categoria otimizadas */}
            <div className="responsive-gap flex flex-col pb-16 sm:pb-8">
              {activeCategory === 'all' ? (
                <>
                  <MemoizedCategorySection
                    title="🏠 Pessoal"
                    category="personal"
                    tasks={categoryTasks.personal}
                    stats={taskManager.tasksByCategory.personal}
                    onToggleTask={taskManager.toggleTask}
                    onUpdateTask={taskManager.updateTask}
                    onDeleteTask={taskManager.deleteTask}
                    onUpdateChecklistItem={taskManager.updateChecklistItem}
                  />
                  
                  <MemoizedCategorySection
                    title="💼 Trabalho"
                    category="work"
                    tasks={categoryTasks.work}
                    stats={taskManager.tasksByCategory.work}
                    onToggleTask={taskManager.toggleTask}
                    onUpdateTask={taskManager.updateTask}
                    onDeleteTask={taskManager.deleteTask}
                    onUpdateChecklistItem={taskManager.updateChecklistItem}
                  />
                  
                  <MemoizedCategorySection
                    title="📅 Compromissos & Reuniões"
                    category="agenda"
                    tasks={categoryTasks.agenda}
                    stats={taskManager.tasksByCategory.agenda}
                    onToggleTask={taskManager.toggleTask}
                    onUpdateTask={taskManager.updateTask}
                    onDeleteTask={taskManager.deleteTask}
                    onUpdateChecklistItem={taskManager.updateChecklistItem}
                  />
                </>
              ) : (
                <MemoizedCategorySection
                  title={
                    activeCategory === 'personal' ? '🏠 Pessoal' :
                    activeCategory === 'work' ? '💼 Trabalho' : '📅 Compromissos & Reuniões'
                  }
                  category={activeCategory as 'personal' | 'work' | 'agenda'}
                  tasks={filteredTasks}
                  stats={taskManager.tasksByCategory[activeCategory as 'personal' | 'work' | 'agenda']}
                  onToggleTask={taskManager.toggleTask}
                  onUpdateTask={taskManager.updateTask}
                  onDeleteTask={taskManager.deleteTask}
                  onUpdateChecklistItem={taskManager.updateChecklistItem}
                />
              )}
            </div>
          </>
        )}

        {/* View de tarefas concluídas */}
        {viewMode === 'completed' && (
          <div className="responsive-gap flex flex-col pb-16 sm:pb-8">
            {activeCategory === 'all' ? (
              <>
                <CompletedTasksSection
                  title="🏠 Pessoal"
                  category="personal"
                  tasks={taskManager.allTasks.filter(t => t.category === 'personal' && t.completed)}
                  onToggleTask={taskManager.toggleTask}
                  onUpdateTask={taskManager.updateTask}
                  onDeleteTask={taskManager.deleteTask}
                  onUpdateChecklistItem={taskManager.updateChecklistItem}
                />
                
                <CompletedTasksSection
                  title="💼 Trabalho"
                  category="work"
                  tasks={taskManager.allTasks.filter(t => t.category === 'work' && t.completed)}
                  onToggleTask={taskManager.toggleTask}
                  onUpdateTask={taskManager.updateTask}
                  onDeleteTask={taskManager.deleteTask}
                  onUpdateChecklistItem={taskManager.updateChecklistItem}
                />
                
                <CompletedTasksSection
                  title="📅 Compromissos & Reuniões"
                  category="agenda"
                  tasks={taskManager.allTasks.filter(t => t.category === 'agenda' && t.completed)}
                  onToggleTask={taskManager.toggleTask}
                  onUpdateTask={taskManager.updateTask}
                  onDeleteTask={taskManager.deleteTask}
                  onUpdateChecklistItem={taskManager.updateChecklistItem}
                />
              </>
            ) : (
              <CompletedTasksSection
                title={
                  activeCategory === 'personal' ? '🏠 Pessoal' :
                  activeCategory === 'work' ? '💼 Trabalho' : '📅 Compromissos & Reuniões'
                }
                category={activeCategory as 'personal' | 'work' | 'agenda'}
                tasks={taskManager.allTasks.filter(t => t.category === activeCategory && t.completed)}
                onToggleTask={taskManager.toggleTask}
                onUpdateTask={taskManager.updateTask}
                onDeleteTask={taskManager.deleteTask}
                onUpdateChecklistItem={taskManager.updateChecklistItem}
              />
            )}
          </div>
        )}

        {/* Views otimizadas com lazy loading */}
        <div className="pb-4 sm:pb-6 lg:pb-8">
          <Suspense fallback={<ViewLoader />}>
            {viewMode === 'calendar' && (
              <CalendarView
                tasks={taskManager.allTasks}
                onToggleTask={taskManager.toggleTask}
                onUpdateTask={taskManager.updateTask}
                onDeleteTask={taskManager.deleteTask}
              />
            )}

            {viewMode === 'focus' && (
              <FocusView
                tasks={taskManager.allTasks}
                onToggleTask={taskManager.toggleTask}
                onUpdateTask={taskManager.updateTask}
                onDeleteTask={taskManager.deleteTask}
              />
            )}

            {viewMode === 'eisenhower' && (
              <EisenhowerMatrix />
            )}

            {viewMode === 'goals' && (
              <CharacterGameView />
            )}

            {viewMode === 'reports' && (
              <ReportsView
                tasks={taskManager.allTasks}
                stats={taskManager.productivityStats}
              />
            )}

            {viewMode === 'notes' && (
              <NotesView />
            )}

            {viewMode === 'ai' && (
              <AIView 
                tasks={taskManager.allTasks}
                stats={taskManager.productivityStats}
              />
            )}

            {viewMode === 'process' && (
              <ProcessMapView 
                tasks={taskManager.allTasks}
                onToggleTask={taskManager.toggleTask}
                onUpdateTask={taskManager.updateTask}
                onDeleteTask={taskManager.deleteTask}
                onCreateTask={taskManager.createTask}
                onUpdateChecklistItem={taskManager.updateChecklistItem}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
});

// Wrapper principal exportado
export function TaskApp() {
  return <TaskAppContent />;
}
