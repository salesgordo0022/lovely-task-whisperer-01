import { useState, useEffect } from 'react';

export interface UserSettings {
  displayName: string;
  password: string;
  aiPersonality: string;
  updatedAt?: string;
}

const defaultSettings: UserSettings = {
  displayName: '',
  password: '',
  aiPersonality: 'Ayanokoji'
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({
          ...defaultSettings,
          ...parsed
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Salvar configurações
  const saveSettings = (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = {
        ...settings,
        ...newSettings,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      return false;
    }
  };

  // Obter nome de exibição
  const getDisplayName = () => {
    return settings.displayName || 'Usuário';
  };

  // Verificar se há senha configurada
  const hasPassword = () => {
    return settings.password && settings.password.length > 0;
  };

  // Verificar senha
  const verifyPassword = (inputPassword: string) => {
    return settings.password === inputPassword;
  };

  // Limpar configurações
  const clearSettings = () => {
    localStorage.removeItem('userSettings');
    setSettings(defaultSettings);
  };

  return {
    settings,
    isLoaded,
    saveSettings,
    getDisplayName,
    hasPassword,
    verifyPassword,
    clearSettings
  };
}