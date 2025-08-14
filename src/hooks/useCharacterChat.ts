import { useState, useCallback } from 'react';
import { AIService, ChatMessage } from '@/services/aiService';
import { Character, AVAILABLE_CHARACTERS } from '@/types/character';
import { Task, ProductivityStats } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './use-toast';
import { useTasks } from './useTasks';

export function useCharacterChat(tasks: Task[], stats: ProductivityStats, userName?: string) {
  // Obter personagem selecionado das configurações
  const getSelectedCharacter = (): Character => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      const character = AVAILABLE_CHARACTERS.find(c => c.id === settings.aiPersonality);
      if (character) return character;
    }
    return AVAILABLE_CHARACTERS[0]; // Fallback para Ayanokoji
  };

  const [character] = useState<Character>(getSelectedCharacter());
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(
    `chat-history-${character.id}`, 
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const taskManager = useTasks();

  const sendMessage = useCallback(async (message: string) => {
    if (!character || !message.trim()) return;

    setIsLoading(true);

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message.trim(),
      timestamp: new Date(),
      isUser: true
    };

    // Adicionar mensagem do usuário imediatamente ao estado
    console.log('=== ENVIANDO MENSAGEM DO USUÁRIO ===');
    console.log('Mensagem do usuário:', userMessage);
    
    setChatHistory(prev => {
      console.log('Chat history ANTES de adicionar usuário:', prev.length, 'mensagens');
      const newHistory = [...prev, userMessage];
      console.log('Chat history DEPOIS de adicionar usuário:', newHistory.length, 'mensagens');
      console.log('Última mensagem adicionada:', newHistory[newHistory.length - 1]);
      return newHistory;
    });

    try {
      // Preparar funções de ação para tarefas
      const taskActions = {
        createTask: async (task: any) => {
          await taskManager.createTask(task);
        },
        deleteTask: taskManager.deleteTask,
        toggleTask: taskManager.toggleTask
      };

      // Obter resposta da IA
      const result = await AIService.chatWithCharacter(
        message.trim(),
        character,
        tasks,
        stats,
        chatHistory,
        userName,
        taskActions
      );

      // Executar ações se houver
      if (result.actions) {
        for (const action of result.actions) {
          try {
            switch (action.type) {
              case 'CREATE_TASK':
                await taskManager.createTask(action.data);
                toast({
                  title: "✅ Tarefa criada",
                  description: `"${action.data.title}" foi adicionada pelo assistente.`,
                });
                break;
              case 'COMPLETE_TASK':
                await taskManager.toggleTask(action.data.id);
                toast({
                  title: "✅ Tarefa concluída",
                  description: "Tarefa marcada como concluída pelo assistente.",
                });
                break;
              case 'DELETE_TASK':
                await taskManager.deleteTask(action.data.id);
                toast({
                  title: "🗑️ Tarefa excluída",
                  description: "Tarefa removida pelo assistente.",
                });
                break;
            }
          } catch (error) {
            console.error('Erro ao executar ação:', error);
            toast({
              title: "Erro",
              description: "Não foi possível executar a ação solicitada.",
              variant: "destructive",
            });
          }
        }
      }

      // Criar mensagem da IA
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: result.response,
        timestamp: new Date(),
        isUser: false,
        characterEmoji: character.emoji
      };

      // Adicionar resposta da IA
      console.log('Adicionando resposta da IA:', aiMessage);
      setChatHistory(prev => {
        console.log('Estado anterior do chat (IA):', prev);
        const newHistory = [...prev, aiMessage];
        console.log('Novo estado do chat (IA):', newHistory);
        return newHistory;
      });
    } catch (error) {
      console.error('Erro no chat:', error);
      
      // Resposta de fallback
      const fallbackMessage: ChatMessage = {
        id: `fallback-${Date.now()}`,
        content: `${character.emoji} Ops! Tive um probleminha técnico, mas estou aqui para ajudar! Como posso te apoiar hoje? 😊`,
        timestamp: new Date(),
        isUser: false,
        characterEmoji: character.emoji
      };

      setChatHistory(prev => [...prev, fallbackMessage]);
    }

    setIsLoading(false);
  }, [character, tasks, stats, chatHistory, setChatHistory, userName, taskManager, toast]);

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, [setChatHistory]);

  const getGreeting = useCallback(() => {
    if (!character) return '';
    return AIService.getCharacterGreeting(character);
  }, [character]);

  // Inicializar chat com saudação se necessário (apenas uma vez)
  const initializeChat = useCallback(() => {
    if (character && chatHistory.length === 0) {
      const greetingMessage: ChatMessage = {
        id: `greeting-${character.id}`,
        content: getGreeting(),
        timestamp: new Date(),
        isUser: false,
        characterEmoji: character.emoji
      };
      setChatHistory([greetingMessage]);
    }
  }, [character?.id, chatHistory.length, getGreeting, setChatHistory]); // Mudança aqui: usar character.id ao invés de character inteiro

  return {
    chatHistory,
    isLoading,
    sendMessage,
    clearHistory,
    initializeChat,
    character
  };
}