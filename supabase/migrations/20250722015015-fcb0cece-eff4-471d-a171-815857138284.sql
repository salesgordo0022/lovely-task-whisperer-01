
-- Criar tabela de usuários/perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de tarefas
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('personal', 'work', 'agenda')),
  priority TEXT NOT NULL CHECK (priority IN ('urgent', 'important', 'normal')),
  completed BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_time INTEGER, -- em minutos
  actual_time INTEGER, -- tempo real gasto
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de checklist items
CREATE TABLE public.task_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de estatísticas de produtividade
CREATE TABLE public.productivity_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  focus_time INTEGER DEFAULT 0, -- em minutos
  productivity_score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  calculated_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, calculated_at)
);

-- Criar tabela para gamificação
CREATE TABLE public.user_game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_game_stats ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para task_checklist_items
CREATE POLICY "Users can view checklist items of their tasks" ON public.task_checklist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_checklist_items.task_id 
      AND tasks.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert checklist items for their tasks" ON public.task_checklist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_checklist_items.task_id 
      AND tasks.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update checklist items of their tasks" ON public.task_checklist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_checklist_items.task_id 
      AND tasks.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete checklist items of their tasks" ON public.task_checklist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE tasks.id = task_checklist_items.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

-- Políticas RLS para productivity_stats
CREATE POLICY "Users can view their own stats" ON public.productivity_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.productivity_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.productivity_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para user_game_stats
CREATE POLICY "Users can view their own game stats" ON public.user_game_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game stats" ON public.user_game_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own game stats" ON public.user_game_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para criar profile automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_game_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função quando usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.task_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.productivity_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_game_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
