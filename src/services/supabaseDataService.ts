
import { supabase } from '@/integrations/supabase/client';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, ProductivityStats, TaskCategory, TaskPriority, TaskChecklistItem } from '@/types/task';
import { ApiResponse } from '@/types/database';
import { GameStats, Achievement } from '@/hooks/useGameification';

export class SupabaseDataService {
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          task_checklist_items (*)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.completed !== undefined) {
        query = query.eq('completed', filters.completed);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          success: false,
          error: error.message
        };
      }

      // Transformar dados para o formato esperado
      const tasks: Task[] = (data || []).map(task => ({
        ...task,
        category: task.category as TaskCategory,
        priority: task.priority as TaskPriority,
        isUrgent: task.is_urgent,
        isImportant: task.is_important,
        start_date: task.start_date ? new Date(task.start_date) : undefined,
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at),
        checklist: (task.task_checklist_items || []).map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at)
        }))
      }));

      return {
        data: tasks,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Erro inesperado ao buscar tarefas'
      };
    }
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_checklist_items (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        return {
          data: {} as Task,
          success: false,
          error: error.message
        };
      }

      const task: Task = {
        ...data,
        category: data.category as TaskCategory,
        priority: data.priority as TaskPriority,
        isUrgent: data.is_urgent,
        isImportant: data.is_important,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        completed_at: data.completed_at ? new Date(data.completed_at) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        checklist: (data.task_checklist_items || []).map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at)
        }))
      };

      return {
        data: task,
        success: true
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Erro ao buscar tarefa'
      };
    }
  }

  async createTask(taskData: CreateTaskDTO): Promise<ApiResponse<Task>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as Task,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const insertData = {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        user_id: user.id,
        is_urgent: taskData.isUrgent || false,
        is_important: taskData.isImportant || false,
        start_date: taskData.start_date?.toISOString(),
        due_date: taskData.due_date?.toISOString(),
        estimated_time: taskData.estimated_time,
        meeting_url: taskData.meeting_url,
        location: taskData.location,
        attendees: taskData.attendees,
        meeting_notes: taskData.meeting_notes,
        reminder_minutes: taskData.reminder_minutes
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        return {
          data: {} as Task,
          success: false,
          error: error.message
        };
      }

      // Create checklist items if provided
      let checklistItems: TaskChecklistItem[] = [];
      if (taskData.checklist && taskData.checklist.length > 0) {
        const checklistData = taskData.checklist.map((item, index) => ({
          title: item.title,
          completed: item.completed,
          task_id: data.id,
          order_index: index
        }));

        const { data: checklistResult, error: checklistError } = await supabase
          .from('task_checklist_items')
          .insert(checklistData)
          .select();

        if (!checklistError && checklistResult) {
          checklistItems = checklistResult.map((item: any) => ({
            ...item,
            created_at: new Date(item.created_at),
            updated_at: new Date(item.updated_at)
          }));
        }
      }

      const task: Task = {
        ...data,
        category: data.category as TaskCategory,
        priority: data.priority as TaskPriority,
        isUrgent: data.is_urgent,
        isImportant: data.is_important,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        completed_at: data.completed_at ? new Date(data.completed_at) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        checklist: checklistItems
      };

      return {
        data: task,
        success: true,
        message: 'Tarefa criada com sucesso'
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Erro ao criar tarefa'
      };
    }
  }

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<ApiResponse<Task>> {
    try {
      const updateData: any = { ...updates };
      
      if (updates.isUrgent !== undefined) {
        updateData.is_urgent = updates.isUrgent;
        delete updateData.isUrgent;
      }
      if (updates.isImportant !== undefined) {
        updateData.is_important = updates.isImportant;
        delete updateData.isImportant;
      }
      if (updates.start_date) {
        updateData.start_date = updates.start_date.toISOString();
      }
      if (updates.due_date) {
        updateData.due_date = updates.due_date.toISOString();
      }
      if (updates.completed === true && !updateData.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      // Handle checklist updates separately
      if (updates.checklist) {
        // First, delete existing checklist items
        await supabase
          .from('task_checklist_items')
          .delete()
          .eq('task_id', id);
        
        // Then create new ones
        if (updates.checklist.length > 0) {
          const checklistData = updates.checklist.map((item, index) => ({
            title: item.title,
            completed: item.completed,
            task_id: id,
            order_index: index
          }));

          await supabase
            .from('task_checklist_items')
            .insert(checklistData);
        }
        
        // Remove checklist from updateData as it's handled separately
        delete updateData.checklist;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          task_checklist_items (*)
        `)
        .single();

      if (error) {
        return {
          data: {} as Task,
          success: false,
          error: error.message
        };
      }

      const task: Task = {
        ...data,
        category: data.category as TaskCategory,
        priority: data.priority as TaskPriority,
        isUrgent: data.is_urgent,
        isImportant: data.is_important,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        due_date: data.due_date ? new Date(data.due_date) : undefined,
        completed_at: data.completed_at ? new Date(data.completed_at) : undefined,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
        checklist: (data.task_checklist_items || []).map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at)
        }))
      };

      return {
        data: task,
        success: true,
        message: 'Tarefa atualizada com sucesso'
      };
    } catch (error) {
      return {
        data: {} as Task,
        success: false,
        error: 'Erro ao atualizar tarefa'
      };
    }
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: undefined,
          success: false,
          error: error.message
        };
      }

      return {
        data: undefined,
        success: true,
        message: 'Tarefa excluída com sucesso'
      };
    } catch (error) {
      return {
        data: undefined,
        success: false,
        error: 'Erro ao excluir tarefa'
      };
    }
  }

  async getProductivityStats(): Promise<ApiResponse<ProductivityStats>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as ProductivityStats,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('productivity_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('calculated_at', today)
        .maybeSingle();

      if (error) {
        return {
          data: {} as ProductivityStats,
          success: false,
          error: error.message
        };
      }

      if (!data) {
        // Calcular estatísticas em tempo real se não existir registro
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', today);

        const totalTasks = tasks?.length || 0;
        const completedTasks = tasks?.filter(t => t.completed).length || 0;
        const focusTime = tasks?.reduce((total, task) => total + (task.actual_time || 0), 0) || 0;
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          data: {
            tasksCompleted: completedTasks,
            totalTasks,
            focusTime,
            productivityScore,
            streak: 0,
            calculated_at: new Date()
          },
          success: true
        };
      }

      return {
        data: {
          tasksCompleted: data.tasks_completed,
          totalTasks: data.total_tasks,
          focusTime: data.focus_time,
          productivityScore: data.productivity_score,
          streak: data.streak,
          calculated_at: new Date(data.calculated_at)
        },
        success: true
      };
    } catch (error) {
      return {
        data: {} as ProductivityStats,
        success: false,
        error: 'Erro ao calcular estatísticas'
      };
    }
  }

  async getGameStats(): Promise<ApiResponse<GameStats>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as GameStats,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const { data, error } = await supabase
        .from('user_game_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        return {
          data: {} as GameStats,
          success: false,
          error: error.message
        };
      }

      if (!data) {
        // Retornar stats padrão se não existir
        return {
          data: {
            totalPoints: 0,
            level: 1,
            tasksCompleted: 0,
            currentStreak: 0,
            achievements: []
          },
          success: true
        };
      }

      const gameStats: GameStats = {
        totalPoints: data.points,
        level: data.level,
        tasksCompleted: 0, // Calcular em tempo real
        currentStreak: data.streak,
        achievements: Array.isArray(data.achievements) ? (data.achievements as unknown as Achievement[]) : []
      };

      return {
        data: gameStats,
        success: true
      };
    } catch (error) {
      return {
        data: {} as GameStats,
        success: false,
        error: 'Erro ao buscar estatísticas do jogo'
      };
    }
  }

  async updateGameStats(stats: Partial<GameStats>): Promise<ApiResponse<GameStats>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as GameStats,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const updateData: any = {};
      if (stats.totalPoints !== undefined) updateData.points = stats.totalPoints;
      if (stats.level !== undefined) updateData.level = stats.level;
      if (stats.currentStreak !== undefined) updateData.streak = stats.currentStreak;
      if (stats.achievements !== undefined) updateData.achievements = stats.achievements;

      const { data, error } = await supabase
        .from('user_game_stats')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: {} as GameStats,
          success: false,
          error: error.message
        };
      }

      if (!data) {
        return {
          data: {} as GameStats,
          success: false,
          error: 'Erro ao atualizar estatísticas'
        };
      }

      return {
        data: {
          totalPoints: data.points,
          level: data.level,
          tasksCompleted: stats.tasksCompleted || 0,
          currentStreak: data.streak,
          achievements: Array.isArray(data.achievements) ? (data.achievements as unknown as Achievement[]) : []
        },
        success: true
      };
    } catch (error) {
      return {
        data: {} as GameStats,
        success: false,
        error: 'Erro ao atualizar estatísticas do jogo'
      };
    }
  }

  async updateChecklistItem(itemId: string, completed: boolean): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('task_checklist_items')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) {
        return {
          data: undefined,
          success: false,
          error: error.message
        };
      }

      return {
        data: undefined,
        success: true,
        message: 'Item do checklist atualizado com sucesso'
      };
    } catch (error) {
      return {
        data: undefined,
        success: false,
        error: 'Erro ao atualizar item do checklist'
      };
    }
  }

  // ============= NOTES MANAGEMENT =============
  
  async getNotes(): Promise<ApiResponse<Note[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: [],
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        return {
          data: [],
          success: false,
          error: error.message
        };
      }

      return {
        data: data || [],
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Erro ao buscar anotações'
      };
    }
  }

  async createNote(noteData: { title: string; content?: string }): Promise<ApiResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as Note,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const { data, error } = await supabase
        .from('notes')
        .insert({
          title: noteData.title,
          content: noteData.content || '',
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        return {
          data: {} as Note,
          success: false,
          error: error.message
        };
      }

      return {
        data: data,
        success: true,
        message: 'Anotação criada com sucesso'
      };
    } catch (error) {
      return {
        data: {} as Note,
        success: false,
        error: 'Erro ao criar anotação'
      };
    }
  }

  async updateNote(id: string, updates: { title?: string; content?: string }): Promise<ApiResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: {} as Note,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return {
          data: {} as Note,
          success: false,
          error: error.message
        };
      }

      return {
        data: data,
        success: true,
        message: 'Anotação atualizada com sucesso'
      };
    } catch (error) {
      return {
        data: {} as Note,
        success: false,
        error: 'Erro ao atualizar anotação'
      };
    }
  }

  async deleteNote(id: string): Promise<ApiResponse<void>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          data: undefined,
          success: false,
          error: 'Usuário não autenticado'
        };
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return {
          data: undefined,
          success: false,
          error: error.message
        };
      }

      return {
        data: undefined,
        success: true,
        message: 'Anotação excluída com sucesso'
      };
    } catch (error) {
      return {
        data: undefined,
        success: false,
        error: 'Erro ao excluir anotação'
      };
    }
  }

  async syncTasks(): Promise<ApiResponse<{ synced: number; conflicts: number }>> {
    return {
      data: { synced: 0, conflicts: 0 },
      success: true,
      message: 'Dados sincronizados automaticamente com Supabase'
    };
  }
}

// Interfaces para notas
interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const supabaseDataService = new SupabaseDataService();
