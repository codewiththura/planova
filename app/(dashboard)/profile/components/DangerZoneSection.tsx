"use client";

import { Heading, Text } from "@radix-ui/themes";
import { Trash2, AlertTriangle } from "lucide-react";

interface DangerZoneSectionProps {
    setShowClearConfirm: (val: boolean) => void;
    setShowDeleteConfirm: (val: boolean) => void;
    clearLoading: boolean;
    deleteLoading: boolean;
}

export function DangerZoneSection({
    setShowClearConfirm,
    setShowDeleteConfirm,
    clearLoading,
    deleteLoading,
}: DangerZoneSectionProps) {
    return (
        <div className="mt-5 bg-card rounded-2xl border border-destructive/20 p-6">
            <Heading size="4" weight="bold" className="text-destructive">Danger Zone</Heading>
            <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">High-risk actions that cannot be reversed</Text>

            {/* Clear All Data */}
            <div className="flex justify-between items-center py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center shrink-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Clear All Data</Text>
                        <Text as="p" size="2" color="gray">Permanently delete all plans and actions</Text>
                    </div>
                </div>
                <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={clearLoading}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-medium transition-colors disabled:opacity-60"
                >
                    {clearLoading ? (
                        <span className="h-3 w-3 rounded-full border-2 border-destructive/30 border-t-destructive animate-spin" />
                    ) : (
                        <Trash2 className="hidden sm:block h-3 w-3" />
                    )}
                    <span className="sm:inline text-xs sm:text-sm w-[60px] sm:w-auto text-left sm:text-center">Clear Data</span>
                </button>
            </div>

            {/* Delete Account */}
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-destructive/5 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium" className="text-destructive">Delete Account</Text>
                        <Text as="p" size="2" color="gray">Permanently delete your account and all data</Text>
                    </div>
                </div>
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleteLoading}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-destructive hover:opacity-90 text-destructive-foreground text-xs font-medium transition-colors disabled:opacity-60"
                >
                    {deleteLoading ? (
                        <span className="h-3 w-3 rounded-full border-2 border-destructive-foreground/30 border-t-destructive-foreground animate-spin" />
                    ) : (
                        <AlertTriangle className="hidden sm:block h-3 w-3" />
                    )}
                    <span className="sm:inline text-xs sm:text-sm w-[60px] sm:w-auto text-left sm:text-center">Delete Account</span>
                </button>
            </div>
        </div>
    );
}
