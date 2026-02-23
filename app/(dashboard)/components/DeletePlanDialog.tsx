import React from 'react';
import { Plan } from '@/app/types';
import { DeleteDialog } from '@/app/components/DeleteDialog';

interface DeletePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan | null;
    onDeletePlan: (planId: string) => void;
}

export function DeletePlanDialog({ open, onOpenChange, plan, onDeletePlan }: DeletePlanDialogProps) {
    return (
        <DeleteDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Plan"
            itemName={plan?.title}
            description="This action will permanently delete this plan and all of its associated actions. This cannot be undone."
            onDelete={() => {
                if (plan) onDeletePlan(plan.id);
            }}
        />
    );
}
