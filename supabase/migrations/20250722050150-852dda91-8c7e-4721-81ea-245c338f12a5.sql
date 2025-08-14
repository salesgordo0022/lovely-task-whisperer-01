-- Fix foreign key constraints and add proper triggers

-- Add missing foreign key constraints
ALTER TABLE tasks 
DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

ALTER TABLE tasks 
ADD CONSTRAINT tasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE productivity_stats 
DROP CONSTRAINT IF EXISTS productivity_stats_user_id_fkey;

ALTER TABLE productivity_stats 
ADD CONSTRAINT productivity_stats_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_game_stats 
DROP CONSTRAINT IF EXISTS user_game_stats_user_id_fkey;

ALTER TABLE user_game_stats 
ADD CONSTRAINT user_game_stats_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure task_checklist_items has proper foreign key to tasks
ALTER TABLE task_checklist_items 
DROP CONSTRAINT IF EXISTS task_checklist_items_task_id_fkey;

ALTER TABLE task_checklist_items 
ADD CONSTRAINT task_checklist_items_task_id_fkey 
FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;

-- Add updated_at triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_task_checklist_items_updated_at ON task_checklist_items;
DROP TRIGGER IF EXISTS update_productivity_stats_updated_at ON productivity_stats;
DROP TRIGGER IF EXISTS update_user_game_stats_updated_at ON user_game_stats;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create triggers for automatic updated_at
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_checklist_items_updated_at 
    BEFORE UPDATE ON task_checklist_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productivity_stats_updated_at 
    BEFORE UPDATE ON productivity_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_game_stats_updated_at 
    BEFORE UPDATE ON user_game_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();