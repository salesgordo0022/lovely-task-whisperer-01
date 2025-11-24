import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { TaskSubcategory, CreateSubcategoryDTO, UpdateSubcategoryDTO } from '@/types/subcategory';
import { TaskCategory } from '@/types/task';

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<TaskSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadSubcategories = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('task_subcategories')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      setSubcategories(data.map(item => ({
        ...item,
        category: item.category as TaskCategory,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      })));
    } catch (error) {
      console.error('Error loading subcategories:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar subcategorias',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createSubcategory = useCallback(async (data: CreateSubcategoryDTO) => {
    if (!user) return null;

    try {
      const { data: newSubcategory, error } = await supabase
        .from('task_subcategories')
        .insert({
          user_id: user.id,
          category: data.category,
          name: data.name,
          color: data.color
        })
        .select()
        .single();

      if (error) throw error;

      const subcategory: TaskSubcategory = {
        ...newSubcategory,
        category: newSubcategory.category as TaskCategory,
        created_at: new Date(newSubcategory.created_at),
        updated_at: new Date(newSubcategory.updated_at)
      };

      setSubcategories(prev => [...prev, subcategory]);

      toast({
        title: 'Sucesso',
        description: 'Subcategoria criada com sucesso!'
      });

      return subcategory;
    } catch (error: any) {
      console.error('Error creating subcategory:', error);
      
      if (error.code === '23505') {
        toast({
          title: 'Erro',
          description: 'Já existe uma subcategoria com este nome nesta categoria',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao criar subcategoria',
          variant: 'destructive'
        });
      }
      return null;
    }
  }, [user, toast]);

  const updateSubcategory = useCallback(async (id: string, updates: UpdateSubcategoryDTO) => {
    if (!user) return null;

    try {
      const { data: updatedSubcategory, error } = await supabase
        .from('task_subcategories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const subcategory: TaskSubcategory = {
        ...updatedSubcategory,
        category: updatedSubcategory.category as TaskCategory,
        created_at: new Date(updatedSubcategory.created_at),
        updated_at: new Date(updatedSubcategory.updated_at)
      };

      setSubcategories(prev =>
        prev.map(s => s.id === id ? subcategory : s)
      );

      toast({
        title: 'Sucesso',
        description: 'Subcategoria atualizada com sucesso!'
      });

      return subcategory;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar subcategoria',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast]);

  const deleteSubcategory = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('task_subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubcategories(prev => prev.filter(s => s.id !== id));

      toast({
        title: 'Sucesso',
        description: 'Subcategoria removida com sucesso!'
      });

      return true;
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover subcategoria',
        variant: 'destructive'
      });
      return false;
    }
  }, [user, toast]);

  const getSubcategoriesByCategory = useCallback((category: TaskCategory) => {
    return subcategories.filter(s => s.category === category);
  }, [subcategories]);

  useEffect(() => {
    if (user) {
      loadSubcategories();
    }
  }, [user, loadSubcategories]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('task_subcategories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_subcategories',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSubcategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadSubcategories]);

  return {
    subcategories,
    isLoading,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getSubcategoriesByCategory,
    loadSubcategories
  };
}
