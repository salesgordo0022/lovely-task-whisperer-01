-- Adicionar a categoria 'studies' na tabela tasks
-- Não precisamos modificar a estrutura da tabela, apenas garantir que aceita 'studies'

-- Adicionar campos específicos para estudos na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS institution TEXT, -- escola, faculdade, universidade
ADD COLUMN IF NOT EXISTS course TEXT,      -- curso/disciplina
ADD COLUMN IF NOT EXISTS subject TEXT,     -- matéria específica
ADD COLUMN IF NOT EXISTS semester TEXT,    -- semestre/período
ADD COLUMN IF NOT EXISTS professor TEXT;   -- professor responsável

-- Comentários para documentar os novos campos
COMMENT ON COLUMN public.tasks.institution IS 'Nome da instituição de ensino (escola, faculdade, universidade)';
COMMENT ON COLUMN public.tasks.course IS 'Nome do curso ou disciplina';
COMMENT ON COLUMN public.tasks.subject IS 'Matéria ou assunto específico';
COMMENT ON COLUMN public.tasks.semester IS 'Semestre, período ou ano letivo';
COMMENT ON COLUMN public.tasks.professor IS 'Nome do professor ou instrutor responsável';

-- Habilitar real-time para tasks
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.tasks;

-- Habilitar real-time para task_checklist_items
ALTER TABLE public.task_checklist_items REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.task_checklist_items;

-- Habilitar real-time para notes
ALTER TABLE public.notes REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notes;

-- Habilitar real-time para user_game_stats
ALTER TABLE public.user_game_stats REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.user_game_stats;