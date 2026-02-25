"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import { formatDate, formatTime } from '@/app/utils/helpers';
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

const formatTimeStr = formatTime;

const TimePickerContent = ({
    value,
    onChange
}: {
    value: string,
    onChange: (v: string) => void
}) => {
    const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ['AM', 'PM'];

    const currentHour24 = value ? parseInt(value.split(':')[0]) : null;
    const currentMin = value ? parseInt(value.split(':')[1]) : null;

    const h12 = currentHour24 !== null ? (currentHour24 % 12 || 12) : null;
    const meridian = currentHour24 !== null ? (currentHour24 >= 12 ? 'PM' : 'AM') : null;

    const [hour, setHour] = useState<number | null>(h12);
    const [minute, setMinute] = useState<number | null>(currentMin);
    const [period, setPeriod] = useState<string | null>(meridian);

    const handleSelect = (h: number | null, m: number | null, p: string | null) => {
        const safeHour = h !== null ? h : 12;
        const safeMin = m !== null ? m : 0;
        const safePeriod = p !== null ? p : 'AM';

        let finalHour24 = safeHour;
        if (safePeriod === 'PM' && safeHour !== 12) finalHour24 += 12;
        if (safePeriod === 'AM' && safeHour === 12) finalHour24 = 0;

        onChange(`${finalHour24.toString().padStart(2, '0')}:${safeMin.toString().padStart(2, '0')}`);
    };

    return (
        <div className="flex bg-background overflow-hidden h-[180px] w-[180px]">
            <ScrollArea className="flex-1 border-r">
                <div className="p-1 space-y-1">
                    {hours.map((h) => (
                        <button
                            key={h}
                            type="button"
                            className={cn(
                                "w-full text-center py-1 px-1 rounded-md text-xs transition-colors hover:bg-muted text-foreground",
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
                                "w-full text-center py-1 px-1 rounded-md text-xs transition-colors hover:bg-muted text-foreground",
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
            <div className="flex-1 bg-muted/20 pl-1 flex flex-col justify-center space-y-2">
                {periods.map((p) => (
                    <button
                        key={p}
                        type="button"
                        className={cn(
                            "w-full text-center py-1 rounded-md text-xs transition-colors hover:bg-muted text-foreground",
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

export function ActionDialog({ open, onOpenChange, planTitle, planStartDate, planEndDate, action, onSave }: ActionDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [showTimeFields, setShowTimeFields] = useState(false);
    const [isError, setIsError] = useState(false);

    React.useEffect(() => {
        if (open) {
            if (action) {
                setTitle(action.title);
                setStartDate(action.startDate ? new Date(action.startDate) : undefined);
                setEndDate(action.endDate ? new Date(action.endDate) : undefined);
                setStartTime(action.startTime || '');
                setEndTime(action.endTime || '');
                setShowTimeFields(!!(action.startTime || action.endTime));
            } else {
                setTitle('');
                setStartDate(undefined);
                setEndDate(undefined);
                setStartTime('');
                setEndTime('');
                setShowTimeFields(false);
            }
            setIsError(false);
            setStartDateOpen(false);
            setEndDateOpen(false);
            setStartTimeOpen(false);
            setEndTimeOpen(false);
        }
    }, [open, action]);



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

    const renderActionForm = () => (
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
                {/* Start Date */}
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
                                        {startDate ? formatDate(startDate.toISOString()) : 'Select date'}
                                    </Text>
                                </Flex>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                            <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                                <div className="theme-scale-90 flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            setStartDate(date);
                                            if (date) {
                                                setStartDateOpen(false);
                                            } else {
                                                setEndDate(undefined);
                                            }
                                        }}
                                        disabled={(date) => {
                                            if (!planStartDate || !planEndDate) return false;
                                            const planStart = new Date(planStartDate); planStart.setHours(0, 0, 0, 0);
                                            const planEnd = new Date(planEndDate); planEnd.setHours(23, 59, 59, 999);
                                            return date < planStart || date > planEnd;
                                        }}
                                        initialFocus
                                    />
                                </div>
                                {startDate && (
                                    <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setStartDate(undefined); setEndDate(undefined); setStartDateOpen(false); }}>
                                        Clear
                                    </Button>
                                )}
                            </Theme>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* End Date */}
                <div className="grid gap-2">
                    <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast>To</Text>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen} modal={true}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] outline-none transition-all",
                                    isDesktop ? "h-10 rounded-[8px]" : "h-12 rounded-[12px]",
                                    !startDate && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={!startDate}
                            >
                                <Flex gap="2" align="center" style={{ width: '100%' }}>
                                    <CalendarIcon className="shrink-0 text-[var(--gray-a10)]" />
                                    <Text size={isDesktop ? "2" : "3"} color={endDate ? undefined : "gray"} highContrast={!!endDate} className="truncate">
                                        {endDate ? formatDate(endDate.toISOString()) : 'Select date'}
                                    </Text>
                                </Flex>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="start">
                            <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                                <div className="theme-scale-90 flex justify-center">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => {
                                            setEndDate(date);
                                            if (date) {
                                                setStartTime('');
                                                setEndTime('');
                                                setShowTimeFields(false);
                                                setEndDateOpen(false);
                                            }
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
                                </div>
                                {endDate && (
                                    <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setEndDate(undefined); setEndDateOpen(false); }}>
                                        Clear
                                    </Button>
                                )}
                            </Theme>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Time Fields */}
            {!showTimeFields ? (
                <Button
                    size={isDesktop ? "3" : "4"}
                    variant="soft"
                    radius={isDesktop ? "medium" : "large"}
                    color="gray"
                    type="button"
                    onClick={() => setShowTimeFields(true)}
                    disabled={!!endDate}
                    style={{ width: '100%', border: '1px dashed var(--gray-a8)', marginTop: isDesktop ? '4px' : '8px' }}
                >
                    <Flex gap="2" align="center">
                        <ClockIcon className="w-4 h-4 shrink-0" />
                        <Text>Set Time</Text>
                    </Flex>
                </Button>
            ) : (
                <div className={cn("grid gap-4 mt-1", isDesktop ? "grid-cols-2" : "grid-cols-1")}>
                    {/* Start Time Picker */}
                    <div className="grid gap-2">
                        <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast>Start Time</Text>
                        <Popover open={startTimeOpen} onOpenChange={setStartTimeOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] outline-none transition-all",
                                        isDesktop ? "h-10 rounded-[8px]" : "h-12 rounded-[12px]"
                                    )}
                                >
                                    <Flex gap="2" align="center" style={{ width: '100%' }}>
                                        <ClockIcon className="shrink-0 text-[var(--gray-a10)]" />
                                        <Text size={isDesktop ? "2" : "3"} color={startTime ? undefined : "gray"} highContrast={!!startTime} className="truncate">
                                            {startTime ? formatTimeStr(startTime) : 'Select time'}
                                        </Text>
                                    </Flex>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                                <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                                    <TimePickerContent
                                        value={startTime}
                                        onChange={(v) => {
                                            setStartTime(v);
                                        }}
                                    />
                                    <div className="mt-3 flex flex-col gap-2">

                                        {startTime && (
                                            <>
                                                <Button variant="solid" color="violet" size="2" style={{ width: '100%' }} onClick={() => setStartTimeOpen(false)}>
                                                    Done
                                                </Button>
                                                <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setStartTime(''); setStartTimeOpen(false); }}>
                                                    Clear
                                                </Button>
                                            </>

                                        )}
                                    </div>
                                </Theme>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* End Time Picker */}
                    <div className="grid gap-2">
                        <Text as="label" size={isDesktop ? "2" : "3"} weight="medium" highContrast>End Time</Text>
                        <Popover open={endTimeOpen} onOpenChange={setEndTimeOpen} modal={true}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] outline-none transition-all",
                                        isDesktop ? "h-10 rounded-[8px]" : "h-12 rounded-[12px]"
                                    )}
                                >
                                    <Flex gap="2" align="center" style={{ width: '100%' }}>
                                        <ClockIcon className="shrink-0 text-[var(--gray-a10)]" />
                                        <Text size={isDesktop ? "2" : "3"} color={endTime ? undefined : "gray"} highContrast={!!endTime} className="truncate">
                                            {endTime ? formatTimeStr(endTime) : 'Select time'}
                                        </Text>
                                    </Flex>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align="start">
                                <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false}>
                                    <TimePickerContent
                                        value={endTime}
                                        onChange={(v) => {
                                            setEndTime(v);
                                        }}
                                    />
                                    <div className="mt-3 flex flex-col gap-2">
                                        <Button variant="solid" color="violet" size="2" style={{ width: '100%' }} onClick={() => setEndTimeOpen(false)}>
                                            Done
                                        </Button>
                                        {endTime && (
                                            <Button variant="soft" color="gray" size="2" style={{ width: '100%' }} onClick={() => { setEndTime(''); setEndTimeOpen(false); }}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </Theme>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

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
                        {renderActionForm()}
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
                    {renderActionForm()}
                </Theme>
            </DrawerContent>
        </Drawer>
    );
}

