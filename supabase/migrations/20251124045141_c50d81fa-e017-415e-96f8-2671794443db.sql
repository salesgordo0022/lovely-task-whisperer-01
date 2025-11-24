-- Criar tabela para subcategorias personalizadas
CREATE TABLE IF NOT EXISTS public.task_subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  color text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, category, name)
);

-- Habilitar RLS
ALTER TABLE public.task_subcategories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subcategorias
CREATE POLICY "Users can view their own subcategories"
  ON public.task_subcategories
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subcategories"
  ON public.task_subcategories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subcategories"
  ON public.task_subcategories
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subcategories"
  ON public.task_subcategories
  FOR DELETE
  USING (auth.uid() = user_id);

-- Adicionar coluna subcategory_id na tabela tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.task_subcategories(id) ON DELETE SET NULL;

-- Trigger para updated_at
CREATE TRIGGER update_task_subcategories_updated_at
  BEFORE UPDATE ON public.task_subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar real-time para subcategorias
ALTER TABLE public.task_subcategories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_subcategories;