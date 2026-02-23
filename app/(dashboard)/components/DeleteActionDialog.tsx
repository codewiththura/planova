import React from 'react';
import { Action } from '@/app/types';
import { DeleteDialog } from '@/app/components/DeleteDialog';

interface DeleteActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action: Action | null;
    onDeleteAction: (actionId: string) => void;
}

export function DeleteActionDialog({ open, onOpenChange, action, onDeleteAction }: DeleteActionDialogProps) {
    return (
        <DeleteDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Action"
            itemName={action?.title}
            description="This action will be permanently deleted. This cannot be undone."
            onDelete={() => {
                if (action) onDeleteAction(action.id);
            }}
        />
    );
}
