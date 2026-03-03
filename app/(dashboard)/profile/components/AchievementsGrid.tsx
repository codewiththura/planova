"use client";

import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/app/lib/utils";

interface Achievement {
    id: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
    unlocked: boolean;
    prog: { current: number; max: number } | null;
}

interface AchievementsGridProps {
    achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
    return (
        <div className="flex-1 sm:px-6 w-full md:w-[62%] mt-2">
            <Heading size="4" weight="bold">Your Achievements</Heading>
            <Text as="p" size="2" color="gray">Track your progress and unlock new achievements</Text>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {achievements.map((ach) => (
                    <div
                        key={ach.id}
                        className={cn(
                            "border border-border p-4 rounded-xl flex items-center gap-4 transition-all",
                            ach.unlocked
                                ? "bg-accent/30"
                                : "bg-card opacity-70"
                        )}
                    >
                        {/* Icon */}
                        <div
                            className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white",
                                ach.unlocked
                                    ? `bg-gradient-to-br ${ach.color}`
                                    : "bg-muted"
                            )}
                        >
                            {ach.unlocked ? (
                                ach.icon
                            ) : (
                                <div className="grayscale opacity-60">{ach.icon}</div>
                            )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                <Text
                                    as="p"
                                    size="2"
                                    weight="medium"
                                    className={cn("truncate", !ach.unlocked && "text-muted-foreground")}
                                >
                                    {ach.label}
                                </Text>
                                {ach.unlocked && (
                                    <span className="shrink-0 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded font-medium">
                                        Unlocked
                                    </span>
                                )}
                            </div>
                            <Text as="p" size="1" color="gray" className="truncate">{ach.description}</Text>
                            {!ach.unlocked && ach.prog && (
                                <div className="mt-2">
                                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${ach.color} transition-all duration-500`}
                                            style={{ width: `${(ach.prog.current / ach.prog.max) * 100}%` }}
                                        />
                                    </div>
                                    <Text as="p" size="1" color="gray" className="mt-1">{ach.prog.current} / {ach.prog.max}</Text>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
