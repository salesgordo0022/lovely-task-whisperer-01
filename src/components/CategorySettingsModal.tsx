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

export function CategorySettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações das Categorias</DialogTitle>
        </DialogHeader>
        <CategoryToggleControls />
      </DialogContent>
    </Dialog>
  );
}