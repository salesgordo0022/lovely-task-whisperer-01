import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Clock, Users, Link, StickyNote, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MeetingFieldsProps {
  meetingUrl?: string;
  setMeetingUrl: (url?: string) => void;
  location?: string;
  setLocation: (location?: string) => void;
  attendees?: string[];
  setAttendees: (attendees: string[]) => void;
  meetingNotes?: string;
  setMeetingNotes: (notes?: string) => void;
  reminderMinutes?: number;
  setReminderMinutes: (minutes?: number) => void;
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  startTime?: string;
  setStartTime: (time?: string) => void;
  endTime?: string;
  setEndTime: (time?: string) => void;
}

export function MeetingFields({
  meetingUrl,
  setMeetingUrl,
  location,
  setLocation,
  attendees = [],
  setAttendees,
  meetingNotes,
  setMeetingNotes,
  reminderMinutes,
  setReminderMinutes,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: MeetingFieldsProps) {
  const [newAttendee, setNewAttendee] = useState('');

  const handleAddAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  const handleRemoveAttendee = (attendee: string) => {
    setAttendees(attendees.filter(a => a !== attendee));
  };

  const reminderOptions = [
    { value: 5, label: '5 minutos antes' },
    { value: 10, label: '10 minutos antes' },
    { value: 15, label: '15 minutos antes' },
    { value: 30, label: '30 minutos antes' },
    { value: 60, label: '1 hora antes' },
    { value: 120, label: '2 horas antes' },
    { value: 1440, label: '1 dia antes' },
  ];

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-accent/40">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-base">Detalhes do Compromisso</h3>
      </div>

      {/* Data e Horários */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              Data *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-9',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  {startDate ? format(startDate, 'dd/MM/yyyy') : 'Selecionar data'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Início
            </Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Horário" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Fim
            </Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Horário" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Local e Link */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Local
          </Label>
          <Input
            id="location"
            placeholder="ex: Sala de reuniões, Zoom, etc."
            value={location || ''}
            onChange={(e) => setLocation(e.target.value || undefined)}
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="meetingUrl" className="text-sm font-medium flex items-center gap-1">
            <Link className="w-3 h-3" />
            Link da Reunião
          </Label>
          <Input
            id="meetingUrl"
            placeholder="https://zoom.us/j/..."
            value={meetingUrl || ''}
            onChange={(e) => setMeetingUrl(e.target.value || undefined)}
            className="h-9"
          />
        </div>
      </div>

      {/* Participantes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-1">
          <Users className="w-3 h-3" />
          Participantes
        </Label>
        
        <div className="flex gap-2">
          <Input
            placeholder="Nome ou email do participante..."
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttendee())}
            className="h-9 flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddAttendee}
            className="h-9 px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {attendees.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {attendees.map((attendee, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {attendee}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveAttendee(attendee)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Lembrete */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Lembrete</Label>
        <Select 
          value={reminderMinutes?.toString()} 
          onValueChange={(value) => setReminderMinutes(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Selecionar lembrete" />
          </SelectTrigger>
          <SelectContent>
            {reminderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notas da reunião */}
      <div className="space-y-1.5">
        <Label htmlFor="meetingNotes" className="text-sm font-medium flex items-center gap-1">
          <StickyNote className="w-3 h-3" />
          Notas/Agenda
        </Label>
        <Textarea
          id="meetingNotes"
          placeholder="Pontos a discutir, agenda da reunião, observações..."
          value={meetingNotes || ''}
          onChange={(e) => setMeetingNotes(e.target.value || undefined)}
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
}