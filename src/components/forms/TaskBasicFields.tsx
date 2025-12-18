
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCategory, TaskPriority } from '@/types/task';
import { useSubcategories } from '@/hooks/useSubcategories';

interface TaskBasicFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: TaskCategory;
  setCategory: (category: TaskCategory) => void;
  priority: TaskPriority;
  setPriority: (priority: TaskPriority) => void;
  subcategoryId?: string;
  setSubcategoryId: (id: string | undefined) => void;
}

export function TaskBasicFields({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  priority,
  setPriority,
  subcategoryId,
  setSubcategoryId,
}: TaskBasicFieldsProps) {
  const { getSubcategoriesByCategory } = useSubcategories();
  const subcategories = getSubcategoriesByCategory(category);
  
  const categories: { value: TaskCategory; label: string }[] = [
    { value: 'personal', label: '🏠 Pessoal' },
    { value: 'work', label: '💼 Trabalho' },
    { value: 'agenda', label: '📅 Compromissos & Reuniões' },
    { value: 'studies', label: '🎓 Meus Estudos' },
  ];

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'urgent', label: '🔥 Urgente' },
    { value: 'important', label: '⚡ Importante' },
    { value: 'normal', label: '📋 Normal' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Title */}
      <div className="space-y-1 sm:space-y-1.5">
        <Label htmlFor="title" className="text-xs sm:text-sm font-medium">Título *</Label>
        <Input
          id="title"
          placeholder="Digite o título da tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-10 sm:h-9 text-sm"
        />
      </div>

      {/* Description */}
      <div className="space-y-1 sm:space-y-1.5">
        <Label htmlFor="description" className="text-xs sm:text-sm font-medium">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Adicione uma descrição (opcional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="resize-none text-sm min-h-[60px]"
        />
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          <Label className="text-xs sm:text-sm font-medium">Categoria</Label>
          <Select value={category} onValueChange={(value) => {
            setCategory(value as TaskCategory);
            setSubcategoryId(undefined); // Reset subcategory when category changes
          }}>
            <SelectTrigger className="h-10 sm:h-9 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="text-sm">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 sm:space-y-1.5">
          <Label className="text-xs sm:text-sm font-medium">Prioridade</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
            <SelectTrigger className="h-10 sm:h-9 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((pri) => (
                <SelectItem key={pri.value} value={pri.value} className="text-sm">
                  {pri.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subcategory - shown only if there are subcategories for this category */}
      {subcategories.length > 0 && (
        <div className="space-y-1 sm:space-y-1.5">
          <Label className="text-xs sm:text-sm font-medium">Subcategoria (opcional)</Label>
          <Select value={subcategoryId || "none"} onValueChange={(value) => setSubcategoryId(value === "none" ? undefined : value)}>
            <SelectTrigger className="h-10 sm:h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Selecione uma subcategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-sm">Sem subcategoria</SelectItem>
              {subcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id} className="text-sm">
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
