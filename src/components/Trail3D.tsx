import React from 'react';
import { Character, CharacterStats } from '@/types/character';

interface Trail3DProps {
  character: Character;
  stats: CharacterStats;
  todayTasks: any[];
  className?: string;
}

export function Trail3D({ character, stats, todayTasks, className }: Trail3DProps) {
  // Temporariamente substituindo por uma versão simples para resolver o erro
  const completedTasks = todayTasks?.filter(task => task.completed) || [];
  const progress = todayTasks?.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

  return (
    <div className={`${className} bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6`} style={{ height: '400px', width: '100%' }}>
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        {/* Character Display */}
        <div className="text-center">
          <div className="text-6xl mb-2" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
            {character?.emoji || '👤'}
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {character?.name || 'Personagem'}
          </h3>
        </div>

        {/* Progress Trail */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progresso da Trilha</span>
            <span>{progress}%</span>
          </div>
          
          {/* Trail Visualization */}
          <div className="relative">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Character Position on Trail */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
              style={{ left: `${Math.max(8, Math.min(92, progress))}%` }}
            >
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs"
                style={{ backgroundColor: character?.color || '#6b7280' }}
              >
                {character?.emoji || '👤'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-lg font-bold text-green-600">
              {stats?.tasksCompletedToday || 0}
            </div>
            <div className="text-xs text-gray-500">
              Completas
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-lg font-bold text-blue-600">
              {stats?.totalTasksToday || 0}
            </div>
            <div className="text-xs text-gray-500">
              Total
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div className="text-lg font-bold text-orange-600">
              {stats?.currentStreak || 0}
            </div>
            <div className="text-xs text-gray-500">
              Sequência
            </div>
          </div>
        </div>

        {/* Lives Display */}
        <div className="flex items-center space-x-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                i <= (stats?.lives || 0) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
              }`}
            >
              ❤️
            </div>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {stats?.lives || 0}/3 Vidas
          </span>
        </div>

        {/* Task List */}
        {todayTasks && todayTasks.length > 0 && (
          <div className="w-full max-w-md">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tarefas de Hoje:
            </h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {todayTasks.slice(0, 3).map((task, index) => (
                <div 
                  key={task.id || index}
                  className={`text-xs p-2 rounded ${
                    task.completed 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className={task.completed ? 'line-through' : ''}>
                    {task.title?.substring(0, 30) || 'Tarefa'}
                    {task.title?.length > 30 ? '...' : ''}
                  </span>
                  {task.completed && <span className="ml-1">✅</span>}
                </div>
              ))}
              {todayTasks.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{todayTasks.length - 3} mais tarefas...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}