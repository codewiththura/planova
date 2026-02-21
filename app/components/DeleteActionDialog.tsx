import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Action } from '@/app/types';

interface DeleteActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action: Action | null;
    onDeleteAction: (actionId: string) => void;
}

export function DeleteActionDialog({ open, onOpenChange, action, onDeleteAction }: DeleteActionDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!action) return;
        setIsDeleting(true);
        onDeleteAction(action.id);
        setIsDeleting(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-1.5 pb-2">
                    <DialogTitle className="text-[20px] font-semibold text-destructive tracking-tight">Delete Action</DialogTitle>
                    <DialogDescription className="text-[14px] text-muted-foreground/80">
                        Are you sure you want to delete the action <span className="font-semibold text-foreground">"{action?.title}"</span>?
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 text-sm text-muted-foreground mb-4">
                    This action will be permanently deleted. This cannot be undone.
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
                        Delete Action
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
