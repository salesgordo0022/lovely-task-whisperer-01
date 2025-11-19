-- Atualizar constraint de categoria para incluir 'studies'
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_category_check;

ALTER TABLE tasks ADD CONSTRAINT tasks_category_check 
CHECK (category = ANY (ARRAY['personal'::text, 'work'::text, 'agenda'::text, 'studies'::text]));