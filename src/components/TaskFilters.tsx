import { TaskFilters as TaskFiltersType, TaskCategory, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const { subcategories } = useSubcategories();

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const categories: { value: TaskCategory; label: string }[] = [
    { value: 'personal', label: 'Pessoal' },
    { value: 'work', label: 'Trabalho' },
    { value: 'agenda', label: 'Agenda' },
  ];

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'urgent', label: 'Urgente' },
    { value: 'important', label: 'Importante' },
    { value: 'normal', label: 'Normal' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar tarefas..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="button-press">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 px-1 min-w-[1.25rem] h-5">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select
              value={filters.category || ''}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  category: value ? (value as TaskCategory) : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <Select
              value={filters.priority || ''}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  priority: value ? (value as TaskPriority) : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as prioridades</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.completed === true ? 'completed' : filters.completed === false ? 'pending' : ''}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  completed: value === 'completed' ? true : value === 'pending' ? false : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Filter */}
          {filters.category && subcategories.filter(s => s.category === filters.category).length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Subcategoria</label>
              <Select
                value={filters.subcategory_id || ''}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    subcategory_id: value || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as subcategorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as subcategorias</SelectItem>
                  {subcategories
                    .filter(s => s.category === filters.category)
                    .map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground button-press"
        >
          <X className="w-4 h-4 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
}