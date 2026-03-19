
import { TaskCategory, TaskPriority } from '@/types/task';

export interface EisenhowerSuggestion {
  isUrgent: boolean;
  isImportant: boolean;
  reasons: string[];
}

/**
 * Metodologia de Auto-Classificação Eisenhower
 * 
 * URGÊNCIA é determinada por:
 * 1. Prazo (due_date) em ≤ 2 dias → Urgente
 * 2. Prioridade definida como "urgent" → Urgente
 * 3. Tem data de início hoje ou já passou → Urgente
 * 
 * IMPORTÂNCIA é determinada por:
 * 1. Categoria "work" ou "studies" → Importante (impacto profissional/acadêmico)
 * 2. Tem checklist com ≥ 2 itens → Importante (tarefa complexa)
 * 3. Tempo estimado ≥ 60 min → Importante (tarefa substancial)
 * 4. Prioridade definida como "important" → Importante
 * 
 * O usuário SEMPRE pode ajustar manualmente após a sugestão.
 */
export function classifyEisenhower(params: {
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: Date;
  startDate?: Date;
  estimatedTime?: number;
  checklistCount?: number;
}): EisenhowerSuggestion {
  const { category, priority, dueDate, startDate, estimatedTime, checklistCount } = params;
  const now = new Date();
  const reasons: string[] = [];
  let isUrgent = false;
  let isImportant = false;

  // === URGÊNCIA ===

  // 1. Prazo em ≤ 2 dias
  if (dueDate) {
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays <= 2 && diffDays >= 0) {
      isUrgent = true;
      reasons.push(`⏰ Vence em ${diffDays < 1 ? 'menos de 1 dia' : Math.ceil(diffDays) + ' dia(s)'}`);
    } else if (diffDays < 0) {
      isUrgent = true;
      reasons.push('🚨 Prazo já vencido!');
    }
  }

  // 2. Prioridade "urgent"
  if (priority === 'urgent') {
    isUrgent = true;
    reasons.push('🔥 Prioridade marcada como urgente');
  }

  // 3. Data de início é hoje ou já passou
  if (startDate) {
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (startDay <= today) {
      isUrgent = true;
      reasons.push('📅 Data de início é hoje ou já passou');
    }
  }

  // === IMPORTÂNCIA ===

  // 1. Categoria work ou studies
  if (category === 'work') {
    isImportant = true;
    reasons.push('💼 Tarefa de trabalho (impacto profissional)');
  } else if (category === 'studies') {
    isImportant = true;
    reasons.push('📚 Tarefa de estudos (impacto acadêmico)');
  }

  // 2. Checklist complexo
  if (checklistCount && checklistCount >= 2) {
    isImportant = true;
    reasons.push(`📋 Tarefa complexa (${checklistCount} etapas)`);
  }

  // 3. Tempo estimado alto
  if (estimatedTime && estimatedTime >= 60) {
    isImportant = true;
    reasons.push(`⏱️ Tarefa substancial (${estimatedTime} min estimados)`);
  }

  // 4. Prioridade "important"
  if (priority === 'important') {
    isImportant = true;
    reasons.push('⭐ Prioridade marcada como importante');
  }

  return { isUrgent, isImportant, reasons };
}

export function getQuadrantLabel(isUrgent: boolean, isImportant: boolean): string {
  if (isUrgent && isImportant) return "📋 Q1: Faça imediatamente";
  if (!isUrgent && isImportant) return "📅 Q2: Agende";
  if (isUrgent && !isImportant) return "🔄 Q3: Delegue";
  return "🗑️ Q4: Elimine";
}

export function getQuadrantColor(isUrgent: boolean, isImportant: boolean): string {
  if (isUrgent && isImportant) return "border-destructive bg-destructive/5";
  if (!isUrgent && isImportant) return "border-primary bg-primary/5";
  if (isUrgent && !isImportant) return "border-yellow-500 bg-yellow-500/5";
  return "border-muted-foreground/30 bg-muted/20";
}
