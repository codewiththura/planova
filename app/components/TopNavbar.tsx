"use client";

import { usePathname } from 'next/navigation';
import { BellIcon, SunIcon, MoonIcon, TargetIcon, SlashIcon, Component1Icon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { Heading, Text } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function TopNavbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getPageTitle = () => {
        switch (pathname) {
            case '/': return 'Dashboard';
            case '/history': return 'History';
            default: return 'Planova';
        }
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 shadow-none dark:border-border/60">
            <div className="flex items-center gap-5">
                <Link href="/" className="md:hidden flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground rounded-lg p-1.5 inline-flex">
                        <TargetIcon className="h-5 w-5" />
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-2 text-sm tracking-wide">
                    <div className="flex items-center gap-2 text-foreground hover:text-foreground transition-colors cursor-pointer">
                        <Component1Icon className="h-4 w-4" />
                    </div>
                    <DoubleArrowRightIcon className="h-4 w-4 text-foreground/50" />
                    <Text size="3" className="text-foreground">{getPageTitle()}</Text>
                </div>

                {/* Mobile bare title fallback */}
                <div className="md:hidden">
                    <Heading size="3" className="font-semibold">{getPageTitle()}</Heading>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <BellIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        {theme === 'dark' ? <MoonIcon className="h-5 w-5 text-muted-foreground" /> : <SunIcon className="h-5 w-5 text-muted-foreground" />}
                    </Button>
                )}
            </div>
        </header>
    );
}
