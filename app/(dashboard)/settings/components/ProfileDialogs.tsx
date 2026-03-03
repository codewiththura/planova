"use client";

import { Text } from "@radix-ui/themes";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmClearDialog({
    open,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="bold">Clear All Data?</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">This action cannot be undone.</Text>
                    </div>
                </div>
                <Text as="p" size="2" color="gray" className="mb-5 leading-relaxed">
                    All your plans and actions will be permanently deleted. Your account will remain active.
                </Text>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-sm font-medium transition-colors"
                    >
                        Clear Data
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ConfirmDeleteAccountDialog({
    open,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-card border border-destructive/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="bold" className="text-destructive">Delete Account Permanently?</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">This action is irreversible.</Text>
                    </div>
                </div>
                <Text as="p" size="2" color="gray" className="mb-5 leading-relaxed">
                    This will permanently delete your account and all associated data, including plans, actions, and settings.
                </Text>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-sm font-medium transition-colors"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
