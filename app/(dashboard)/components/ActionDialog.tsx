"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { Heading, Text, TextField, Button, Flex, Theme, Badge } from '@radix-ui/themes';
import { Action } from '@/app/types';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

interface ActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planTitle: string;
    planStartDate?: string;
    planEndDate?: string;
    action?: Action | null;
    onSave: (
        title: string,
        options?: {
            dateMode?: 'none' | 'date_range' | 'specific_date';
            startDate?: string;
            endDate?: string;
            startTime?: string;
            endTime?: string;
        },
        actionId?: string
    ) => void;
}

export function ActionDialog({ open, onOpenChange, planTitle, planStartDate, planEndDate, action, onSave }: ActionDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

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
            if (action) {
                setTitle(action.title);
                setStartDate(action.startDate ? new Date(action.startDate) : undefined);
                setEndDate(action.endDate ? new Date(action.endDate) : undefined);
                setStartTime(action.startTime || '');
                setEndTime(action.endTime || '');
            } else {
                setTitle('');
                setStartDate(undefined);
                setEndDate(undefined);
                setStartTime('');
                setEndTime('');
            }
            setIsError(false);
            setStartDateOpen(false);
            setEndDateOpen(false);
        }
    }, [open, action]);

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
            <div className='flex flex-col gap-2'>
                <p className="text-sm text-gray">Time (optional) </p>
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
            </div>
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || (action && !action.id)) {
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

        onSave(
            title.trim(),
            {
                dateMode: computedDateMode,
                startDate: startDate ? startDate.toISOString() : undefined,
                endDate: endDate ? endDate.toISOString() : undefined,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
            },
            action?.id
        );

        if (!action) {
            setTitle('');
            setStartDate(undefined);
            setEndDate(undefined);
            setStartTime('');
            setEndTime('');
        }
        onOpenChange(false);
    };

    const ActionForm = () => (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4 py-1", !isDesktop && "px-4 mt-2")}>
            <div className="grid gap-2">
                <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast htmlFor="action-title">
                    Action Title <Text color="red">*</Text>
                </Text>
                <TextField.Root
                    id="action-title"
                    size={isDesktop ? "3" : "3"}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (isError) setIsError(false);
                    }}
                    placeholder="e.g., Complete market research"
                    required
                    autoFocus
                    radius='medium'
                    className={cn(!isDesktop && "text-[16px] h-12")}
                />
            </div>

            <div className={cn("grid gap-4 mt-2", isDesktop ? "grid-cols-2" : "grid-cols-1")}>
                {/* Start Date & Time */}
                <div className="grid gap-2">
                    <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast>From</Text>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen} modal={true}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] outline-none transition-all",
                                    isDesktop ? "h-10 rounded-[8px]" : "h-12 rounded-[12px]"
                                )}
                            >
                                <Flex gap="2" align="center" style={{ width: '100%' }}>
                                    <CalendarIcon className="shrink-0 text-[var(--gray-a10)]" />
                                    <Text size={isDesktop ? "2" : "3"} color={startDate ? undefined : "gray"} highContrast={!!startDate} className="truncate">
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
                    <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast>To</Text>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen} modal={true}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] outline-none transition-all",
                                    isDesktop ? "h-10 rounded-[8px]" : "h-12 rounded-[12px]"
                                )}
                            >
                                <Flex gap="2" align="center" style={{ width: '100%' }}>
                                    <CalendarIcon className="shrink-0 text-[var(--gray-a10)]" />
                                    <Text size={isDesktop ? "2" : "3"} color={endDate ? undefined : "gray"} highContrast={!!endDate} className="truncate">
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

            {isDesktop ? (
                <DialogFooter className="pt-4 mt-2 border-t border-border/50">
                    <Button size="3" variant="soft" radius='medium' color="gray" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button size="3" variant="solid" radius='medium' color="violet" type="submit" disabled={!title.trim()}>
                        {action ? 'Save Changes' : 'Add Action'}
                    </Button>
                </DialogFooter>
            ) : (
                <DrawerFooter className="px-0 pt-4 pb-6 mt-4 border-t border-border/50">
                    <Button size="4" variant="solid" radius='large' color="violet" type="submit" disabled={!title.trim()}>
                        {action ? 'Save Changes' : 'Add Action'}
                    </Button>
                    <DrawerClose asChild>
                        <Button size="4" variant="soft" radius='large' color="gray" type="button">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            )}
        </form>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false} style={{ display: 'contents' }}>
                        <style>
                            {`
                  .theme-scale-90 {
                    zoom: 0.9;
                  }
                `}
                        </style>
                        <DialogHeader className="space-y-1.5 pb-1">
                            <DialogTitle asChild>
                                <Heading size="4" weight="medium" highContrast>
                                    {action ? 'Edit Action' : 'Add New Action'}
                                </Heading>
                            </DialogTitle>
                            <DialogDescription asChild>
                                <Flex gap="2" align="center" className="mt-1">
                                    <Text size="2" color="gray">Action for Plan:</Text>
                                    <Badge size="1" color="violet" variant="soft" radius="medium">{planTitle}</Badge>
                                </Flex>
                            </DialogDescription>
                        </DialogHeader>
                        <ActionForm />
                    </Theme>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="px-2 pb-12">
                <Theme appearance="inherit" accentColor="violet" scaling="100%" radius="large" hasBackground={false} style={{ display: 'contents' }}>
                    <style>
                        {`
                  .theme-scale-90 {
                    zoom: 0.9;
                  }
                `}
                    </style>
                    <DrawerHeader className="text-left px-4 pt-6 pb-6">
                        <DrawerTitle asChild>
                            <Heading size="6" weight="medium" highContrast>
                                {action ? 'Edit Action' : 'Add New Action'}
                            </Heading>
                        </DrawerTitle>
                        <DrawerDescription asChild>
                            <Flex gap="2" align="center" className="mt-2">
                                <Text size="3" color="gray">Action for Plan:</Text>
                                <Badge size="2" color="violet" variant="soft" radius="medium">{planTitle}</Badge>
                            </Flex>
                        </DrawerDescription>
                    </DrawerHeader>
                    <ActionForm />
                </Theme>
            </DrawerContent>
        </Drawer>
    );
}

