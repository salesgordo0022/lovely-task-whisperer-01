
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StickyNote, Plus, Save, Loader2, Edit, Trash2, X } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function NotesView() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // SEO: título, descrição e canonical
  useEffect(() => {
    document.title = 'Anotações | Notebook';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Anotações pessoais no Notebook: crie, edite e organize suas notas.');
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  const canSave = useMemo(() => title.trim().length > 0 || content.trim().length > 0, [title, content]);
  const canUpdate = useMemo(() => editTitle.trim().length > 0 || editContent.trim().length > 0, [editTitle, editContent]);

  const handleAdd = async () => {
    if (!canSave || isSaving) return;
    
    setIsSaving(true);
    const result = await createNote({
      title: title.trim() || 'Sem título',
      content: content.trim()
    });
    
    if (result.success) {
      setTitle('');
      setContent('');
      setShowForm(false);
      toast({
        title: "✅ Anotação criada",
        description: "Sua anotação foi salva com sucesso.",
      });
    } else {
      toast({
        title: "❌ Erro",
        description: result.error || "Não foi possível salvar a anotação.",
        variant: "destructive"
      });
    }
    setIsSaving(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async () => {
    if (!editingNote || !canUpdate || isUpdating) return;
    
    setIsUpdating(true);
    const result = await updateNote(editingNote.id, {
      title: editTitle.trim() || 'Sem título',
      content: editContent.trim()
    });
    
    if (result.success) {
      setEditingNote(null);
      setEditTitle('');
      setEditContent('');
      toast({
        title: "✅ Anotação atualizada",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } else {
      toast({
        title: "❌ Erro",
        description: result.error || "Não foi possível atualizar a anotação.",
        variant: "destructive"
      });
    }
    setIsUpdating(false);
  };

  const handleDelete = async (noteId: string) => {
    setIsDeleting(noteId);
    const result = await deleteNote(noteId);
    
    if (result.success) {
      toast({
        title: "✅ Anotação excluída",
        description: "A anotação foi removida com sucesso.",
      });
    } else {
      toast({
        title: "❌ Erro",
        description: result.error || "Não foi possível excluir a anotação.",
        variant: "destructive"
      });
    }
    setIsDeleting(null);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <main className="max-w-2xl mx-auto space-y-6" role="main">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <StickyNote className="w-6 h-6" />
          Minhas Anotações ({notes.length})
        </h1>
        <Button onClick={() => setShowForm(!showForm)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Nova Anotação
        </Button>
      </div>

      {showForm && (
        <section aria-labelledby="nova-nota">
          <Card>
            <CardHeader>
              <CardTitle id="nova-nota" className="flex items-center gap-2 text-xl">
                <StickyNote className="w-6 h-6" />
                Criar Nova Anotação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Título da anotação" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-base"
              />
              <Textarea 
                placeholder="Escreva sua anotação aqui..." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows={8}
                className="text-base resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setTitle('');
                    setContent('');
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAdd} disabled={!canSave || isSaving} size="lg">
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Salvando...' : 'Salvar Anotação'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section aria-labelledby="lista-notas">
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>Carregando anotações...</p>
              </CardContent>
            </Card>
          ) : notes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nenhuma anotação ainda</p>
                <p className="text-sm">Crie sua primeira anotação usando o formulário acima</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <article key={note.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        {note.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(note.updated_at).toLocaleDateString('pt-BR')}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(note)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(note.id)}
                            disabled={isDeleting === note.id}
                            className="h-8 w-8 p-0 hover:text-destructive"
                          >
                            {isDeleting === note.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-base leading-relaxed">
                      {note.content || 'Sem conteúdo'}
                    </p>
                  </CardContent>
                </Card>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Modal de Edição */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && cancelEdit()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Anotação
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título da anotação"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-base"
            />
            <Textarea
              placeholder="Conteúdo da anotação..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={12}
              className="text-base resize-none"
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdate} 
                disabled={!canUpdate || isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
