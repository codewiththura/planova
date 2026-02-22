import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { Heading, Text, TextField, TextArea, Button, Flex, Theme } from '@radix-ui/themes';

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePlan: (plan: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export function CreatePlanDialog({ open, onOpenChange, onCreatePlan }: CreatePlanDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !startDate || !endDate) {
      if (!title.trim()) {
        setIsError(true);
        setTimeout(() => setIsError(false), 300);
      }
      return;
    }

    onCreatePlan({
      title: title.trim(),
      description: description.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setStartDate(new Date());
    setEndDate(undefined);
    onOpenChange(false);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setEndDateOpen(false);
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
              <Heading size="4" weight="medium" highContrast>Create New Plan</Heading>
            </DialogTitle>
            <DialogDescription asChild>
              <Text size="2" color="gray" as="p">
                Set a goal with a specific timeframe and break it down into actionable steps.
              </Text>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-1 mb-4">
              <div className="grid gap-2">
                <Text as="label" size="2" weight="medium" highContrast htmlFor="title">
                  Plan Title <Text color="red">*</Text>
                </Text>
                <TextField.Root
                  id="title"
                  size="3"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  placeholder="e.g., Launch New Product"
                  required
                  className={cn(isError && "animate-shake-error shadow-[0_0_0_1px_rgba(239,68,68,0.5)]")}
                />
              </div>

              <div className="grid gap-2">
                <Text as="label" size="2" weight="medium" highContrast htmlFor="description">
                  Description
                </Text>
                <TextArea
                  id="description"
                  size="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional: Add more details about this plan..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium" highContrast>Start Date <Text color="red">*</Text></Text>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] rounded-[8px] outline-none transition-all"
                      >
                        <Flex gap="2" align="center">
                          <CalendarIcon />
                          {startDate ? (
                            <Text size="2" highContrast>{formatDate(startDate.toISOString())}</Text>
                          ) : (
                            <Text size="2" color="gray">Select date</Text>
                          )}
                        </Flex>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="theme-scale-90">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={handleStartDateSelect}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Text as="label" size="2" weight="medium" highContrast>End Date <Text color="red">*</Text></Text>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="h-10 px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] rounded-[8px] outline-none transition-all"
                      >
                        <Flex gap="2" align="center">
                          <CalendarIcon />
                          {endDate ? (
                            <Text size="2" highContrast>{formatDate(endDate.toISOString())}</Text>
                          ) : (
                            <Text size="2" color="gray">Select date</Text>
                          )}
                        </Flex>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="theme-scale-90">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={handleEndDateSelect}
                          disabled={(date) => startDate ? date < startDate : false}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button size="3" variant="soft" color="gray" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="3" variant="solid" color="violet" type="submit" disabled={!title.trim() || !startDate || !endDate}>
                Create Plan
              </Button>
            </DialogFooter>
          </form>
        </Theme>
      </DialogContent>
    </Dialog>
  );
}
