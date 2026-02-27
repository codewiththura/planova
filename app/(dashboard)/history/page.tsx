"use client";

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { CheckCircledIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { cn } from '@/app/lib/utils';
import { SortDropdown, SortDirection } from '@/app/components/SortDropdown';
import { SearchBar } from '@/app/components/SearchBar';
import { CompletedPlanCard } from './components/CompletedPlanCard';
import { CompletedActionItem } from './components/CompletedActionItem';
import { useAppData } from '@/app/hooks/useAppData';
import Image from 'next/image';

type SortField = 'completedAt' | 'startDate';

const sortOptions: Record<SortField, { label: string, asc: string, desc: string, defaultDirection?: SortDirection }> = {
    completedAt: { label: 'Completed Date', asc: 'Oldest → Newest', desc: 'Newest → Oldest', defaultDirection: 'desc' },
    startDate: { label: 'Start Date', asc: 'Earliest → Latest', desc: 'Latest → Earliest' },
};

export default function HistoryPage() {
    const { plans: allPlans, actions: allActions, loading, handleUpdatePlanStatus } = useAppData();

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

    const completedPlans = allPlans.filter(p => p.status === 'completed' || p.status === 'cancel');
    const filteredPlans = completedPlans.filter(p => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
    });

    const sortedPlans = [...filteredPlans].sort((a, b) => {
        let comparison = 0;
        if (sortField === 'completedAt') {
            const dateA = a.completedAt || a.cancelledAt || a.endDate;
            const dateB = b.completedAt || b.cancelledAt || b.endDate;
            comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
        } else if (sortField === 'startDate') {
            comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const visiblePlans = sortedPlans.slice(0, visibleCount);
    const hasMore = visibleCount < sortedPlans.length;

    const completedActionsWithPlan = allActions
        .filter(a => a.status === 'done' || a.status === 'cancel')
        .map(a => {
            const plan = allPlans.find(p => p.id === a.planId);
            return {
                ...a,
                planName: plan?.title || 'Unknown Plan'
            };
        });

    const filteredActions = completedActionsWithPlan.filter(a => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return a.title.toLowerCase().includes(query) || a.planName.toLowerCase().includes(query);
    });

    const visibleActions = filteredActions.slice(0, visibleActionCount);
    const hasMoreActions = visibleActionCount < filteredActions.length;

    return (
        <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 md:mb-6">
                <SearchBar
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />

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
                                <DropdownMenuItem onClick={() => setMobileFilter('plans')} className={cn("py-2 cursor-pointer", mobileFilter === 'plans' && "bg-primary/10 text-primary dark:bg-primary/15 dark:text-accent-foreground focus:bg-primary/40")}>Plans</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setMobileFilter('actions')} className={cn("py-2 cursor-pointer", mobileFilter === 'actions' && "bg-primary/10 text-primary dark:bg-primary/15 dark:text-accent-foreground focus:bg-primary/40")}>Actions</DropdownMenuItem>
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

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Text size="3" color="gray">Loading history...</Text>
                </div>
            ) : (
                <div className="max-w-[1600px] container mx-auto pb-12 flex flex-col sm:grid sm:grid-cols-2 sm:gap-14">
                    <section className={cn("sm:block", mobileFilter === 'plans' ? 'block' : 'hidden')}>
                        <Text size="1" weight="bold" color="gray" as="div" className="hidden sm:block uppercase tracking-wider">
                            PLANS
                        </Text>

                        <div className="grid gap-2 sm:mt-4">
                            {visiblePlans.map((plan) => (
                                <CompletedPlanCard key={plan.id} plan={plan} onReactivate={(planId) => handleUpdatePlanStatus(planId, 'active')} />
                            ))}

                            {visiblePlans.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-4 px-4 border rounded-2xl border-dashed bg-muted/10">
                                    <div className="w-full max-w-[200px] mb-4 flex items-center justify-center">
                                        <Image
                                            src="/illustrations/outer-space-cuate.svg"
                                            alt="No completed plans illustration"
                                            width={240}
                                            height={240}
                                            priority
                                            className="w-full h-auto drop-shadow-sm"
                                        />
                                    </div>
                                    <Heading size="5" my="4">No Completed Plans</Heading>
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
                                    className="hover:bg-primary/10 rounded-full px-6 gap-2"
                                >
                                    <Text size="2" weight="medium" color="violet">Show more</Text>
                                    <ChevronDownIcon className="h-4 w-4 text-[var(--violet-9)]" />
                                </Button>
                            </div>
                        )}
                    </section>

                    <section className={cn("pb-8 sm:block", mobileFilter === 'actions' ? 'block' : 'hidden')}>
                        <Text size="1" weight="bold" color="gray" as="div" className="hidden sm:block uppercase tracking-wider mb-5">
                            ACTIONS
                        </Text>

                        <div className="relative sm:pl-3 sm:mt-4">
                            <div className="absolute left-[15px] sm:left-[23px] top-6 bottom-4 w-px bg-border/60 dark:bg-border/40 z-0 hidden sm:block" />

                            <div className="space-y-6">
                                {visibleActions.map((action, index) => (
                                    <CompletedActionItem key={action.id} action={action} isLast={index === visibleActions.length - 1} />
                                ))}
                                {visibleActions.length === 0 && (
                                    <>
                                        <div className='relative z-10 flex-shrink-0 bg-background pt-0.5 pb-1 hidden sm:block mt-1'>
                                            <Text size="2" color="gray" align="center" style={{ maxWidth: '28rem' }}>
                                                As you complete actions, your timeline will appear here.                                          </Text>
                                        </div>
                                        <div className="flex flex-col items-center justify-center py-4 px-4 border sm:hidden rounded-2xl border-dashed bg-muted/10">
                                            <div className="w-full max-w-[200px] mb-4 flex items-center justify-center">
                                                <Image
                                                    src="/illustrations/outer-space-cuate.svg"
                                                    alt="No completed plans illustration"
                                                    width={240}
                                                    height={240}
                                                    priority
                                                    className="w-full h-auto drop-shadow-sm"
                                                />
                                            </div>
                                            <Heading size="5" my="4">No Completed Actions</Heading>
                                            <Text size="2" color="gray" align="center" style={{ maxWidth: '28rem' }}>
                                                When you mark an action as done on your dashboard, it will appear here.
                                            </Text>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {hasMoreActions && (
                            <div className="flex justify-center pt-6">
                                <Button
                                    variant="ghost"
                                    onClick={() => setVisibleActionCount(prev => prev + 5)}
                                    className="hover:bg-primary/10 rounded-full px-6 gap-2"
                                >
                                    <Text size="2" weight="medium" color="violet">Show more</Text>
                                    <ChevronDownIcon className="h-4 w-4 text-[var(--violet-9)]" />
                                </Button>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
