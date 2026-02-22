import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { Heading, Text, TextField, Button, Flex, Theme, Badge } from '@radix-ui/themes';

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
      <div className="flex bg-background border border-border rounded-lg overflow-hidden h-[180px] w-[200px]">
        <ScrollArea className="flex-1 border-r">
          <div className="p-1 space-y-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                className={cn(
                  "w-full text-center py-1 px-1 rounded-md font-medium text-sm transition-colors hover:bg-muted text-foreground",
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
                  "w-full text-center py-1 px-1 rounded-md font-medium text-sm transition-colors hover:bg-muted text-foreground",
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
                "w-full text-center py-1 rounded-md font-medium text-sm transition-colors hover:bg-muted text-foreground",
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
        <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false} style={{ display: 'contents' }}>
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
              /* Explicitly enforce the radius when within Theme display: contents */
              .rt-TextFieldRoot, .rt-TextAreaRoot, .rt-Button {
                border-radius: var(--radius-4) !important;
              }
              /* Adjust placeholder size to match proportion request */
              .rt-TextFieldRoot input::placeholder, 
              .rt-TextAreaRoot textarea::placeholder {
                font-size: 13px !important;
              }
              /* Scale custom components to match Radix 90% scaling */
              .theme-scale-90 {
                zoom: 0.9;
              }
            `}
          </style>
          <DialogHeader className="space-y-1.5 pb-1">
            <DialogTitle asChild>
              <Heading size="4" weight="medium" highContrast>Add New Action</Heading>
            </DialogTitle>
            <DialogDescription asChild>
              <Flex gap="2" align="center" className="mt-1">
                <Text size="2" color="gray">Action for Plan:</Text>
                <Badge size="1" color="violet" variant="soft" radius="medium">{planTitle}</Badge>
              </Flex>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-1 mb-4">
              <div className="grid gap-2">
                <Text as="label" size="2" weight="medium" highContrast htmlFor="action-title">
                  Action Title <Text color="red">*</Text>
                </Text>
                <TextField.Root
                  id="action-title"
                  size="3"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  placeholder="e.g., Complete market research"
                  required
                  autoFocus
                  className={cn(isError && "animate-shake-error shadow-[0_0_0_1px_rgba(239,68,68,0.5)]")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                {/* Start Date & Time */}
                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium" highContrast>From</Text>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] rounded-[8px] outline-none transition-all"
                      >
                        <Flex gap="2" align="center" style={{ width: '100%' }}>
                          <CalendarIcon className="shrink-0 text-[var(--gray-a10)]" />
                          <Text size="2" color={startDate ? undefined : "gray"} highContrast={!!startDate} className="truncate">
                            {startDate ? `${formatDate(startDate.toISOString())}${startTime ? ` ${formatTimeStr(startTime)}` : ''}` : 'Select date & time'}
                          </Text>
                        </Flex>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                        <div className="flex flex-col items-center sm:flex-row gap-4 theme-scale-90">
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
                          <TimePickerContent value={startTime} onChange={setStartTime} onClose={() => { }} />
                        </div>
                        {(startDate || startTime) && (
                          <div className="mt-3">
                            <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setStartDate(undefined); setEndDate(undefined); setStartTime(''); setEndTime(''); setStartDateOpen(false); }}>
                              Clear
                            </Button>
                          </div>
                        )}
                      </Theme>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date & Time */}
                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium" highContrast>To</Text>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] rounded-[8px] outline-none transition-all"
                      >
                        <Flex gap="2" align="center" style={{ width: '100%' }}>
                          <CalendarIcon className="shrink-0 text-[var(--gray-a10)]" />
                          <Text size="2" color={endDate ? undefined : "gray"} highContrast={!!endDate} className="truncate">
                            {endDate ? `${formatDate(endDate.toISOString())}${endTime ? ` ${formatTimeStr(endTime)}` : ''}` : 'Select date & time'}
                          </Text>
                        </Flex>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                        <div className="flex flex-col items-center sm:flex-row gap-4 theme-scale-90">
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
                          <TimePickerContent value={endTime} onChange={setEndTime} onClose={() => { }} />
                        </div>
                        {(endDate || endTime) && (
                          <div className="mt-3">
                            <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setEndDate(undefined); setEndTime(''); setEndDateOpen(false); }}>
                              Clear
                            </Button>
                          </div>
                        )}
                      </Theme>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 mt-2 border-t border-border/50">
              <Button size="3" variant="soft" color="gray" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="3" variant="solid" color="violet" type="submit" disabled={!title.trim() || !startDate}>
                Add Action
              </Button>
            </DialogFooter>
          </form>
        </Theme>
      </DialogContent>
    </Dialog>
  );
}
