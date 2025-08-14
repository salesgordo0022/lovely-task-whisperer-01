import { useState, useEffect, useMemo } from 'react';
import { Goal, GoalTemplate, GOAL_TEMPLATES } from '@/types/goals';
import { Task } from '@/types/task';
import { useGameification } from './useGameification';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './use-toast';

export function useGoals(tasks: Task[]) {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const { addPoints, celebrateSuccess } = useGameification();
  const { toast } = useToast();

  const createGoalFromTemplate = (template: GoalTemplate) => {
    const now = new Date();
    let endDate = new Date();

    switch (template.type) {
      case 'daily':
        endDate.setDate(now.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        endDate.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(now.getMonth() + 1);
        break;
      default:
        endDate.setDate(now.getDate() + 30);
    }

    const newGoal: Goal = {
      id: `${template.id}_${Date.now()}`,
      title: template.title,
      description: template.description,
      type: template.type,
      target: template.target,
      current: 0,
      unit: template.unit,
      category: template.category,
      priority: template.priority,
      startDate: now,
      endDate,
      completed: false,
      rewards: template.rewards,
      createdAt: now,
      updatedAt: now
    };

    setGoals(prev => [newGoal, ...prev]);
    toast({
      title: "Meta criada",
      description: `"${newGoal.title}" foi adicionada com sucesso.`,
    });

    return newGoal;
  };

  const createCustomGoal = (goalData: Omit<Goal, 'id' | 'current' | 'completed' | 'createdAt' | 'updatedAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      current: 0,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setGoals(prev => [newGoal, ...prev]);
    toast({
      title: "Meta personalizada criada",
      description: `"${newGoal.title}" foi adicionada com sucesso.`,
    });

    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, ...updates, updatedAt: new Date() }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    setGoals(prev => prev.filter(g => g.id !== id));
    
    if (goal) {
      toast({
        title: "Meta removida",
        description: `"${goal.title}" foi removida.`,
        variant: "destructive",
      });
    }
  };

  const calculateGoalProgress = (goal: Goal): number => {
    const now = new Date();
    let current = 0;

    switch (goal.unit) {
      case 'tasks':
        if (goal.category) {
          current = tasks.filter(task => 
            task.completed &&
            task.category === goal.category &&
            task.completed_at &&
            new Date(task.completed_at) >= goal.startDate &&
            new Date(task.completed_at) <= goal.endDate
          ).length;
        } else {
          current = tasks.filter(task => 
            task.completed &&
            task.completed_at &&
            new Date(task.completed_at) >= goal.startDate &&
            new Date(task.completed_at) <= goal.endDate
          ).length;
        }
        break;

      case 'hours':
      case 'minutes':
        const timeInMinutes = tasks
          .filter(task => 
            task.completed &&
            task.actual_time &&
            task.completed_at &&
            new Date(task.completed_at) >= goal.startDate &&
            new Date(task.completed_at) <= goal.endDate &&
            (!goal.category || task.category === goal.category)
          )
          .reduce((total, task) => total + (task.actual_time || 0), 0);
        
        current = goal.unit === 'hours' ? Math.floor(timeInMinutes / 60) : timeInMinutes;
        break;

      case 'streak':
        // Calcular streak atual baseado nas tarefas completadas
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(23, 59, 59, 999);
        
        while (streak < goal.target && currentDate >= goal.startDate) {
          const dayStart = new Date(currentDate);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(currentDate);
          dayEnd.setHours(23, 59, 59, 999);
          
          const dayTasks = tasks.filter(task => {
            const completedDate = task.completed_at ? new Date(task.completed_at) : null;
            return completedDate && 
                   completedDate >= dayStart && 
                   completedDate <= dayEnd &&
                   (!goal.category || task.category === goal.category);
          });
          
          if (dayTasks.length > 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
        current = streak;
        break;

      default:
        current = goal.current;
    }

    return current;
  };

  // Atualizar progresso das metas automaticamente
  useEffect(() => {
    const activeGoals = goals.filter(goal => !goal.completed && new Date() <= goal.endDate);
    
    activeGoals.forEach(goal => {
      const newProgress = calculateGoalProgress(goal);
      
      if (newProgress !== goal.current) {
        const isCompleted = newProgress >= goal.target;
        
        updateGoal(goal.id, {
          current: newProgress,
          completed: isCompleted
        });

        // Recompensar se a meta foi concluída
        if (isCompleted && !goal.completed) {
          addPoints(goal.rewards.points, `Meta concluída: ${goal.title}`);
          celebrateSuccess(`🎯 Meta "${goal.title}" concluída! +${goal.rewards.points} pontos`, 'achievement');
          
          toast({
            title: "🎯 Meta Concluída!",
            description: `Você completou "${goal.title}" e ganhou ${goal.rewards.points} pontos!`,
          });
        }
      }
    });
  }, [tasks, goals]);

  const activeGoals = useMemo(() => {
    return goals.filter(goal => !goal.completed && new Date() <= goal.endDate);
  }, [goals]);

  const completedGoals = useMemo(() => {
    return goals.filter(goal => goal.completed);
  }, [goals]);

  const expiredGoals = useMemo(() => {
    return goals.filter(goal => !goal.completed && new Date() > goal.endDate);
  }, [goals]);

  const goalStats = useMemo(() => {
    const total = goals.length;
    const completed = completedGoals.length;
    const active = activeGoals.length;
    const expired = expiredGoals.length;
    
    const totalPointsEarned = completedGoals.reduce((sum, goal) => sum + goal.rewards.points, 0);
    const potentialPoints = activeGoals.reduce((sum, goal) => sum + goal.rewards.points, 0);

    return {
      total,
      completed,
      active,
      expired,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalPointsEarned,
      potentialPoints
    };
  }, [goals, completedGoals, activeGoals, expiredGoals]);

  const availableTemplates = useMemo(() => {
    // Filtrar templates que não estão ativos atualmente
    return GOAL_TEMPLATES.filter(template => {
      const hasActiveGoal = activeGoals.some(goal => 
        goal.title === template.title && goal.type === template.type
      );
      return !hasActiveGoal;
    });
  }, [activeGoals]);

  return {
    goals,
    activeGoals,
    completedGoals,
    expiredGoals,
    goalStats,
    availableTemplates,
    createGoalFromTemplate,
    createCustomGoal,
    updateGoal,
    deleteGoal,
    calculateGoalProgress
  };
}