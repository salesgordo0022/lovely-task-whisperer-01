import { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const result = await dataService.getNotes();
      
      if (result.success) {
        setNotes(result.data);
        setError(null);
      } else {
        setError(result.error || 'Erro ao carregar anotações');
      }
    } catch (err) {
      setError('Erro ao carregar anotações');
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (noteData: { title: string; content?: string }) => {
    try {
      const result = await dataService.createNote(noteData);
      
      if (result.success) {
        await loadNotes(); // Recarregar a lista
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao criar anotação' };
    }
  };

  const updateNote = async (id: string, updates: { title?: string; content?: string }) => {
    try {
      const result = await dataService.updateNote(id, updates);
      
      if (result.success) {
        await loadNotes(); // Recarregar a lista
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao atualizar anotação' };
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const result = await dataService.deleteNote(id);
      
      if (result.success) {
        await loadNotes(); // Recarregar a lista
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Erro ao excluir anotação' };
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote
  };
}