import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Plan } from '@/app/types';

interface DeletePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan | null;
    onDeletePlan: (planId: string) => void;
}

export function DeletePlanDialog({ open, onOpenChange, plan, onDeletePlan }: DeletePlanDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!plan) return;
        setIsDeleting(true);
        // Add a tiny delay for visual feedback if needed, but synchronous works as well
        onDeletePlan(plan.id);
        setIsDeleting(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-1.5 pb-2">
                    <DialogTitle className="text-[20px] font-semibold text-destructive tracking-tight">Delete Plan</DialogTitle>
                    <DialogDescription className="text-[14px] text-muted-foreground/80">
                        Are you sure you want to delete the plan <span className="font-semibold text-foreground">"{plan?.title}"</span>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 text-sm text-muted-foreground mb-4">
                    This action will permanently delete this plan and all of its associated actions. This cannot be undone.
                </div>

                <DialogFooter className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="h-9 px-4 text-[13px] font-medium border-border/50 text-muted-foreground shadow-sm hover:bg-muted/40 hover:text-foreground active:scale-[0.97] transition-all duration-200 rounded-[8px]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        variant="destructive"
                        className="h-9 px-4 text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] active:scale-[0.97] transition-all duration-200 rounded-[8px] hover:bg-destructive/80 dark:hover:bg-destructive/80"
                    >
                        Delete Plan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
