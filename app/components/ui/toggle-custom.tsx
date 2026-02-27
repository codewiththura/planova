"use client";

import { cn } from "@/app/lib/utils";

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
}

export function Toggle({ enabled, onToggle }: ToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                enabled ? "bg-primary" : "bg-muted-foreground/30"
            )}
            role="switch"
            aria-checked={enabled}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    enabled ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
    );
}
