import { TaskFilters } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Home, Briefcase, Calendar, Clock, AlertTriangle, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  activeCategory: 'personal' | 'work' | 'agenda' | 'studies' | 'all';
  onCategoryChange: (category: 'personal' | 'work' | 'agenda' | 'studies' | 'all') => void;
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export function QuickActions({ 
  activeCategory, 
  onCategoryChange, 
  filters, 
  onFiltersChange 
}: QuickActionsProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const categories = [
    { key: 'all' as const, label: 'Todas', icon: Filter },
    { key: 'personal' as const, label: 'Pessoal', icon: Home },
    { key: 'work' as const, label: 'Trabalho', icon: Briefcase },
    { key: 'agenda' as const, label: 'Compromissos', icon: Calendar },
    { key: 'studies' as const, label: 'Estudos', icon: GraduationCap },
  ];

  const quickFilters = [
    {
      key: 'today',
      label: 'Hoje',
      icon: Clock,
      active: filters.today,
      action: () => onFiltersChange({ ...filters, today: !filters.today, overdue: false }),
    },
    {
      key: 'overdue',
      label: 'Atrasadas',
      icon: AlertTriangle,
      active: filters.overdue,
      action: () => onFiltersChange({ ...filters, overdue: !filters.overdue, today: false }),
    },
    {
      key: 'urgent',
      label: 'Urgentes',
      icon: AlertTriangle,
      active: filters.priority === 'urgent',
      action: () => onFiltersChange({ 
        ...filters, 
        priority: filters.priority === 'urgent' ? undefined : 'urgent' 
      }),
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFiltersChange({});
    onCategoryChange('all');
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="responsive-gap flex flex-col">
      {/* Categorias */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              onCategoryChange(category.key);
              if (category.key !== 'all') {
                onFiltersChange({ ...filters, category: category.key });
              } else {
                const { category: _, ...newFilters } = filters;
                onFiltersChange(newFilters);
              }
            }}
            className={cn(
              'macos-button transition-all duration-200 flex-1 sm:flex-none min-w-[80px]',
              activeCategory === category.key && 'shadow-soft'
            )}
          >
            <category.icon className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Busca e filtros rápidos */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        {/* Busca */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-11 sm:h-10 text-base sm:text-sm"
          />
        </div>

        {/* Filtros rápidos */}
        <div className="flex gap-2 flex-wrap">
          {quickFilters.map((filter) => (
            <Button
              key={filter.key}
              variant={filter.active ? 'default' : 'outline'}
              size="sm"
              onClick={filter.action}
              className={cn(
                'macos-button transition-all duration-200 text-xs sm:text-sm',
                filter.active && 'shadow-soft'
              )}
            >
              <filter.icon className="w-3 h-3 mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Limpar filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground transition-all duration-200 text-xs sm:text-sm macos-button"
          >
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Indicadores de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Badge key={key} variant="secondary" className="text-xs sm:text-sm">
                {key === 'search' && `Busca: ${value}`}
                {key === 'today' && 'Hoje'}
                {key === 'overdue' && 'Atrasadas'}
                {key === 'priority' && `Prioridade: ${value}`}
                {key === 'category' && `Categoria: ${value}`}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}