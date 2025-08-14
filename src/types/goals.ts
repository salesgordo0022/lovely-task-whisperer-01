export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  unit: 'tasks' | 'hours' | 'minutes' | 'points' | 'streak';
  category?: 'personal' | 'work' | 'agenda' | 'all';
  priority?: 'urgent' | 'important' | 'normal';
  startDate: Date;
  endDate: Date;
  completed: boolean;
  rewards: {
    points: number;
    badge?: string;
    title?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  type: Goal['type'];
  target: number;
  unit: Goal['unit'];
  rewards: Goal['rewards'];
  category?: Goal['category'];
  priority?: Goal['priority'];
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'daily_5_tasks',
    title: 'Dia Produtivo',
    description: 'Complete 5 tarefas em um dia',
    type: 'daily',
    target: 5,
    unit: 'tasks',
    rewards: {
      points: 50,
      badge: '⚡',
      title: 'Produtivo'
    }
  },
  {
    id: 'weekly_25_tasks',
    title: 'Semana Completa',
    description: 'Complete 25 tarefas em uma semana',
    type: 'weekly',
    target: 25,
    unit: 'tasks',
    rewards: {
      points: 200,
      badge: '🏆',
      title: 'Determinado'
    }
  },
  {
    id: 'daily_2_hours',
    title: 'Tempo Focado',
    description: 'Acumule 2 horas de tempo focado',
    type: 'daily',
    target: 120,
    unit: 'minutes',
    rewards: {
      points: 30,
      badge: '🎯',
      title: 'Focado'
    }
  },
  {
    id: 'weekly_streak_7',
    title: 'Sequência Semanal',
    description: 'Mantenha uma sequência de 7 dias',
    type: 'weekly',
    target: 7,
    unit: 'streak',
    rewards: {
      points: 100,
      badge: '🔥',
      title: 'Consistente'
    }
  },
  {
    id: 'monthly_work_tasks',
    title: 'Foco no Trabalho',
    description: 'Complete 50 tarefas de trabalho no mês',
    type: 'monthly',
    target: 50,
    unit: 'tasks',
    category: 'work',
    rewards: {
      points: 500,
      badge: '💼',
      title: 'Profissional'
    }
  },
  {
    id: 'monthly_personal_tasks',
    title: 'Cuidado Pessoal',
    description: 'Complete 30 tarefas pessoais no mês',
    type: 'monthly',
    target: 30,
    unit: 'tasks',
    category: 'personal',
    rewards: {
      points: 300,
      badge: '🏠',
      title: 'Equilibrado'
    }
  }
];