import { useOptimizedTasks } from './useOptimizedTasks';

// Compatibilidade backward - exporta o hook otimizado
export function useTasks() {
  return useOptimizedTasks();
}