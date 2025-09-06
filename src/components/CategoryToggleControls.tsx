import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Home, Briefcase, Calendar, GraduationCap } from 'lucide-react';
import { useCategorySettings } from '@/hooks/useCategorySettings';

export function CategoryToggleControls() {
  const { settings, toggleCategory } = useCategorySettings();

  const categories = [
    {
      key: 'personal' as const,
      label: 'Pessoal',
      icon: Home,
      description: 'Tarefas pessoais e atividades do dia a dia',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      key: 'work' as const,
      label: 'Trabalho',
      icon: Briefcase,
      description: 'Projetos e responsabilidades profissionais',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'agenda' as const,
      label: 'Compromissos',
      icon: Calendar,
      description: 'Reuniões, eventos e compromissos',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      key: 'studies' as const,
      label: 'Estudos',
      icon: GraduationCap,
      description: 'Tarefas acadêmicas, cursos e estudos',
      color: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Categorias Ativas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isEnabled = settings.enabledCategories[category.key];
          
          return (
            <div
              key={category.key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isEnabled
                  ? 'bg-gradient-to-r from-background to-primary/5 border-primary/20'
                  : 'bg-muted/50 border-muted-foreground/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 ${category.color}`} />
                <div>
                  <Label
                    htmlFor={`toggle-${category.key}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {category.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
              
              <Switch
                id={`toggle-${category.key}`}
                checked={isEnabled}
                onCheckedChange={() => toggleCategory(category.key)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          );
        })}
        
        <div className="pt-2 mt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Desative categorias que você não usa para manter sua interface mais limpa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}