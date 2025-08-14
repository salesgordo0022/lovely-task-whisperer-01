import { memo } from 'react';
import { CategorySection } from '../CategorySection';
import { Task, TaskCategory } from '@/types/task';

interface MemoizedCategorySectionProps {
  title: string;
  category: TaskCategory;
  tasks: Task[];
  stats: {
    total: number;
    completed: number;
    urgent: number;
  };
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateChecklistItem?: (taskId: string, itemIndex: number, completed: boolean) => void;
}

// Componente memoizado para evitar re-renders desnecessários
export const MemoizedCategorySection = memo(function MemoizedCategorySection(props: MemoizedCategorySectionProps) {
  return <CategorySection {...props} />;
}, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  return (
    prevProps.title === nextProps.title &&
    prevProps.category === nextProps.category &&
    prevProps.tasks.length === nextProps.tasks.length &&
    prevProps.stats.total === nextProps.stats.total &&
    prevProps.stats.completed === nextProps.stats.completed &&
    prevProps.stats.urgent === nextProps.stats.urgent &&
    // Comparação superficial das tarefas por ID e status de completude
    prevProps.tasks.every((task, index) => {
      const nextTask = nextProps.tasks[index];
      return nextTask && 
        task.id === nextTask.id && 
        task.completed === nextTask.completed &&
        task.priority === nextTask.priority &&
        task.title === nextTask.title;
    })
  );
});