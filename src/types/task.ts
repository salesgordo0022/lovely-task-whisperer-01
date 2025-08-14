
import { SyncableEntity, QueryFilters } from './database';

export type TaskCategory = 'personal' | 'work' | 'agenda';

export type TaskPriority = 'urgent' | 'important' | 'normal';

export interface TaskChecklistItem extends SyncableEntity {
  title: string;
  completed: boolean;
  task_id: string;
  order_index: number;
}

export interface Task extends SyncableEntity {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  isUrgent: boolean;
  isImportant: boolean;
  start_date?: Date;
  due_date?: Date;
  estimated_time?: number; // em minutos
  actual_time?: number; // tempo real gasto
  completed_at?: Date;
  user_id?: string; // Para multi-usuário
  checklist: TaskChecklistItem[];
  
  // Campos específicos para compromissos/reuniões (categoria agenda)
  meeting_url?: string; // Link para reunião online
  location?: string; // Local da reunião/compromisso
  attendees?: string[]; // Lista de participantes
  meeting_notes?: string; // Notas da reunião
  reminder_minutes?: number; // Lembrete em minutos antes
}

export type ViewMode = 'productivity' | 'calendar' | 'focus' | 'eisenhower' | 'reports' | 'goals' | 'ai' | 'completed' | 'process' | 'notes';

export interface TaskFilters extends QueryFilters {
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  today?: boolean;
  overdue?: boolean;
  user_id?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
}

export interface ProductivityStats {
  tasksCompleted: number;
  totalTasks: number;
  focusTime: number;
  productivityScore: number;
  streak: number;
  user_id?: string;
  calculated_at: Date;
}

// DTOs para criação e atualização
export interface CreateTaskDTO {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  isUrgent?: boolean;
  isImportant?: boolean;
  start_date?: Date;
  due_date?: Date;
  estimated_time?: number;
  user_id?: string;
  checklist?: TaskChecklistItem[];
  
  // Campos específicos para compromissos/reuniões
  meeting_url?: string;
  location?: string;
  attendees?: string[];
  meeting_notes?: string;
  reminder_minutes?: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  isUrgent?: boolean;
  isImportant?: boolean;
  start_date?: Date;
  due_date?: Date;
  estimated_time?: number;
  actual_time?: number;
  
  // Campos específicos para compromissos/reuniões
  meeting_url?: string;
  location?: string;
  attendees?: string[];
  meeting_notes?: string;
  reminder_minutes?: number;
}

// Estatísticas agregadas
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  urgent: number;
  by_category: Record<TaskCategory, number>;
  by_priority: Record<TaskPriority, number>;
}
