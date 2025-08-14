import { memo } from 'react';
import { ProductivityDashboard } from '../ProductivityDashboard';
import { ProductivityStats } from '@/types/task';

interface MemoizedProductivityDashboardProps {
  stats: ProductivityStats;
  tasksByCategory: {
    personal: { total: number; completed: number; urgent: number };
    work: { total: number; completed: number; urgent: number };
    agenda: { total: number; completed: number; urgent: number };
  };
}

// Dashboard memoizado para evitar recálculos desnecessários
export const MemoizedProductivityDashboard = memo(function MemoizedProductivityDashboard(props: MemoizedProductivityDashboardProps) {
  return <ProductivityDashboard {...props} />;
}, (prevProps, nextProps) => {
  // Comparação otimizada das estatísticas
  const statsChanged = 
    prevProps.stats.tasksCompleted !== nextProps.stats.tasksCompleted ||
    prevProps.stats.totalTasks !== nextProps.stats.totalTasks ||
    prevProps.stats.productivityScore !== nextProps.stats.productivityScore ||
    prevProps.stats.focusTime !== nextProps.stats.focusTime;

  const categoriesChanged = 
    JSON.stringify(prevProps.tasksByCategory) !== JSON.stringify(nextProps.tasksByCategory);

  return !statsChanged && !categoriesChanged;
});