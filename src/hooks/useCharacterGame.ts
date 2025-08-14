import { useState, useEffect, useCallback, useMemo } from 'react';
import { Character, CharacterStats, AVAILABLE_CHARACTERS, DEFAULT_CHARACTER_STATS } from '@/types/character';
import { Task } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './use-toast';
import { useGameification } from './useGameification';

export function useCharacterGame(tasks: Task[]) {
  const [selectedCharacter, setSelectedCharacter] = useLocalStorage<Character | null>('selectedCharacter', null);
  const [characterStats, setCharacterStats] = useLocalStorage<CharacterStats | null>('characterStats', null);
  const { celebrateSuccess, showError, addPoints } = useGameification();
  const { toast } = useToast();

  // Inicializar stats do personagem quando selecionado
  const selectCharacter = useCallback((character: Character) => {
    const newStats: CharacterStats = {
      ...DEFAULT_CHARACTER_STATS,
      characterId: character.id,
      lastActivityDate: new Date().toISOString()
    };
    
    setSelectedCharacter(character);
    setCharacterStats(newStats);
    
    toast({
      title: `${character.emoji} ${character.name} Selecionado!`,
      description: character.description,
    });
  }, [setSelectedCharacter, setCharacterStats, toast]);

  // Calcular tarefas do dia atual
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      const taskDate = task.due_date ? new Date(task.due_date) : task.created_at;
      return taskDate >= today && taskDate < tomorrow;
    });
  }, [tasks]);

  const todayCompletedTasks = useMemo(() => {
    return todayTasks.filter(task => task.completed);
  }, [todayTasks]);

  // Calcular progresso da trilha
  const trailProgress = useMemo(() => {
    if (todayTasks.length === 0) return 100;
    return Math.round((todayCompletedTasks.length / todayTasks.length) * 100);
  }, [todayTasks.length, todayCompletedTasks.length]);

  // Verificar se é um novo dia
  const checkNewDay = useCallback(() => {
    if (!characterStats) return false;
    
    const lastActivity = new Date(characterStats.lastActivityDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastActivity.setHours(0, 0, 0, 0);
    
    return today.getTime() > lastActivity.getTime();
  }, [characterStats]);

  // Processar final do dia anterior
  const processEndOfDay = useCallback(() => {
    if (!characterStats || !selectedCharacter) return;

    const isNewDay = checkNewDay();
    if (!isNewDay) return;

    const wasAllTasksCompleted = characterStats.trailProgress >= 100;
    
    if (wasAllTasksCompleted) {
      // Sucesso: ganha vida se tiver perdido alguma
      const newLives = Math.min(3, characterStats.lives + 1);
      const lifeGained = newLives > characterStats.lives;
      
      // Se completou sem morrer, pode ressuscitar uma morte
      let newDeaths = characterStats.deaths;
      if (characterStats.lives === 3 && characterStats.deaths > 0) {
        newDeaths = Math.max(0, characterStats.deaths - 1);
        celebrateSuccess(`${selectedCharacter.emoji} Ressurreição! Uma morte foi apagada do registro!`, 'achievement');
      }

      const newStats: CharacterStats = {
        ...characterStats,
        lives: newLives,
        deaths: newDeaths,
        currentStreak: characterStats.currentStreak + 1,
        bestStreak: Math.max(characterStats.bestStreak, characterStats.currentStreak + 1),
        totalDaysCompleted: characterStats.totalDaysCompleted + 1,
        trailProgress: 0,
        tasksCompletedToday: 0,
        totalTasksToday: todayTasks.length,
        lastActivityDate: new Date().toISOString()
      };

      setCharacterStats(newStats);
      addPoints(50, 'Dia completo!');
      
      if (lifeGained) {
        celebrateSuccess(`${selectedCharacter.emoji} Vida recuperada! ❤️`, 'success');
      }
      
      celebrateSuccess(`${selectedCharacter.emoji} Trilha completa! Dia ${newStats.currentStreak} da sequência!`, 'achievement');
      
    } else {
      // Falha: perde vida
      const newLives = Math.max(0, characterStats.lives - 1);
      const newDeaths = newLives === 0 ? characterStats.deaths + 1 : characterStats.deaths;
      
      const newStats: CharacterStats = {
        ...characterStats,
        lives: newLives,
        deaths: newDeaths,
        currentStreak: 0,
        trailProgress: 0,
        tasksCompletedToday: 0,
        totalTasksToday: todayTasks.length,
        lastActivityDate: new Date().toISOString()
      };

      setCharacterStats(newStats);
      
      if (newLives === 0) {
        showError(`💀 ${selectedCharacter.name} morreu! Morte #${newDeaths} registrada.`);
        // Resetar vidas após morte
        setTimeout(() => {
          setCharacterStats(prev => prev ? { ...prev, lives: 3 } : null);
        }, 3000);
      } else {
        showError(`${selectedCharacter.emoji} perdeu uma vida! ${newLives}❤️ restantes`);
      }
    }
  }, [characterStats, selectedCharacter, checkNewDay, todayTasks.length, celebrateSuccess, showError, addPoints, setCharacterStats]);

  // Atualizar progresso quando tarefas mudam
  useEffect(() => {
    if (!characterStats || !selectedCharacter) return;

    const newStats: CharacterStats = {
      ...characterStats,
      trailProgress,
      tasksCompletedToday: todayCompletedTasks.length,
      totalTasksToday: todayTasks.length,
      lastActivityDate: new Date().toISOString()
    };

    setCharacterStats(newStats);
  }, [trailProgress, todayCompletedTasks.length, todayTasks.length]);

  // Verificar final do dia
  useEffect(() => {
    processEndOfDay();
  }, []);

  // Resetar personagem
  const resetCharacter = useCallback(() => {
    setSelectedCharacter(null);
    setCharacterStats(null);
    toast({
      title: "Personagem resetado",
      description: "Você pode escolher um novo personagem.",
      variant: "destructive",
    });
  }, [setSelectedCharacter, setCharacterStats, toast]);

  const characterGameData = useMemo(() => {
    if (!selectedCharacter || !characterStats) return null;

    return {
      character: selectedCharacter,
      stats: {
        ...characterStats,
        trailProgress,
        tasksCompletedToday: todayCompletedTasks.length,
        totalTasksToday: todayTasks.length
      },
      todayTasks,
      todayCompletedTasks,
      isGameActive: true
    };
  }, [selectedCharacter, characterStats, trailProgress, todayCompletedTasks, todayTasks]);

  return {
    availableCharacters: AVAILABLE_CHARACTERS,
    selectedCharacter,
    characterStats: characterGameData?.stats || null,
    characterGameData,
    selectCharacter,
    resetCharacter,
    todayTasks,
    todayCompletedTasks,
    trailProgress
  };
}