
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimeSectionProps {
  startDate?: Date;
  setStartDate: (date?: Date) => void;
  dueDate?: Date;
  setDueDate: (date?: Date) => void;
  estimatedTime?: number;
  setEstimatedTime: (time?: number) => void;
}

export function DateTimeSection({
  startDate,
  setStartDate,
  dueDate,
  setDueDate,
  estimatedTime,
  setEstimatedTime,
}: DateTimeSectionProps) {
  return (
    <div className="space-y-4">
      {/* Datas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Data de Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal h-9',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
          <Label className="text-sm font-medium">Data de Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal h-9',
                  !dueDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, 'dd/MM/yyyy') : 'Selecionar data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="space-y-1.5">
        <Label htmlFor="estimatedTime" className="text-sm font-medium">Tempo Estimado (minutos)</Label>
        <Input
          id="estimatedTime"
          type="number"
          placeholder="ex: 30"
          value={estimatedTime || ''}
          onChange={(e) => setEstimatedTime(e.target.value ? parseInt(e.target.value) : undefined)}
          min="1"
          className="h-9"
        />
      </div>
    </div>
  );
}
