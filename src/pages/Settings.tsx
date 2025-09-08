import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, SettingsIcon, User, Lock, Shield, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CharacterSelector } from '@/components/CharacterSelector';
import { CategoryToggleControls } from '@/components/CategoryToggleControls';
import { AVAILABLE_CHARACTERS } from '@/types/character';

interface UserSettings {
  displayName: string;
  password: string;
  aiPersonality: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    password: '',
    aiPersonality: 'ayanokoji'
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsed
      }));
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validações
      if (!settings.displayName.trim()) {
        toast({
          title: 'Erro',
          description: 'Por favor, informe seu nome.',
          variant: 'destructive'
        });
        return;
      }

      if (settings.password && settings.password.length < 6) {
        toast({
          title: 'Erro', 
          description: 'A senha deve ter pelo menos 6 caracteres.',
          variant: 'destructive'
        });
        return;
      }

      // Salvar configurações no localStorage
      const settingsToSave = {
        displayName: settings.displayName.trim(),
        password: settings.password,
        aiPersonality: settings.aiPersonality,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));

      toast({
        title: 'Configurações salvas!',
        description: `Olá ${settings.displayName}! Suas configurações foram atualizadas com sucesso.`
      });

      // Navegar de volta
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar configurações.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background macos-fade-in">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="macos-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <Card className="macos-card-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Seu e-mail não pode ser alterado aqui.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Nome para exibição</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Como você gostaria de ser chamado?"
                  value={settings.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Este será o nome que seu assistente IA usará para se referir a você.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Segurança */}
          <Card className="macos-card-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança e Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha do Sistema</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite uma senha para funcionalidades especiais"
                  value={settings.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Senha opcional para funcionalidades avançadas e segurança adicional.
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Informações de Segurança</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Suas configurações são armazenadas localmente no seu dispositivo e não são compartilhadas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Categorias */}
          <Card className="macos-card-subtle lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Configurações das Categorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg mb-6">
                <p className="text-sm font-medium mb-1">
                  Personalize suas categorias de tarefas
                </p>
                <p className="text-xs text-muted-foreground">
                  Ative ou desative as categorias que você usa para manter sua interface organizada.
                </p>
              </div>
              <CategoryToggleControls />
            </CardContent>
          </Card>

          {/* Seleção de Assistente IA */}
          <Card className="macos-card-subtle lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Escolher Assistente IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                <p className="text-sm">
                  <strong>Assistente Ativo:</strong> {AVAILABLE_CHARACTERS.find(c => c.id === settings.aiPersonality)?.name || 'Ayanokoji'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Escolha qual personagem será seu assistente pessoal de produtividade. Cada um tem personalidade única!
                </p>
              </div>

              <CharacterSelector
                selectedCharacterId={settings.aiPersonality}
                onCharacterSelect={(characterId) => handleInputChange('aiPersonality', characterId)}
              />
              
              {settings.displayName && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ {AVAILABLE_CHARACTERS.find(c => c.id === settings.aiPersonality)?.name} te chamará de "{settings.displayName}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="macos-button px-8"
            size="lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}