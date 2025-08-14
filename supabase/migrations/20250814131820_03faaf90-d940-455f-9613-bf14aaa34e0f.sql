-- Adicionar campos específicos para compromissos/reuniões na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS meeting_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS attendees TEXT[],
ADD COLUMN IF NOT EXISTS meeting_notes TEXT,
ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER;

-- Criar trigger para atualizar timestamp updated_at automaticamente
CREATE OR REPLACE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela task_checklist_items
CREATE OR REPLACE TRIGGER update_task_checklist_items_updated_at
    BEFORE UPDATE ON public.task_checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela notes
CREATE OR REPLACE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela profiles
CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela user_game_stats
CREATE OR REPLACE TRIGGER update_user_game_stats_updated_at
    BEFORE UPDATE ON public.user_game_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela productivity_stats
CREATE OR REPLACE TRIGGER update_productivity_stats_updated_at
    BEFORE UPDATE ON public.productivity_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela user_goals
CREATE OR REPLACE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON public.user_goals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar trigger para atualizar timestamp updated_at automaticamente na tabela user_email_settings
CREATE OR REPLACE TRIGGER update_user_email_settings_updated_at
    BEFORE UPDATE ON public.user_email_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();