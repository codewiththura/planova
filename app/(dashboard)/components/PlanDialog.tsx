"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/app/components/ui/drawer';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { Heading, Text, TextField, TextArea, Button, Flex, Theme } from '@radix-ui/themes';
import { Plan } from '@/app/types';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

interface DatePickerFieldProps {
    label: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    minDate?: Date;
}

function DatePickerField({ label, date, onSelect, minDate }: DatePickerFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedDate: Date | undefined) => {
        onSelect(selectedDate);
        setIsOpen(false);
    };

    return (
        <div className="grid gap-2">
            <Text as="label" size="2" weight="medium" highContrast>
                {label} <Text color="red">*</Text>
            </Text>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="h-10 px-3 flex items-center justify-start text-left bg-[var(--color-surface)] shadow-[inset_0_0_0_1px_var(--gray-a7)] hover:shadow-[inset_0_0_0_1px_var(--gray-a8)] focus-visible:shadow-[inset_0_0_0_1px_var(--violet-a8),0_0_0_1px_var(--violet-a8)] rounded-[8px] outline-none transition-all"
                    >
                        <Flex gap="2" align="center" style={{ width: '100%' }}>
                            <CalendarIcon className="shrink-0" />
                            <Text size="2" color={date ? undefined : "gray"} highContrast={!!date} className="truncate">
                                {date ? formatDate(date.toISOString()) : 'Select date'}
                            </Text>
                        </Flex>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[100]" align="start">
                    <div className="theme-scale-90">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            disabled={(d) => minDate ? d < minDate : false}
                            initialFocus
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

interface PlanFormProps {
    plan?: Plan | null;
    isDesktop: boolean;
    onCancel: () => void;
    onSubmit: (planData: any) => void;
}

function PlanForm({ plan, isDesktop, onCancel, onSubmit }: PlanFormProps) {
    const [title, setTitle] = useState(plan?.title || '');
    const [description, setDescription] = useState(plan?.description || '');
    const [startDate, setStartDate] = useState<Date | undefined>(plan?.startDate ? new Date(plan?.startDate) : new Date());
    const [endDate, setEndDate] = useState<Date | undefined>(plan?.endDate ? new Date(plan?.endDate) : undefined);
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

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
    };

    const isSubmitDisabled = !title.trim() || !startDate || !endDate;

    return (
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
                    <DatePickerField
                        label="Start Date"
                        date={startDate}
                        onSelect={setStartDate}
                    />
                    <DatePickerField
                        label="End Date"
                        date={endDate}
                        onSelect={setEndDate}
                        minDate={startDate}
                    />
                </div>
            </div>

            <DialogFooter className="pt-2">
                {isDesktop && (
                    <Button size="3" variant="soft" radius='medium' color="gray" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button size="3" variant="solid" radius='medium' color="violet" type="submit" disabled={isSubmitDisabled}>
                    {plan ? 'Save Changes' : 'Create Plan'}
                </Button>
            </DialogFooter>
        </form>
    );
}

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

    const handleSave = (planData: any) => {
        onSave(planData, plan?.id);
        onOpenChange(false);
    };

    const headerText = plan ? 'Edit Plan' : 'Create New Plan';
    const descriptionText = plan
        ? 'Update the details, timeframe, or goals for this plan.'
        : 'Set a goal with a specific timeframe and break it down into actionable steps.';

    // Shared internal content to prevent duplicating the Theme and Form
    const FormContent = (
        <Theme appearance="inherit" accentColor="violet" scaling={isDesktop ? "90%" : "100%"} radius="large" hasBackground={false} style={{ display: 'contents' }}>
            <style>
                {`
                .theme-scale-90 {
                    zoom: 0.9;
                }
                `}
            </style>

            {/* Conditional Header based on container */}
            {isDesktop ? (
                <DialogHeader className="space-y-1.5 pb-1">
                    <DialogTitle asChild><Heading size="4" weight="medium" highContrast>{headerText}</Heading></DialogTitle>
                    <DialogDescription asChild><Text size="2" color="gray" as="p">{descriptionText}</Text></DialogDescription>
                </DialogHeader>
            ) : (
                <DrawerHeader className="text-left px-4 pt-6 pb-6">
                    <DrawerTitle asChild><Heading size="6" weight="medium" highContrast>{headerText}</Heading></DrawerTitle>
                    <DrawerDescription asChild><Text size="3" color="gray" mt="1" as="p">{descriptionText}</Text></DrawerDescription>
                </DrawerHeader>
            )}

            {/* Render the Form only if the dialog is open to ensure fresh state reset */}
            {open && (
                <PlanForm
                    plan={plan}
                    isDesktop={isDesktop}
                    onCancel={() => onOpenChange(false)}
                    onSubmit={handleSave}
                />
            )}
        </Theme>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    {FormContent}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="px-2 py-4 rounded-t-3xl">
                {FormContent}
            </DrawerContent>
        </Drawer>
    );
}