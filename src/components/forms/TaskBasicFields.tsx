
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCategory, TaskPriority } from '@/types/task';

interface TaskBasicFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: TaskCategory;
  setCategory: (category: TaskCategory) => void;
  priority: TaskPriority;
  setPriority: (priority: TaskPriority) => void;
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
}: TaskBasicFieldsProps) {
  const categories: { value: TaskCategory; label: string }[] = [
    { value: 'personal', label: '🏠 Pessoal' },
    { value: 'work', label: '💼 Trabalho' },
    { value: 'agenda', label: '📅 Compromissos & Reuniões' },
  ];

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: 'urgent', label: '🔥 Urgente' },
    { value: 'important', label: '⚡ Importante' },
    { value: 'normal', label: '📋 Normal' },
  ];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
        <Input
          id="title"
          placeholder="Digite o título da tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="h-9"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Adicione uma descrição (opcional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="resize-none"
        />
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Categoria</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as TaskCategory)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Prioridade</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((pri) => (
                <SelectItem key={pri.value} value={pri.value}>
                  {pri.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
