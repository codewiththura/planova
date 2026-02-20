"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { cn } from '@/app/lib/utils';
import { Text } from '@radix-ui/themes';

const navItems = [
    { name: 'Dashboard', href: '/', icon: DashboardIcon },
    { name: 'History', href: '/history', icon: CounterClockwiseClockIcon },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-card h-20 flex items-center justify-around px-4 md:hidden">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 transition-all px-4 py-2 rounded-xl",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        <Text size="1" weight={isActive ? "medium" : "regular"}>{item.name}</Text>
                    </Link>
                );
            })}
        </div>
    );
}
