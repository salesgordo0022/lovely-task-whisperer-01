import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { CategoryToggleControls } from './CategoryToggleControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubcategoryManager } from './SubcategoryManager';

export function CategorySettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { key: 'personal', label: 'Pessoal' },
    { key: 'work', label: 'Trabalho' },
    { key: 'agenda', label: 'Agenda' },
    { key: 'studies', label: 'Estudos' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Configurar Categorias</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações das Categorias</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="toggle" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="toggle">Ativar/Desativar</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="toggle" className="mt-4">
            <CategoryToggleControls />
          </TabsContent>
          
          <TabsContent value="subcategories" className="mt-4 space-y-4">
            {categories.map(cat => (
              <SubcategoryManager 
                key={cat.key} 
                category={cat.key as any}
                categoryLabel={cat.label}
              />
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}