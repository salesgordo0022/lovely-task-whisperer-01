import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'goal';
  data: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'notebook_offline_queue';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Monitorar status da conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Conexão restaurada',
        description: 'Sincronizando dados...'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Modo offline',
        description: 'Suas alterações serão sincronizadas quando voltar online',
        variant: 'destructive'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Carregar fila offline do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (saved) {
      try {
        setOfflineQueue(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar fila offline:', error);
      }
    }
  }, []);

  // Salvar fila offline no localStorage
  useEffect(() => {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Adicionar ação à fila offline
  const addToOfflineQueue = useCallback((action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const offlineAction: OfflineAction = {
      ...action,
      id: `offline_${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };

    setOfflineQueue(prev => [...prev, offlineAction]);
    
    toast({
      title: 'Salvo offline',
      description: 'Alteração será sincronizada quando voltar online'
    });
  }, [toast]);

  // Processar fila offline
  const processOfflineQueue = useCallback(async () => {
    if (!isOnline || offlineQueue.length === 0 || isSyncing) return;

    setIsSyncing(true);

    try {
      const processedActions: string[] = [];

      for (const action of offlineQueue) {
        try {
          // Aqui você integraria com seus serviços reais
          // Por exemplo: await supabaseDataService.processOfflineAction(action);
          
          // Simulando processamento
          await new Promise(resolve => setTimeout(resolve, 100));
          
          processedActions.push(action.id);
        } catch (error) {
          console.error('Erro ao processar ação offline:', error);
          // Manter ação na fila para tentar novamente
        }
      }

      // Remover ações processadas com sucesso
      setOfflineQueue(prev => 
        prev.filter(action => !processedActions.includes(action.id))
      );

      if (processedActions.length > 0) {
        toast({
          title: 'Sincronização concluída',
          description: `${processedActions.length} alteração(ões) sincronizada(s)`
        });
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: 'Erro na sincronização',
        description: 'Tentaremos novamente em instantes',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, offlineQueue, isSyncing, toast]);

  // Tentar sincronizar quando ficar online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      // Delay para dar tempo da conexão estabilizar
      const timer = setTimeout(processOfflineQueue, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, offlineQueue.length, processOfflineQueue]);

  // Tentar sincronizar periodicamente
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(processOfflineQueue, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, [isOnline, processOfflineQueue]);

  return {
    isOnline,
    offlineQueue,
    isSyncing,
    addToOfflineQueue,
    processOfflineQueue,
    hasOfflineChanges: offlineQueue.length > 0
  };
}