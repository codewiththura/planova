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

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r bg-card hidden md:flex md:flex-col">
            <div className="flex h-16 items-center border-b px-5">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2">
                        <TargetIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <Heading size="3">Planova</Heading>
                        <Text size="1" color="gray">Turn plans into actions</Text>
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
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto border-t p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Text size="1" weight="bold">ME</Text>
                    </div>
                    <div className="flex flex-col">
                        <Text size="2" weight="medium">User Account</Text>
                        <Text size="1" color="gray">user@example.com</Text>
                    </div>
                </div>
            </div>
        </aside>
    );
}
