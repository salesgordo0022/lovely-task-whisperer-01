import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, Save } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function NotesView() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

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

  const handleAdd = () => {
    if (!canSave) return;
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: title.trim() || 'Sem título',
      content: content.trim(),
      created_at: now,
      updated_at: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setTitle('');
    setContent('');
    setShowForm(false);
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
                <Button onClick={handleAdd} disabled={!canSave} size="lg">
                  <Save className="w-4 h-4 mr-2" /> 
                  Salvar Anotação
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section aria-labelledby="lista-notas">
        
        <div className="space-y-4">
          {notes.length === 0 ? (
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
                      <Badge variant="secondary" className="text-xs">
                        {new Date(note.updated_at).toLocaleDateString('pt-BR')}
                      </Badge>
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
    </main>
  );
}
