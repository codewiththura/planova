"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
    const { resolvedTheme } = useTheme();

    return (
        <SonnerToaster
            theme={resolvedTheme as "light" | "dark" | undefined}
            position="bottom-center"
            toastOptions={{
                className: "!rounded-xl !border-border/60 !shadow-lg",
                style: {
                    fontFamily: "inherit",
                },
            }}
            offset={12}
            gap={8}
        />
    );
}
