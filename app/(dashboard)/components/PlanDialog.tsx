"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/app/components/ui/drawer';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { Heading, Text, TextField, TextArea, Button, Flex, Theme } from '@radix-ui/themes';
import { Plan } from '@/app/types';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

interface PlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan?: Plan | null;
    onSave: (
        planData: {
            title: string;
            description: string;
            startDate: string;
            endDate: string;
        },
        planId?: string
    ) => void;
}

export function PlanDialog({ open, onOpenChange, plan, onSave }: PlanDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (open) {
            if (plan) {
                setTitle(plan.title);
                setDescription(plan.description || '');
                setStartDate(plan.startDate ? new Date(plan.startDate) : undefined);
                setEndDate(plan.endDate ? new Date(plan.endDate) : undefined);
            } else {
                setTitle('');
                setDescription('');
                setStartDate(new Date());
                setEndDate(undefined);
            }
            setIsError(false);
            setStartDateOpen(false);
            setEndDateOpen(false);
        }
    }, [open, plan]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !startDate || !endDate) {
            if (!title.trim()) {
                setIsError(true);
                setTimeout(() => setIsError(false), 300);
            }
            return;
        }

        onSave(
            {
                title: title.trim(),
                description: description.trim(),
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            },
            plan?.id
        );

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

    const renderPlanForm = () => (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-4", !isDesktop && "px-4")}>
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
                        radius='medium'
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
                        radius='medium'
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
                                    <Flex gap="2" align="center" style={{ width: '100%' }}>
                                        <CalendarIcon className="shrink-0" />
                                        <Text size="2" color={startDate ? undefined : "gray"} highContrast={!!startDate} className="truncate">
                                            {startDate ? formatDate(startDate.toISOString()) : 'Select date'}
                                        </Text>
                                    </Flex>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[100]" align="start">
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
                                    <Flex gap="2" align="center" style={{ width: '100%' }}>
                                        <CalendarIcon className="shrink-0" />
                                        <Text size="2" color={endDate ? undefined : "gray"} highContrast={!!endDate} className="truncate">
                                            {endDate ? formatDate(endDate.toISOString()) : 'Select date'}
                                        </Text>
                                    </Flex>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[100]" align="start">
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

            {isDesktop ? (
                <DialogFooter className="pt-2">
                    <Button size="3" variant="soft" radius='medium' color="gray" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button size="3" variant="solid" radius='medium' color="violet" type="submit" disabled={!title.trim() || !startDate || !endDate}>
                        {plan ? 'Save Changes' : 'Create Plan'}
                    </Button>
                </DialogFooter>
            ) : (
                <DrawerFooter className="px-0 pt-2 pb-6">
                    <Button size="4" variant="solid" radius='large' color="violet" type="submit" disabled={!title.trim() || !startDate || !endDate}>
                        {plan ? 'Save Changes' : 'Create Plan'}
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
                            /* Scale custom components to match Radix 90% scaling */
                            .theme-scale-90 {
                                zoom: 0.9;
                            }
                            `}
                        </style>
                        <DialogHeader className="space-y-1.5 pb-1">
                            <DialogTitle asChild>
                                <Heading size="4" weight="medium" highContrast>
                                    {plan ? 'Edit Plan' : 'Create New Plan'}
                                </Heading>
                            </DialogTitle>
                            <DialogDescription asChild>
                                <Text size="2" color="gray" as="p">
                                    {plan
                                        ? 'Update the details, timeframe, or goals for this plan.'
                                        : 'Set a goal with a specific timeframe and break it down into actionable steps.'}
                                </Text>
                            </DialogDescription>
                        </DialogHeader>
                        {renderPlanForm()}
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
                    /* Scale custom components to match Radix 90% scaling for internal dialog items */
                        .theme-scale-90 {
                            zoom: 0.9;
                        }
                    `}
                    </style>
                    <DrawerHeader className="text-left px-4 pt-6 pb-6">
                        <DrawerTitle asChild>
                            <Heading size="6" weight="medium" highContrast>
                                {plan ? 'Edit Plan' : 'Create New Plan'}
                            </Heading>
                        </DrawerTitle>
                        <DrawerDescription asChild>
                            <Text size="3" color="gray" mt="1" as="p">
                                {plan
                                    ? 'Update the details, timeframe, or goals for this plan.'
                                    : 'Set a goal with a specific timeframe and break it down into actionable steps.'}
                            </Text>
                        </DrawerDescription>
                    </DrawerHeader>
                    {renderPlanForm()}
                </Theme>
            </DrawerContent>
        </Drawer>
    );
}
