
import { useState } from 'react';
import { Task, TaskCategory, TaskPriority, TaskChecklistItem } from '@/types/task';
import { Button } from '@/components/ui/button';
import { TaskBasicFields } from './forms/TaskBasicFields';
import { EisenhowerSection } from './forms/EisenhowerSection';
import { DateTimeSection } from './forms/DateTimeSection';
import { ChecklistSection } from './forms/ChecklistSection';
import { MeetingFields } from './forms/MeetingFields';
import { StudiesFields } from './forms/StudiesFields';

interface TaskCreateFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [estimatedTime, setEstimatedTime] = useState<number>();
  const [isUrgent, setIsUrgent] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [checklistItems, setChecklistItems] = useState<Omit<TaskChecklistItem, 'id' | 'created_at' | 'updated_at' | 'task_id' | 'order_index'>[]>([]);
  const [subcategoryId, setSubcategoryId] = useState<string>();

  // Campos específicos para reuniões/compromissos
  const [meetingUrl, setMeetingUrl] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [attendees, setAttendees] = useState<string[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<string>();
  const [reminderMinutes, setReminderMinutes] = useState<number>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  // Campos específicos para estudos
  const [institution, setInstitution] = useState<string>();
  const [course, setCourse] = useState<string>();
  const [subject, setSubject] = useState<string>();
  const [semester, setSemester] = useState<string>();
  const [professor, setProfessor] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // Para compromissos da agenda, data é obrigatória
    if (category === 'agenda' && !startDate) return;
    
    // Para estudos, pelo menos instituição ou curso é obrigatório
    if (category === 'studies' && !institution && !course) return;

    const checklist: TaskChecklistItem[] = checklistItems.map((item, index) => ({
      id: `checklist-${Date.now()}-${index}`,
      title: item.title,
      completed: item.completed,
      task_id: '',
      order_index: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Combinar data e horários para compromissos
    let finalStartDate = startDate;
    let finalDueDate = dueDate;

    if (category === 'agenda' && startDate && startTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      finalStartDate = new Date(startDate);
      finalStartDate.setHours(hours, minutes, 0, 0);

      if (endTime) {
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        finalDueDate = new Date(startDate);
        finalDueDate.setHours(endHours, endMinutes, 0, 0);
      }
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      completed: false,
      isUrgent,
      isImportant,
      start_date: finalStartDate,
      due_date: finalDueDate,
      estimated_time: estimatedTime,
      checklist,
      subcategory_id: subcategoryId,
      // Campos específicos para reuniões
      meeting_url: category === 'agenda' ? meetingUrl : undefined,
      location: category === 'agenda' ? location : undefined,
      attendees: category === 'agenda' ? attendees : undefined,
      meeting_notes: category === 'agenda' ? meetingNotes : undefined,
      reminder_minutes: category === 'agenda' ? reminderMinutes : undefined,
      
      // Campos específicos para estudos
      institution: category === 'studies' ? institution : undefined,
      course: category === 'studies' ? course : undefined,
      subject: category === 'studies' ? subject : undefined,
      semester: category === 'studies' ? semester : undefined,
      professor: category === 'studies' ? professor : undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('normal');
    setStartDate(undefined);
    setDueDate(undefined);
    setEstimatedTime(undefined);
    setIsUrgent(false);
    setIsImportant(false);
    setChecklistItems([]);
    setSubcategoryId(undefined);
    // Reset campos de reunião
    setMeetingUrl(undefined);
    setLocation(undefined);
    setAttendees([]);
    setMeetingNotes(undefined);
    setReminderMinutes(undefined);
    setStartTime(undefined);
    setEndTime(undefined);
    // Reset campos de estudos
    setInstitution(undefined);
    setCourse(undefined);
    setSubject(undefined);
    setSemester(undefined);
    setProfessor(undefined);
  };

  const isAgendaCategory = category === 'agenda';
  const isStudiesCategory = category === 'studies';

  return (
    <div className="max-h-[calc(100vh-10rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto -mx-1 px-1">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 pb-2">
        <TaskBasicFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          priority={priority}
          setPriority={setPriority}
          subcategoryId={subcategoryId}
          setSubcategoryId={setSubcategoryId}
        />

        {/* Mostrar campos específicos baseados na categoria */}
        {isAgendaCategory ? (
          <MeetingFields
            meetingUrl={meetingUrl}
            setMeetingUrl={setMeetingUrl}
            location={location}
            setLocation={setLocation}
            attendees={attendees}
            setAttendees={setAttendees}
            meetingNotes={meetingNotes}
            setMeetingNotes={setMeetingNotes}
            reminderMinutes={reminderMinutes}
            setReminderMinutes={setReminderMinutes}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        ) : isStudiesCategory ? (
          <>
            <StudiesFields
              institution={institution}
              setInstitution={setInstitution}
              course={course}
              setCourse={setCourse}
              subject={subject}
              setSubject={setSubject}
              semester={semester}
              setSemester={setSemester}
              professor={professor}
              setProfessor={setProfessor}
            />
            
            <DateTimeSection
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              estimatedTime={estimatedTime}
              setEstimatedTime={setEstimatedTime}
            />

            <ChecklistSection
              checklistItems={checklistItems}
              setChecklistItems={setChecklistItems}
            />
          </>
        ) : (
          <>
            <EisenhowerSection
              isUrgent={isUrgent}
              setIsUrgent={setIsUrgent}
              isImportant={isImportant}
              setIsImportant={setIsImportant}
            />

            <DateTimeSection
              startDate={startDate}
              setStartDate={setStartDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              estimatedTime={estimatedTime}
              setEstimatedTime={setEstimatedTime}
            />

            <ChecklistSection
              checklistItems={checklistItems}
              setChecklistItems={setChecklistItems}
            />
          </>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-3 sm:pt-4 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t -mx-1 px-1 py-3">
          <Button
            type="submit"
            disabled={
              !title.trim() || 
              (isAgendaCategory && !startDate) ||
              (isStudiesCategory && !institution && !course)
            }
            className="button-press w-full sm:w-auto sm:min-w-[140px] h-11 sm:h-10 text-sm font-medium"
          >
            {isAgendaCategory ? 'Criar Compromisso' : 
             isStudiesCategory ? 'Criar Tarefa de Estudo' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </div>
  );
}
