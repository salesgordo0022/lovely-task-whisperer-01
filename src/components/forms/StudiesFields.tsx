import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Book, School, User } from 'lucide-react';

interface StudiesFieldsProps {
  institution?: string;
  setInstitution: (value: string) => void;
  course?: string;
  setCourse: (value: string) => void;
  subject?: string;
  setSubject: (value: string) => void;
  semester?: string;
  setSemester: (value: string) => void;
  professor?: string;
  setProfessor: (value: string) => void;
}

export function StudiesFields({
  institution,
  setInstitution,
  course,
  setCourse,
  subject,
  setSubject,
  semester,
  setSemester,
  professor,
  setProfessor,
}: StudiesFieldsProps) {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          Detalhes do Estudo
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Instituição */}
        <div className="space-y-2">
          <Label htmlFor="institution" className="flex items-center gap-2">
            <School className="w-4 h-4" />
            Instituição
          </Label>
          <Input
            id="institution"
            value={institution || ''}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Ex: UFPE, UFRJ, Colégio..."
            className="bg-white/80 dark:bg-gray-900/80"
          />
        </div>

        {/* Curso */}
        <div className="space-y-2">
          <Label htmlFor="course" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Curso/Disciplina
          </Label>
          <Input
            id="course"
            value={course || ''}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Ex: Engenharia, Matemática..."
            className="bg-white/80 dark:bg-gray-900/80"
          />
        </div>

        {/* Matéria */}
        <div className="space-y-2">
          <Label htmlFor="subject">Matéria/Assunto</Label>
          <Input
            id="subject"
            value={subject || ''}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Cálculo I, História do Brasil..."
            className="bg-white/80 dark:bg-gray-900/80"
          />
        </div>

        {/* Semestre */}
        <div className="space-y-2">
          <Label htmlFor="semester">Período/Semestre</Label>
          <Select value={semester || ''} onValueChange={setSemester}>
            <SelectTrigger className="bg-white/80 dark:bg-gray-900/80">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-semestre">1º Semestre</SelectItem>
              <SelectItem value="2-semestre">2º Semestre</SelectItem>
              <SelectItem value="3-semestre">3º Semestre</SelectItem>
              <SelectItem value="4-semestre">4º Semestre</SelectItem>
              <SelectItem value="5-semestre">5º Semestre</SelectItem>
              <SelectItem value="6-semestre">6º Semestre</SelectItem>
              <SelectItem value="7-semestre">7º Semestre</SelectItem>
              <SelectItem value="8-semestre">8º Semestre</SelectItem>
              <SelectItem value="9-semestre">9º Semestre</SelectItem>
              <SelectItem value="10-semestre">10º Semestre</SelectItem>
              <SelectItem value="1-ano">1º Ano</SelectItem>
              <SelectItem value="2-ano">2º Ano</SelectItem>
              <SelectItem value="3-ano">3º Ano</SelectItem>
              <SelectItem value="4-ano">4º Ano</SelectItem>
              <SelectItem value="5-ano">5º Ano</SelectItem>
              <SelectItem value="ensino-medio">Ensino Médio</SelectItem>
              <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
              <SelectItem value="pos-graduacao">Pós-graduação</SelectItem>
              <SelectItem value="mestrado">Mestrado</SelectItem>
              <SelectItem value="doutorado">Doutorado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Professor */}
      <div className="space-y-2">
        <Label htmlFor="professor" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Professor/Instrutor
        </Label>
        <Input
          id="professor"
          value={professor || ''}
          onChange={(e) => setProfessor(e.target.value)}
          placeholder="Nome do professor ou instrutor"
          className="bg-white/80 dark:bg-gray-900/80"
        />
      </div>
    </div>
  );
}