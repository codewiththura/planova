import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Text } from '@radix-ui/themes';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';

interface CreateActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planTitle: string;
  planStartDate?: string;
  planEndDate?: string;
  onCreateAction: (
    title: string,
    options?: {
      dateMode?: 'none' | 'date_range' | 'specific_date';
      startDate?: string;
      endDate?: string;
      startTime?: string;
      endTime?: string;
    }
  ) => void;
}

export function CreateActionDialog({ open, onOpenChange, planTitle, planStartDate, planEndDate, onCreateAction }: CreateActionDialogProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startTimeOpen, setStartTimeOpen] = useState(false);
  const [endTimeOpen, setEndTimeOpen] = useState(false);

  // Helper to format 24h string into 12h AM/PM
  const formatTimeStr = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  const TimePickerContent = ({
    value,
    onChange,
    onClose
  }: {
    value: string,
    onChange: (v: string) => void,
    onClose: () => void
  }) => {
    const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ['AM', 'PM'];

    const currentHour24 = value ? parseInt(value.split(':')[0]) : 12;
    const currentMin = value ? parseInt(value.split(':')[1]) : 0;

    const h12 = currentHour24 % 12 || 12;
    const meridian = currentHour24 >= 12 ? 'PM' : 'AM';

    const [hour, setHour] = useState(h12);
    const [minute, setMinute] = useState(currentMin);
    const [period, setPeriod] = useState(meridian);

    const handleSelect = (h: number, m: number, p: string) => {
      let finalHour24 = h;
      if (p === 'PM' && h !== 12) finalHour24 += 12;
      if (p === 'AM' && h === 12) finalHour24 = 0;

      onChange(`${finalHour24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      onClose();
    };

    return (
      <div className="flex bg-background border rounded-lg overflow-hidden h-[200px] w-[220px]">
        <ScrollArea className="flex-1 border-r">
          <div className="p-2 space-y-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                className={cn(
                  "w-full text-center py-1.5 px-2 rounded-md font-medium text-sm transition-colors hover:bg-muted",
                  hour === h && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                onClick={() => {
                  setHour(h);
                  handleSelect(h, minute, period);
                }}
              >
                {h.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="flex-1 border-r">
          <div className="p-2 space-y-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "w-full text-center py-1.5 px-2 rounded-md font-medium text-sm transition-colors hover:bg-muted",
                  minute === m && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                onClick={() => {
                  setMinute(m);
                  handleSelect(hour, m, period);
                }}
              >
                {m.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="flex-1 bg-muted/20 p-2 flex flex-col justify-center space-y-2">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                "w-full text-center py-3 rounded-md font-medium text-sm transition-colors hover:bg-muted",
                period === p && "bg-primary text-primary-foreground hover:bg-primary"
              )}
              onClick={() => {
                setPeriod(p);
                handleSelect(hour, minute, p);
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    let computedDateMode: 'none' | 'date_range' | 'specific_date' = 'none';
    if (startDate && endDate) {
      computedDateMode = 'date_range';
    } else if (startDate) {
      computedDateMode = 'specific_date';
    }

    onCreateAction(title.trim(), {
      dateMode: computedDateMode,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });

    // Reset form
    setTitle('');
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime('');
    setEndTime('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Action</DialogTitle>
          <DialogDescription>
            <Text size="2" color="gray">
              Action for Plan: <Text weight="medium" color="gray">{planTitle}</Text>
            </Text>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 mb-4">
            <div className="grid gap-2">
              <Text as="label" size="5" weight="medium" htmlFor="action-title">
                Action Title <Text color="red">*</Text>
              </Text>
              <Input
                id="action-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete market research"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="grid gap-2">
                <Text as="label" size="2" weight="medium">Date</Text>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? formatDate(startDate.toISOString()) : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        if (!date) setEndDate(undefined); // Reset end date if start date is cleared
                        setStartDateOpen(false);
                      }}
                      disabled={(date) => {
                        if (!planStartDate || !planEndDate) return false;
                        const planStart = new Date(planStartDate);
                        planStart.setHours(0, 0, 0, 0);
                        const planEnd = new Date(planEndDate);
                        planEnd.setHours(23, 59, 59, 999);
                        return date < planStart || date > planEnd;
                      }}
                      initialFocus
                    />
                    {startDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-muted-foreground"
                        onClick={() => {
                          setStartDate(undefined);
                          setEndDate(undefined);
                          setStartTime('');
                          setEndTime('');
                          setStartDateOpen(false);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && (
                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium">End Date</Text>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDate(endDate.toISOString()) : <span>Select end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date) {
                            setStartTime('');
                            setEndTime('');
                          }
                          setEndDateOpen(false);
                        }}
                        disabled={(date) => {
                          let minDate = startDate ? new Date(startDate) : (planStartDate ? new Date(planStartDate) : null);
                          if (minDate) minDate.setHours(0, 0, 0, 0);

                          let maxDate = planEndDate ? new Date(planEndDate) : null;
                          if (maxDate) maxDate.setHours(23, 59, 59, 999);

                          if (minDate && date < minDate) return true;
                          if (maxDate && date > maxDate) return true;

                          return false;
                        }}
                        initialFocus
                      />
                      {endDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-muted-foreground"
                          onClick={() => {
                            setEndDate(undefined);
                            setEndDateOpen(false);
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            {startDate && !endDate && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium">Start Time</Text>
                  <Popover open={startTimeOpen} onOpenChange={setStartTimeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !startTime && "text-muted-foreground")}
                      >
                        <ClockIcon className="mr-2 h-4 w-4" />
                        {startTime ? formatTimeStr(startTime) : <span>Select time</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none shadow-none" align="start">
                      <TimePickerContent
                        value={startTime}
                        onChange={setStartTime}
                        onClose={() => setStartTimeOpen(false)}
                      />
                      {startTime && (
                        <div className="mt-2 bg-background border rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setStartTime('');
                              setEndTime('');
                              setStartTimeOpen(false);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                {startTime && (
                  <div className="grid gap-2">
                    <Text as="label" size="2" weight="medium">End Time</Text>
                    <Popover open={endTimeOpen} onOpenChange={setEndTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !endTime && "text-muted-foreground")}
                        >
                          <ClockIcon className="mr-2 h-4 w-4" />
                          {endTime ? formatTimeStr(endTime) : <span>Select end time</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none shadow-none" align="start">
                        <TimePickerContent
                          value={endTime}
                          onChange={setEndTime}
                          onClose={() => setEndTimeOpen(false)}
                        />
                        {endTime && (
                          <div className="mt-2 bg-background border rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEndTime('');
                                setEndTimeOpen(false);
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
            >
              Add Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
