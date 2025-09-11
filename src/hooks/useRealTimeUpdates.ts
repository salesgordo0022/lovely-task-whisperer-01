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
    // Handle real-time task changes
    
    switch (payload.eventType) {
      case 'INSERT':
        if (onTaskInsert && payload.new) {
          onTaskInsert(payload.new as Task);
        }
        break;
      case 'UPDATE':
        if (onTaskUpdate && payload.new) {
          onTaskUpdate(payload.new as Task);
        }
        break;
      case 'DELETE':
        if (onTaskDelete && payload.old) {
          onTaskDelete(payload.old.id);
        }
        break;
    }
  }, [onTaskInsert, onTaskUpdate, onTaskDelete]);

  const handleChecklistChanges = useCallback((payload: any) => {
    // Handle real-time checklist changes
    
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