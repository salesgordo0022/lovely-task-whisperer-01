import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubcategories } from '@/hooks/useSubcategories';
import { TaskCategory } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SubcategoryManagerProps {
  category: TaskCategory;
  categoryLabel: string;
}

export function SubcategoryManager({ category, categoryLabel }: SubcategoryManagerProps) {
  const { 
    getSubcategoriesByCategory, 
    createSubcategory, 
    updateSubcategory, 
    deleteSubcategory 
  } = useSubcategories();
  
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const subcategories = getSubcategoriesByCategory(category);

  const handleCreate = async () => {
    if (!newSubcategoryName.trim()) return;

    const result = await createSubcategory({
      category,
      name: newSubcategoryName.trim()
    });

    if (result) {
      setNewSubcategoryName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    const result = await updateSubcategory(id, {
      name: editingName.trim()
    });

    if (result) {
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSubcategory(id);
    setDeletingId(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Subcategorias de {categoryLabel}</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nova
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Subcategoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Nome da subcategoria"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {subcategories.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma subcategoria criada ainda
          </p>
        ) : (
          <div className="space-y-2">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                {editingId === subcategory.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdate(subcategory.id)}
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdate(subcategory.id)}>
                      Salvar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setEditingId(null);
                        setEditingName('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium">{subcategory.name}</span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(subcategory.id);
                          setEditingName(subcategory.name);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingId(subcategory.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={deletingId !== null} onOpenChange={() => setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta subcategoria? As tarefas associadas não serão excluídas, apenas perderão a subcategoria.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deletingId && handleDelete(deletingId)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
