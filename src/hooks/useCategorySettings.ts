import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { logger } from '@/utils/logger';

interface CategorySettings {
  enabledCategories: {
    personal: boolean;
    work: boolean;
    agenda: boolean;
    studies: boolean;
  };
  defaultCategory: 'personal' | 'work' | 'agenda' | 'studies';
}

const DEFAULT_SETTINGS: CategorySettings = {
  enabledCategories: {
    personal: true,
    work: true,
    agenda: true,
    studies: true,
  },
  defaultCategory: 'personal',
};

export function useCategorySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CategorySettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const savedSettings = localStorage.getItem(`category_settings_${user.id}`);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          logger.error('Erro ao carregar configurações de categoria', error);
        }
      }
      setIsLoading(false);
    }
  }, [user]);

  // Salvar configurações no localStorage
  const saveSettings = (newSettings: Partial<CategorySettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      localStorage.setItem(`category_settings_${user.id}`, JSON.stringify(updatedSettings));
    } catch (error) {
      logger.error('Erro ao salvar configurações de categoria', error);
    }
  };

  // Togglear categoria
  const toggleCategory = (category: keyof CategorySettings['enabledCategories']) => {
    saveSettings({
      enabledCategories: {
        ...settings.enabledCategories,
        [category]: !settings.enabledCategories[category],
      },
    });
  };

  // Definir categoria padrão
  const setDefaultCategory = (category: CategorySettings['defaultCategory']) => {
    saveSettings({ defaultCategory: category });
  };

  // Obter categorias habilitadas
  const getEnabledCategories = () => {
    return Object.entries(settings.enabledCategories)
      .filter(([_, enabled]) => enabled)
      .map(([category]) => category as keyof CategorySettings['enabledCategories']);
  };

  return {
    settings,
    isLoading,
    saveSettings,
    toggleCategory,
    setDefaultCategory,
    getEnabledCategories,
  };
}