import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';

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

  const inputClasses = "bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 placeholder:text-muted-foreground/40 rounded-[8px] text-[14px]";

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
          <DialogTitle className="text-[20px] font-semibold tracking-tight">Create New Plan</DialogTitle>
          <DialogDescription className="text-[14px] text-muted-foreground/80">
            Set a goal with a specific timeframe and break it down into actionable steps.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 mb-4">
            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-foreground/90 ml-0.5" htmlFor="title">
                Plan Title <span className="text-red-500/80">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder="e.g., Launch New Product"
                required
                className={cn(
                  "h-10 px-3",
                  inputClasses,
                  isError && "animate-shake-error border-red-500/50 focus-visible:ring-red-500/20 focus-visible:border-red-500/50"
                )}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-[13px] font-medium text-foreground/90 ml-0.5" htmlFor="description">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional: Add more details about this plan..."
                rows={3}
                className={cn(
                  "px-3 py-2 resize-none",
                  inputClasses
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="grid gap-2">
                <label className="text-[13px] font-medium text-muted-foreground ml-0.5">Start Date <span className="text-red-500/80">*</span></label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-10 justify-start text-left font-normal bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 rounded-[8px]",
                        !startDate && "text-muted-foreground/60"
                      )}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 opacity-60" />
                      <span className="truncate">{startDate ? formatDate(startDate.toISOString()) : 'Select date'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <label className="text-[13px] font-medium text-muted-foreground ml-0.5">End Date <span className="text-red-500/80">*</span></label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "h-10 justify-start text-left font-normal bg-background border-border/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-[3px] focus-visible:ring-primary/10 focus-visible:border-primary/40 transition-all duration-200 rounded-[8px]",
                        !endDate && "text-muted-foreground/60"
                      )}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 opacity-60" />
                      <span className="truncate">{endDate ? formatDate(endDate.toISOString()) : 'Select date'}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                    />
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
              disabled={!title.trim() || !startDate || !endDate}
              className="h-9 px-4 text-[13px] font-medium bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] hover:from-primary/80 hover:to-primary active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:active:scale-100 rounded-[8px]"
            >
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
