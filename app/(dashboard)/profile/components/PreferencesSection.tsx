"use client";

import { Heading, Text } from "@radix-ui/themes";
import { Bell, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Toggle } from "@/app/components/ui/toggle-custom";

interface PreferencesSectionProps {
    notifEnabled: boolean;
    setNotifEnabled: (val: boolean | ((v: boolean) => boolean)) => void;
    currentTheme: string;
    setTheme: (theme: string) => void;
    language: string;
    setLanguage: (val: string) => void;
    mounted: boolean;
}

export function PreferencesSection({
    notifEnabled,
    setNotifEnabled,
    currentTheme,
    setTheme,
    language,
    setLanguage,
    mounted,
}: PreferencesSectionProps) {
    return (
        <div className="mt-5 bg-card rounded-2xl border border-border p-6">
            <Heading size="4" weight="bold">Preferences</Heading>
            <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">Customize your app experience</Text>

            {/* Notifications */}
            <div className="flex justify-between items-center py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <Bell className="h-4 w-4" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Notifications</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">Enable push notifications</Text>
                    </div>
                </div>
                <Toggle enabled={notifEnabled} onToggle={() => setNotifEnabled((v) => !v)} />
            </div>

            {/* Theme */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-border/60 gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Appearance</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">Choose your preferred theme</Text>
                    </div>
                </div>
                {mounted && (
                    <div className="flex gap-2 ml-11 sm:ml-0">
                        {(["light", "dark", "system"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={cn(
                                    "px-4 py-2 rounded-md border text-xs font-medium capitalize transition-all",
                                    currentTheme === t
                                        ? "bg-primary text-primary-foreground border-transparent"
                                        : "border-border text-foreground hover:bg-muted/50 bg-transparent"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Language */}
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <Globe className="h-4 w-4" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Language</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">Select your display language</Text>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="appearance-none bg-muted/50 border border-border text-sm text-foreground rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
