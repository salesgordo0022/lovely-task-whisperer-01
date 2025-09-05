import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskFilters, ProductivityStats, CreateTaskDTO, UpdateTaskDTO } from '@/types/task';
import { supabaseDataService } from '@/services/supabaseDataService';
import { useToast } from './use-toast';
import { useGameification } from './useGameification';
import { useAuth } from './useAuth';

// Cache para otimização
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const tasksCache = new Map<string, { data: Task[]; timestamp: number }>();

export function useOptimizedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { completeTask } = useGameification();
  const { user, loading: authLoading } = useAuth();

  // Cache key baseada no usuário
  const cacheKey = user?.id || 'anonymous';

  // Carregar tarefas com cache otimizado
  const loadTasks = useCallback(async (forceRefresh = false) => {
    if (!user) return;

    // Verificar cache
    if (!forceRefresh) {
      const cached = tasksCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setTasks(cached.data);
        setLastSyncTime(new Date(cached.timestamp));
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await supabaseDataService.getTasks();
      if (result.success) {
        setTasks(result.data);
        
        // Atualizar cache
        tasksCache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now()
        });
        
        setLastSyncTime(new Date());
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tarefas';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, cacheKey, toast]);

  // Adicionar tarefa com otimização otimista
  const addTask = useCallback(async (taskData: CreateTaskDTO) => {
    if (!user) return;

    // Otimistic update
    const tempId = `temp_${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      user_id: user.id,
      title: taskData.title,
      description: taskData.description || null,
      category: taskData.category,
      priority: taskData.priority || 'normal',
      completed: false,
      due_date: taskData.due_date || null,
      start_date: taskData.start_date || null,
      estimated_time: taskData.estimated_time || null,
      actual_time: null,
      isUrgent: taskData.isUrgent || false,
      isImportant: taskData.isImportant || false,
      created_at: new Date(),
      updated_at: new Date(),
      completed_at: null,
      meeting_url: taskData.meeting_url || null,
      location: taskData.location || null,
      attendees: taskData.attendees || [],
      meeting_notes: taskData.meeting_notes || null,
      reminder_minutes: taskData.reminder_minutes || null,
      checklist: []
    };

    setTasks(prevTasks => [...prevTasks, tempTask]);

    try {
      const result = await supabaseDataService.createTask(taskData);
      
      if (result.success) {
        // Substituir tarefa temporária pela real
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === tempId ? result.data : task
          )
        );

        // Limpar cache para recarregar
        tasksCache.delete(cacheKey);

        toast({
          title: 'Sucesso',
          description: 'Tarefa criada com sucesso!'
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Reverter otimistic update
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempId));
      
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar tarefa';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [user, cacheKey, toast]);

  // Atualizar tarefa com otimização otimista
  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskDTO) => {
    if (!user) return null;

    // Otimistic update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              ...updates,
              updated_at: new Date() 
            }
          : task
      )
    );

    try {
      const result = await supabaseDataService.updateTask(taskId, updates);
      
      if (result.success) {
        // Atualizar com dados reais
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? result.data : task
          )
        );

        // Limpar cache
        tasksCache.delete(cacheKey);

        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Reverter otimistic update
      await loadTasks(true);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar tarefa';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    }
  }, [user, cacheKey, toast, loadTasks]);

  // Completar tarefa com gamificação
  const toggleTaskComplete = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    const updates: UpdateTaskDTO = {
      completed: newCompleted
    };

    const result = await updateTask(taskId, updates);
    
    if (result && newCompleted) {
      completeTask();
    }
  }, [tasks, updateTask, completeTask]);

  // Deletar tarefa
  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    // Otimistic update
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    try {
      await supabaseDataService.deleteTask(taskId);
      
      // Limpar cache
      tasksCache.delete(cacheKey);

      toast({
        title: 'Sucesso',
        description: 'Tarefa removida com sucesso!'
      });
    } catch (error) {
      // Reverter otimistic update
      await loadTasks(true);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover tarefa';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [user, cacheKey, toast, loadTasks]);

  // Filtrar tarefas com performance otimizada
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.completed !== undefined && task.completed !== filters.completed) return false;
      if (filters.category && task.category !== filters.category) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          false
        );
      }
      return true;
    });
  }, [tasks, filters]);

  // Estatísticas de produtividade otimizadas - apenas para hoje
  const productivityStats = useMemo((): ProductivityStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tarefas que devem ser feitas hoje (criadas hoje ou com due_date hoje)
    const tasksForToday = tasks.filter(t => {
      const createdToday = new Date(t.created_at) >= today && new Date(t.created_at) < tomorrow;
      const dueToday = t.due_date && new Date(t.due_date) >= today && new Date(t.due_date) < tomorrow;
      return createdToday || dueToday;
    });

    // Tarefas concluídas hoje
    const completedToday = tasks.filter(t => 
      t.completed && t.completed_at && 
      new Date(t.completed_at) >= today && 
      new Date(t.completed_at) < tomorrow
    );

    // Calcular produtividade baseada apenas em tarefas de hoje
    const todayProductivityScore = tasksForToday.length > 0 
      ? (completedToday.length / tasksForToday.length) * 100 
      : 0;

    return {
      tasksCompleted: completedToday.length,
      totalTasks: tasksForToday.length,
      focusTime: 0,
      productivityScore: todayProductivityScore,
      streak: 0,
      calculated_at: new Date()
    };
  }, [tasks]);

  // Carregar tarefas quando o usuário logar
  useEffect(() => {
    if (user && !authLoading) {
      loadTasks();
    }
  }, [user, authLoading, loadTasks]);

  // Sincronização automática a cada 5 minutos
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadTasks(true);
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [user, loadTasks]);

  // Funções agrupadas por categoria (para compatibilidade)
  const tasksByCategory = useMemo(() => {
    const categoriesData = {
      personal: {
        tasks: tasks.filter(t => t.category === 'personal'),
        total: 0,
        completed: 0,
        urgent: 0
      },
      work: {
        tasks: tasks.filter(t => t.category === 'work'),
        total: 0,
        completed: 0,
        urgent: 0
      },
      agenda: {
        tasks: tasks.filter(t => t.category === 'agenda'),
        total: 0,
        completed: 0,
        urgent: 0
      }
    };

    // Calcular estatísticas para cada categoria
    Object.keys(categoriesData).forEach(category => {
      const categoryTasks = categoriesData[category as keyof typeof categoriesData].tasks;
      categoriesData[category as keyof typeof categoriesData].total = categoryTasks.length;
      categoriesData[category as keyof typeof categoriesData].completed = categoryTasks.filter(t => t.completed).length;
      categoriesData[category as keyof typeof categoriesData].urgent = categoryTasks.filter(t => t.isUrgent === true).length;
    });

    return categoriesData;
  }, [tasks]);

  // Tarefas agrupadas por matriz Eisenhower (para compatibilidade)
  const tasksByEisenhower = useMemo(() => {
    return {
      urgent_important: tasks.filter(t => !t.completed && (t.isUrgent === true) && (t.isImportant === true)),
      urgent_not_important: tasks.filter(t => !t.completed && (t.isUrgent === true) && (t.isImportant !== true)),
      not_urgent_important: tasks.filter(t => !t.completed && (t.isUrgent !== true) && (t.isImportant === true)),
      not_urgent_not_important: tasks.filter(t => !t.completed && (t.isUrgent !== true) && (t.isImportant !== true))
    };
  }, [tasks]);

  // Atualizar item do checklist - funcionalidade corrigida
  const updateChecklistItem = useCallback(async (taskId: string, itemIndex: number, completed: boolean) => {
    console.log('Atualizando checklist:', { taskId, itemIndex, completed });
    
    try {
      // Find the task in current state
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.checklist || itemIndex >= task.checklist.length) {
        console.error('Tarefa ou item do checklist não encontrado');
        return;
      }

      // Call the API method for updating checklist items
      const result = await supabaseDataService.updateChecklistItem(taskId, itemIndex, completed);
      
      if (!result.success) {
        console.error('Erro ao atualizar checklist:', result.error);
        toast({
          title: 'Erro',
          description: result.error || 'Erro ao atualizar checklist',
          variant: 'destructive'
        });
        return;
      }

      // Update state with server response (force re-render by creating new array)
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(t => {
          if (t.id === taskId) {
            return { ...result.data };
          }
          return t;
        });
        return [...newTasks]; // Force new array reference
      });
      
      console.log('Checklist atualizado com sucesso');
      
      // Force cache refresh
      setLastSyncTime(new Date());
      
    } catch (error) {
      console.error('Erro inesperado ao atualizar checklist:', error);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao atualizar checklist',
        variant: 'destructive'
      });
    }
  }, [tasks, toast]);

  // Aliases para compatibilidade backward
  const createTask = addTask;
  const toggleTask = toggleTaskComplete;

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    isLoading,
    error,
    lastSyncTime,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    productivityStats,
    // Compatibilidade backward
    tasksByCategory,
    tasksByEisenhower,
    createTask,
    toggleTask,
    updateChecklistItem
  };
}