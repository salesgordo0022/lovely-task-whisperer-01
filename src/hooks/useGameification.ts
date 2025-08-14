import { useState, useCallback, useEffect } from 'react';
import { supabaseDataService } from '@/services/supabaseDataService';
import { useAuth } from './useAuth';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'task_completed' | 'streak' | 'productivity' | 'milestone';
  points: number;
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'success' | 'achievement' | 'streak' | 'milestone' | 'error' | 'warning';
  points?: number;
  achievement?: Achievement;
  duration?: number;
}

export interface GameStats {
  totalPoints: number;
  level: number;
  tasksCompleted: number;
  currentStreak: number;
  achievements: Achievement[];
}

const ACHIEVEMENTS = {
  FIRST_TASK: {
    id: 'first_task',
    title: 'Primeira Conquista!',
    description: 'Você completou sua primeira tarefa!',
    icon: '🎯',
    type: 'task_completed' as const,
    points: 10
  },
  TASK_MASTER: {
    id: 'task_master',
    title: 'Mestre das Tarefas',
    description: 'Completou 10 tarefas!',
    icon: '🏆',
    type: 'milestone' as const,
    points: 50
  },
  STREAK_STARTER: {
    id: 'streak_starter',
    title: 'Sequência Iniciada',
    description: 'Manteve uma sequência de 3 dias!',
    icon: '🔥',
    type: 'streak' as const,
    points: 25
  },
  PRODUCTIVE_DAY: {
    id: 'productive_day',
    title: 'Dia Produtivo',
    description: 'Completou 5 tarefas em um dia!',
    icon: '⚡',
    type: 'productivity' as const,
    points: 30
  }
};

export function useGameification() {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [stats, setStats] = useState<GameStats>({
    totalPoints: 0,
    level: 1,
    tasksCompleted: 0,
    currentStreak: 0,
    achievements: []
  });
  const { user } = useAuth();

  const loadStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await supabaseDataService.getGameStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas do jogo:', error);
    }
  }, [user]);

  const saveStats = useCallback(async (newStats: GameStats) => {
    if (!user) return;
    
    try {
      const response = await supabaseDataService.updateGameStats(newStats);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erro ao salvar estatísticas do jogo:', error);
    }
  }, [user]);

  // Carregar stats quando usuário logar
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, loadStats]);

  const addNotification = useCallback((notification: Omit<GameNotification, 'id'>) => {
    const newNotification: GameNotification = {
      ...notification,
      id: Date.now().toString(),
      duration: notification.duration || 3000
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, newNotification.duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addPoints = useCallback((points: number, reason: string) => {
    const newStats = {
      ...stats,
      totalPoints: stats.totalPoints + points,
      level: Math.floor((stats.totalPoints + points) / 100) + 1
    };
    
    saveStats(newStats);
    
    addNotification({
      message: reason,
      type: 'success',
      points,
      duration: 2000
    });
  }, [stats, saveStats, addNotification]);

  const completeTask = useCallback(() => {
    const newStats = {
      ...stats,
      tasksCompleted: stats.tasksCompleted + 1,
      totalPoints: stats.totalPoints + 10
    };

    // Check for achievements
    if (newStats.tasksCompleted === 1) {
      const achievement = ACHIEVEMENTS.FIRST_TASK;
      if (!stats.achievements.find(a => a.id === achievement.id)) {
        newStats.achievements = [...stats.achievements, achievement];
        newStats.totalPoints += achievement.points;
        
        addNotification({
          message: 'Nova conquista desbloqueada!',
          type: 'achievement',
          achievement,
          duration: 4000
        });
      }
    }

    if (newStats.tasksCompleted === 10) {
      const achievement = ACHIEVEMENTS.TASK_MASTER;
      if (!stats.achievements.find(a => a.id === achievement.id)) {
        newStats.achievements = [...stats.achievements, achievement];
        newStats.totalPoints += achievement.points;
        
        addNotification({
          message: 'Nova conquista desbloqueada!',
          type: 'achievement',
          achievement,
          duration: 4000
        });
      }
    }

    // Check for daily productivity
    const today = new Date().toDateString();
    const tasksToday = newStats.tasksCompleted; // Simplificado para demo
    
    if (tasksToday === 5) {
      const achievement = ACHIEVEMENTS.PRODUCTIVE_DAY;
      addNotification({
        message: 'Dia muito produtivo!',
        type: 'milestone',
        achievement,
        duration: 3000
      });
    }

    newStats.level = Math.floor(newStats.totalPoints / 100) + 1;
    saveStats(newStats);
    
    addNotification({
      message: 'Tarefa completada! 🎉',
      type: 'success',
      points: 10,
      duration: 2000
    });
  }, [stats, saveStats, addNotification]);

  const updateStreak = useCallback((streakDays: number) => {
    const newStats = {
      ...stats,
      currentStreak: streakDays
    };

    if (streakDays === 3) {
      const achievement = ACHIEVEMENTS.STREAK_STARTER;
      if (!stats.achievements.find(a => a.id === achievement.id)) {
        newStats.achievements = [...stats.achievements, achievement];
        newStats.totalPoints += achievement.points;
        
        addNotification({
          message: 'Sequência iniciada!',
          type: 'streak',
          achievement,
          duration: 4000
        });
      }
    }

    if (streakDays > 0 && streakDays % 7 === 0) {
      addNotification({
        message: `${streakDays} dias em sequência! 🔥`,
        type: 'streak',
        points: streakDays * 2,
        duration: 3000
      });
      newStats.totalPoints += streakDays * 2;
    }

    newStats.level = Math.floor(newStats.totalPoints / 100) + 1;
    saveStats(newStats);
  }, [stats, saveStats, addNotification]);

  const celebrateSuccess = useCallback((message: string, type: GameNotification['type'] = 'success') => {
    addNotification({
      message,
      type,
      duration: 2500
    });
  }, [addNotification]);

  const showError = useCallback((message: string) => {
    addNotification({
      message,
      type: 'error',
      duration: 3000
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string) => {
    addNotification({
      message,
      type: 'warning',
      duration: 3000
    });
  }, [addNotification]);

  return {
    notifications,
    stats,
    addNotification,
    removeNotification,
    addPoints,
    completeTask,
    updateStreak,
    celebrateSuccess,
    showError,
    showWarning
  };
}
