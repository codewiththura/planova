"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TargetIcon, DashboardIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { cn } from '@/app/lib/utils';


const navItems = [
    { name: 'Dashboard', href: '/', icon: DashboardIcon },
    { name: 'History', href: '/history', icon: CounterClockwiseClockIcon },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            onMouseEnter={() => setIsCollapsed(false)}
            onMouseLeave={() => setIsCollapsed(true)}
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r bg-card hidden md:flex md:flex-col transition-all duration-300 ease-in-out z-50",
                isCollapsed ? "w-20" : "w-56"
            )}>
            <div className="flex h-16 items-center justify-between border-b px-5">
                <Link href="/" className="flex items-center gap-2 font-semibold overflow-hidden">
                    <div className="bg-primary text-primary-foreground rounded-lg me-2 p-2 shrink-0 transition-all duration-300 ease-in-out">
                        <TargetIcon className="h-5 w-5" />
                    </div>
                    <div className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                        isCollapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
                    )}>
                        <Heading size="6" className="tracking-tight mb-[1px] text-primary">Planova</Heading>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
                <nav className="grid gap-2 text-sm font-medium">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-lg py-2 transition-all duration-300 ease-in-out group",
                                    isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-muted/50"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon className={cn(
                                    "shrink-0 transition-all duration-300 ease-in-out",
                                    isCollapsed ? "h-5 w-5" : "h-4 w-4"
                                )} />
                                <span className={cn(
                                    "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                                    isCollapsed ? "max-w-0 opacity-0" : "max-w-[120px] opacity-100"
                                )}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto border-t p-4">
                <div className={cn(
                    "flex items-center transition-all duration-300 ease-in-out",
                    isCollapsed ? "justify-center" : "gap-3 px-2"
                )}>
                    <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
                        <Text size="1" weight="bold">ME</Text>
                    </div>
                    <div className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap flex flex-col",
                        isCollapsed ? "max-w-0 opacity-0" : "max-w-[130px] opacity-100"
                    )}>
                        <Text size="2" weight="medium" className="truncate">User Account</Text>
                        <Text size="1" color="gray" className="truncate text-muted-foreground">user@example.com</Text>
                    </div>
                </div>
            </div>
        </aside>
    );
}
