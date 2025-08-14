export interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface CharacterStats {
  characterId: string;
  lives: number; // 0-3 corações
  deaths: number; // total de mortes registradas
  currentStreak: number; // dias consecutivos sem morrer
  bestStreak: number; // melhor sequência
  totalDaysCompleted: number;
  lastActivityDate: string;
  trailProgress: number; // 0-100% do progresso da trilha atual
  tasksCompletedToday: number;
  totalTasksToday: number;
}

export const AVAILABLE_CHARACTERS: Character[] = [
  {
    id: 'ayanokoji',
    name: 'Kiyotaka Ayanokoji',
    emoji: '🎯',
    color: '#374151',
    description: 'Estrategista frio e calculista de Classroom of the Elite'
  },
  {
    id: 'light',
    name: 'Light Yagami',
    emoji: '📋',
    color: '#8B0000',
    description: 'Genio estratégico com complexo de deus, perfeccionista'
  },
  {
    id: 'senku',
    name: 'Senku Ishigami',
    emoji: '🧪',
    color: '#228B22',
    description: 'Cientista brilhante, lógico e apaixonado pela ciência'
  },
  {
    id: 'shikamaru',
    name: 'Shikamaru Nara',
    emoji: '♟️',
    color: '#2F4F4F',
    description: 'Estrategista preguiçoso mas genial, mestre em táticas'
  },
  {
    id: 'kurisu',
    name: 'Kurisu Makise',
    emoji: '🔬',
    color: '#4B0082',
    description: 'Cientista tsundere, inteligente e perfeccionista'
  },
  {
    id: 'sherlock',
    name: 'Sherlock Holmes',
    emoji: '🔍',
    color: '#1A1A2E',
    description: 'Detetive brilhante, observador e dedutivo'
  },
  {
    id: 'tony',
    name: 'Tony Stark',
    emoji: '⚡',
    color: '#FFD700',
    description: 'Genio bilionário, inventor e sarcástico'
  },
  {
    id: 'hermione',
    name: 'Hermione Granger',
    emoji: '📚',
    color: '#8B4513',
    description: 'Bruxa inteligente, estudiosa e determinada'
  },
  {
    id: 'saul',
    name: 'Saul Goodman',
    emoji: '⚖️',
    color: '#FF6347',
    description: 'Advogado esperto, persuasivo e criativo'
  },
  {
    id: 'tyrion',
    name: 'Tyrion Lannister',
    emoji: '🍷',
    color: '#800080',
    description: 'Político astuto, inteligente e sarcástico'
  }
];

export const DEFAULT_CHARACTER_STATS: Omit<CharacterStats, 'characterId'> = {
  lives: 3,
  deaths: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalDaysCompleted: 0,
  lastActivityDate: new Date().toISOString(),
  trailProgress: 0,
  tasksCompletedToday: 0,
  totalTasksToday: 0
};