"use client";

import { useState } from 'react';
import { Plan } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel } from '@/app/components/ui/dropdown-menu';
import { ArrowUpIcon, ArrowDownIcon, CheckCircledIcon, CrossCircledIcon, ChevronDownIcon, ClockIcon, CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { formatDate, formatDateTime } from '@/app/utils/helpers';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { Input } from '@/app/components/ui/input';
import { SortDropdown, SortDirection } from '@/app/components/SortDropdown';

type SortField = 'completedAt' | 'startDate';

const sortOptions: Record<SortField, { label: string, asc: string, desc: string, defaultDirection?: SortDirection }> = {
    completedAt: { label: 'Completed Date', asc: 'Oldest → Newest', desc: 'Newest → Oldest', defaultDirection: 'desc' },
    startDate: { label: 'Start Date', asc: 'Earliest → Latest', desc: 'Latest → Earliest' },
};

// Dummy data
const initialCompletedPlans: Plan[] = [
    {
        id: 'c1',
        title: 'Office Renovation Plan Management System',
        description: 'Update visual identity, including new logo and color palette.',
        startDate: new Date("2026-01-22").toISOString(),
        endDate: new Date("2026-02-14").toISOString(),
        status: 'completed',
        createdAt: new Date("2026-01-20").toISOString(),
        completedAt: new Date("2026-02-14").toISOString(),
    },
    {
        id: 'c2',
        title: 'Q4 Marketing Campaign',
        description: 'Holiday season promotional materials and ad spend.',
        startDate: new Date("2025-11-01").toISOString(),
        endDate: new Date("2025-12-25").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-10-15").toISOString(),
        completedAt: new Date("2025-12-28").toISOString(),
    },
    {
        id: 'c3',
        title: 'Website Migration',
        description: 'Move to new hosting provider and update DNS.',
        startDate: new Date("2025-08-10").toISOString(),
        endDate: new Date("2025-08-20").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-08-01").toISOString(),
        completedAt: new Date("2025-08-22").toISOString(),
    },
    {
        id: 'c4',
        title: 'Python eBook Launch',
        description: 'Initial release of Self-study Programmer: Python.',
        startDate: new Date("2025-12-01").toISOString(),
        endDate: new Date("2025-12-15").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-11-20").toISOString(),
        completedAt: new Date("2025-12-18").toISOString(),
    },
    {
        id: 'c5',
        title: 'JS Course Recording',
        description: 'Record all 20 modules for the Beginner JS series.',
        startDate: new Date("2026-01-05").toISOString(),
        endDate: new Date("2026-01-25").toISOString(),
        status: 'completed',
        createdAt: new Date("2026-01-01").toISOString(),
        completedAt: new Date("2026-01-28").toISOString(),
    },
    {
        id: 'c6',
        title: 'Portfolio Redesign',
        description: 'Refactor personal site with Next.js and Tailwind.',
        startDate: new Date("2025-09-01").toISOString(),
        endDate: new Date("2025-09-15").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-08-25").toISOString(),
        completedAt: new Date("2025-09-20").toISOString(),
    },
    {
        id: 'c7',
        title: 'Email Newsletter Setup',
        description: 'Migrate subscribers from Mailchimp to Beehiiv.',
        startDate: new Date("2025-10-10").toISOString(),
        endDate: new Date("2025-10-15").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-10-01").toISOString(),
        completedAt: new Date("2025-10-16").toISOString(),
    },
    {
        id: 'c8',
        title: 'Docker Workshop preperation',
        description: 'Drafting materials for the live technical session.',
        startDate: new Date("2025-11-20").toISOString(),
        endDate: new Date("2025-11-30").toISOString(),
        status: 'completed',
        createdAt: new Date("2025-11-10").toISOString(),
        completedAt: new Date("2025-11-30").toISOString(),
    }
];

const initialCompletedActions = [
    {
        id: 'a1',
        title: 'Create marketing materials',
        planName: 'Q1 Product Launch',
        completedAt: new Date("2026-02-21").toISOString(),
    },
    {
        id: 'a2',
        title: 'Prepare training materials',
        planName: 'Team Training Program',
        completedAt: new Date("2026-02-21").toISOString(),
    },
    {
        id: 'a3',
        title: 'Finalize product specifications',
        planName: 'Q1 Product Launch',
        completedAt: new Date("2026-02-20").toISOString(),
    },
    {
        id: 'a4',
        title: 'Complete renovation work',
        planName: 'Office Renovation',
        completedAt: new Date("2026-02-14").toISOString(),
    }
];

export default function HistoryPage() {
    const [plans] = useState<Plan[]>(initialCompletedPlans);
    const [sortField, setSortField] = useState<SortField>('completedAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [visibleCount, setVisibleCount] = useState(3);
    const [visibleActionCount, setVisibleActionCount] = useState(5);
    const [mobileFilter, setMobileFilter] = useState<'plans' | 'actions'>('plans');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSortChange = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection(field === 'completedAt' ? 'desc' : 'asc');
        }
    };

    const filteredPlans = plans.filter(p => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    });

    const sortedPlans = [...filteredPlans].sort((a, b) => {
        let comparison = 0;
        if (sortField === 'completedAt') {
            comparison = new Date(a.completedAt || a.closedAt || a.endDate).getTime() - new Date(b.completedAt || b.closedAt || b.endDate).getTime();
        } else if (sortField === 'startDate') {
            comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const visiblePlans = sortedPlans.slice(0, visibleCount);
    const hasMore = visibleCount < sortedPlans.length;

    const filteredActions = initialCompletedActions.filter(a => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return a.title.toLowerCase().includes(query) || a.planName.toLowerCase().includes(query);
    });

    const visibleActions = filteredActions.slice(0, visibleActionCount);
    const hasMoreActions = visibleActionCount < filteredActions.length;

    const formatActionDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-6 max-w-[1600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 md:mb-6">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-[280px]">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 rounded-full h-10 bg-background"
                        />
                    </div>
                </div>

                <div className="flex flex-row-reverse items-center justify-between gap-3">
                    <div className="sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 bg-background shadow-sm hover:bg-muted/50 rounded-full h-10 px-4">
                                    {mobileFilter === 'plans' ? 'Plans' : 'Actions'}
                                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40 rounded-xl">
                                <DropdownMenuItem onClick={() => setMobileFilter('plans')} className={cn("py-2 cursor-pointer", mobileFilter === 'plans' && "bg-primary/10 text-primary dark:bg-primary/40 focus:bg-primary/15")}>Plans</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMobileFilter('actions')} className={cn("py-2 cursor-pointer", mobileFilter === 'actions' && "bg-primary/10 text-primary dark:bg-primary/40 focus:bg-primary/15")}>Actions</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="shrink-0">
                        <SortDropdown
                            sortOptions={sortOptions}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSortChange={handleSortChange}
                            align="end"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] container mx-auto pb-12 flex flex-col sm:grid sm:grid-cols-2 sm:gap-14">
                <section className={cn("sm:block", mobileFilter === 'plans' ? 'block' : 'hidden')}>
                    <Heading size="4" className="hidden sm:block text-muted-foreground uppercase">
                        PLANS
                    </Heading>

                    <div className="grid gap-2 mt-5">
                        {visiblePlans.map((plan) => (
                            <Card key={plan.id} className="transition-all duration-100 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative border-border/60 dark:bg-card/80 dark:border-border/40 hover:border-primary/40 dark:hover:border-primary/30 rounded-xl w-full">
                                <CardContent className="p-4 flex flex-row items-center justify-between gap-3 sm:gap-10">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="mt-0.5 shrink-0">
                                            {plan.status === 'completed' ? (
                                                <CheckCircledIcon className="h-5 w-5 text-muted-foreground" />
                                            ) : (
                                                <CrossCircledIcon className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <Heading size="3" as="h3" className="line-clamp-1">{plan.title}</Heading>
                                            <Text size="2" color="gray" className="flex items-center gap-1.5 text-muted-foreground">
                                                <ClockIcon className="h-3 w-3" />
                                                {formatDateTime(plan.completedAt || plan.closedAt || plan.endDate)}
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'} className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.status === 'completed' ? 'bg-primary text-primary-foreground' : ''}`}>
                                            {plan.status === 'completed' ? 'Completed' : 'Closed'}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {visiblePlans.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-2xl border-dashed bg-muted/10">
                                <div className="bg-muted rounded-full p-4 mb-4 shadow-sm">
                                    <CheckCircledIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <Heading size="5" mb="2">No Completed Plans</Heading>
                                <Text size="2" color="gray" align="center" style={{ maxWidth: '28rem' }}>
                                    When you mark a plan as done on your dashboard, it will appear here.
                                </Text>
                            </div>
                        )}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center pt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setVisibleCount(prev => prev + 5)}
                                className="text-primary hover:text-primary hover:bg-primary/10 rounded-full px-6 gap-2"
                            >
                                Show more
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </section>

                <section className={cn("pb-8 sm:block", mobileFilter === 'actions' ? 'block' : 'hidden')}>
                    <Heading size="4" className="hidden sm:block text-muted-foreground uppercase mb-5">
                        ACTIONS
                    </Heading>

                    <div className="relative pl-1 sm:pl-3 mt-5">
                        <div className="absolute left-[15px] sm:left-[23px] top-6 bottom-4 w-px bg-border/60 dark:bg-border/40 z-0 hidden sm:block" />

                        <div className="space-y-4">
                            {visibleActions.map((action, index) => (
                                <div key={action.id} className={cn("relative flex items-start gap-4 sm:gap-6 group mb-5", index < visibleActions.length - 1 && "border-b border-border/40 sm:border-0 pb-5 sm:pb-0")}>
                                    <div className="relative z-10 flex-shrink-0 bg-background pt-0.5 pb-1 hidden sm:block mt-1">
                                        <CheckCircledIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <div className="flex-1 flex flex-row items-center justify-between gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Heading size="3" as="h4" className="font-medium">{action.title}</Heading>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                                                <Text size="2">{action.planName}</Text>
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon className="h-3 w-3" />
                                                    <Text size="2">{formatActionDate(action.completedAt)}</Text>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0">
                                            <Badge variant="outline" className="px-3 py-0.5 rounded-full text-xs font-semibold text-foreground bg-accent/10 border-border/80">
                                                Done
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>

                    {hasMoreActions && (
                        <div className="flex justify-center pt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setVisibleActionCount(prev => prev + 5)}
                                className="text-primary hover:text-primary hover:bg-primary/10 rounded-full px-6 gap-2"
                            >
                                Show more
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
