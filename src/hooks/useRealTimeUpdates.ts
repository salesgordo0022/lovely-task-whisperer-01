import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';

interface UseRealTimeUpdatesProps {
  onTaskInsert?: (task: Task) => void;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onChecklistUpdate?: (taskId: string) => void;
}

export function useRealTimeUpdates({
  onTaskInsert,
  onTaskUpdate,
  onTaskDelete,
  onChecklistUpdate,
}: UseRealTimeUpdatesProps) {
  
  const handleTasksChanges = useCallback((payload: any) => {
    console.log('🔄 Real-time task change:', payload.eventType);
    
    switch (payload.eventType) {
      case 'INSERT':
        console.log('✨ New task inserted:', payload.new);
        if (onTaskInsert && payload.new) {
          const task = {
            ...payload.new,
            isUrgent: payload.new.is_urgent,
            isImportant: payload.new.is_important,
            start_date: payload.new.start_date ? new Date(payload.new.start_date) : undefined,
            due_date: payload.new.due_date ? new Date(payload.new.due_date) : undefined,
            created_at: new Date(payload.new.created_at),
            updated_at: new Date(payload.new.updated_at),
            checklist: []
          };
          onTaskInsert(task as Task);
        }
        break;
      case 'UPDATE':
        console.log('🔄 Task updated:', payload.new);
        if (onTaskUpdate && payload.new) {
          const task = {
            ...payload.new,
            isUrgent: payload.new.is_urgent,
            isImportant: payload.new.is_important,
            start_date: payload.new.start_date ? new Date(payload.new.start_date) : undefined,
            due_date: payload.new.due_date ? new Date(payload.new.due_date) : undefined,
            created_at: new Date(payload.new.created_at),
            updated_at: new Date(payload.new.updated_at),
            checklist: []
          };
          onTaskUpdate(task as Task);
        }
        break;
      case 'DELETE':
        console.log('🗑️ Task deleted:', payload.old?.id);
        if (onTaskDelete && payload.old) {
          onTaskDelete(payload.old.id);
        }
        break;
    }
  }, [onTaskInsert, onTaskUpdate, onTaskDelete]);

  const handleChecklistChanges = useCallback((payload: any) => {
    console.log('✅ Checklist change:', payload.eventType);
    
    if (onChecklistUpdate && payload.new?.task_id) {
      onChecklistUpdate(payload.new.task_id);
    }
  }, [onChecklistUpdate]);

  useEffect(() => {
    // Subscribe to tasks changes
    const tasksChannel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        handleTasksChanges
      )
      .subscribe();

    // Subscribe to checklist changes
    const checklistChannel = supabase
      .channel('checklist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_checklist_items'
        },
        handleChecklistChanges
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(checklistChannel);
    };
  }, [handleTasksChanges, handleChecklistChanges]);

  return {
    // Retorna métodos para controle manual se necessário
    subscribeToTasks: handleTasksChanges,
    subscribeToChecklist: handleChecklistChanges,
  };
}