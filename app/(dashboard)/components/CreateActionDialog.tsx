import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
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
  const [isError, setIsError] = useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle('');
      setStartDate(planStartDate ? new Date(planStartDate) : undefined);
      setEndDate(undefined);
      setStartTime('');
      setEndTime('');
      setIsError(false);
      setStartDateOpen(false);
      setEndDateOpen(false);
      setStartTimeOpen(false);
      setEndTimeOpen(false);
    }
  }, [open, planStartDate]);

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
      <div className="flex bg-background border rounded-lg overflow-hidden h-[180px] w-[220px]">
        <ScrollArea className="flex-1 border-r">
          <div className="p-1 space-y-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                className={cn(
                  "w-full text-center py-1 px-1 rounded-md font-medium text-sm transition-colors hover:bg-muted",
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
          <div className="p-1 space-y-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                className={cn(
                  "w-full text-center py-1 px-1 rounded-md font-medium text-sm transition-colors hover:bg-muted",
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
        <div className="flex-1 bg-muted/20 p-1 flex flex-col justify-center space-y-2">
          {periods.map((p) => (
            <button
              key={p}
              type="button"
              className={cn(
                "w-full text-center py-1 rounded-md font-medium text-sm transition-colors hover:bg-muted",
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

    if (!title.trim()) {
      setIsError(true);
      setTimeout(() => setIsError(false), 300);
      return;
    }

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
        <style>
          {`
            @keyframes shake-error {
              0%, 100% { transform: translateX(0); }
              20% { transform: translateX(-2px); }
              40% { transform: translateX(3px); }
              60% { transform: translateX(-3px); }
              80% { transform: translateX(2px); }
            }
            .animate-shake-error {
              animation: shake-error 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            }
          `}
        </style>
        <DialogHeader className="space-y-1.5 pb-2">
          <DialogTitle className="text-[20px] font-semibold tracking-tight">Add New Action</DialogTitle>
          <DialogDescription className="text-[14px] text-muted-foreground/80">
            Action for Plan: <span className="font-medium text-foreground/80">{planTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 mb-4">
            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-foreground/90 ml-0.5" htmlFor="action-title">
                Action Title <span className="text-red-500/80">*</span>
              </label>
              <Input
                id="action-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder="e.g., Complete market research"
                required
                autoFocus
                className={cn(
                  "h-10 px-3 bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 placeholder:text-muted-foreground/40 rounded-[8px] text-[14px]",
                  isError && "animate-shake-error border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500/50"
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              {/* Start Date & Time */}
              <div className="grid gap-2">
                <label className="text-[13px] font-medium text-muted-foreground ml-0.5">From</label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("h-10 justify-start text-left font-normal bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 rounded-[8px]", !startDate && "text-muted-foreground/60")}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 opacity-60" />
                      <span className="truncate">{startDate ? `${formatDate(startDate.toISOString())}${startTime ? ` ${formatTimeStr(startTime)}` : ''}` : 'Select date & time'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-1" align="start">
                    <div className="flex flex-col items-center sm:flex-row gap-4">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (!date) setEndDate(undefined);
                        }}
                        disabled={(date) => {
                          if (!planStartDate || !planEndDate) return false;
                          const planStart = new Date(planStartDate); planStart.setHours(0, 0, 0, 0);
                          const planEnd = new Date(planEndDate); planEnd.setHours(23, 59, 59, 999);
                          return date < planStart || date > planEnd;
                        }}
                        initialFocus
                      />
                      {/* <div className="flex flex-col gap-2"> */}
                      {/* <div className="text-sm font-medium text-center mb-1 text-muted-foreground">Time (Optional)</div> */}
                      <TimePickerContent value={startTime} onChange={setStartTime} onClose={() => { }} />
                      {/* </div> */}
                    </div>
                    {(startDate || startTime) && (
                      <Button variant="ghost" size="sm" className="w-full my-1 border" onClick={() => { setStartDate(undefined); setEndDate(undefined); setStartTime(''); setEndTime(''); setStartDateOpen(false); }}>Clear</Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date & Time */}
              <div className="grid gap-2">
                <label className="text-[13px] font-medium text-muted-foreground ml-0.5">To</label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("h-10 justify-start text-left font-normal bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 rounded-[8px]", !endDate && "text-muted-foreground/60")}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 opacity-60" />
                      <span className="truncate">{endDate ? `${formatDate(endDate.toISOString())}${endTime ? ` ${formatTimeStr(endTime)}` : ''}` : 'Select date & time'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-1" align="start">
                    <div className="flex flex-col items-center sm:flex-row gap-4">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                        }}
                        disabled={(date) => {
                          let minDate = startDate ? new Date(startDate) : (planStartDate ? new Date(planStartDate) : null);
                          if (minDate) minDate.setHours(0, 0, 0, 0);
                          let maxDate = planEndDate ? new Date(planEndDate) : null;
                          if (maxDate) maxDate.setHours(23, 59, 59, 999);
                          return !!((minDate && date < minDate) || (maxDate && date > maxDate));
                        }}
                        initialFocus
                      />
                      {/* <div className="flex flex-col gap-2"> */}
                      {/* <div className="text-sm font-medium text-center mb-1 text-muted-foreground">Time (Optional)</div> */}
                      <TimePickerContent value={endTime} onChange={setEndTime} onClose={() => { }} />
                      {/* </div> */}
                    </div>
                    {(endDate || endTime) && (
                      <Button variant="ghost" size="sm" className="w-full mt-3 border" onClick={() => { setEndDate(undefined); setEndTime(''); setEndDateOpen(false); }}>Clear</Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-[13px] font-medium border-border/50 text-muted-foreground shadow-sm hover:bg-muted/40 hover:text-foreground active:scale-[0.97] transition-all duration-200 rounded-[8px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 px-4 text-[13px] font-medium bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] hover:from-primary/80 hover:to-primary active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:active:scale-100 rounded-[8px]"
            >
              Add Action
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
