"use client";

import { useState } from 'react';
import { Plan, Action, ActionStatus, PlanStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { PlanCard } from '@/app/components/PlanCard';
import { CreatePlanDialog } from '@/app/components/CreatePlanDialog';
import { PlusIcon, ChevronDownIcon, MixerHorizontalIcon, ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel } from '@/app/components/ui/dropdown-menu';
import { calculateProgress } from '@/app/utils/helpers';

type SortField = 'start_date' | 'progress' | 'task_count';
type SortDirection = 'asc' | 'desc';

const sortOptions: Record<SortField, { label: string, asc: string, desc: string }> = {
  start_date: { label: 'Start Date', asc: 'Earliest → Latest', desc: 'Latest → Earliest' },
  progress: { label: 'Progress', asc: 'Least → Most', desc: 'Most → Least' },
  task_count: { label: 'Task Count', asc: 'Fewest → Most', desc: 'Most → Fewest' }
};

// Dummy data
const initialPlans: Plan[] = [
  {
    id: '1',
    title: 'Q1 Product Launch',
    description: 'Launch the new features for the Q1 release.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Brand Refresh',
    description: 'Update visual identity, including new logo and color palette.',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Market Expansion: EMEA',
    description: 'Researching localization requirements for European markets.',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Security Audit',
    description: 'Annual penetration testing and compliance review.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Mobile App Beta',
    description: 'Onboarding first 500 testers for the iOS and Android builds.',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'closed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Website Redesign Phase 1',
    description: 'Revamped landing pages, typography, and responsive layout.',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'API Performance Optimization',
    description: 'Reduced response time and optimized database queries.',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialActions: Action[] = [
  {
    id: '1',
    planId: '1',
    title: 'Finalize designs',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    planId: '1',
    title: 'Development sprint',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

];

export default function Dashboard() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [mobileFilter, setMobileFilter] = useState<'not_started' | 'in_progress' | 'overdue'>('in_progress');
  const [sortField, setSortField] = useState<SortField>('start_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreatePlan = (newPlan: { title: string; description: string; startDate: string; endDate: string }) => {
    const plan: Plan = {
      id: Math.random().toString(36).substr(2, 9),
      ...newPlan,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setPlans([...plans, plan]);
  };

  const handleCreateAction = (planId: string, title: string, options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }) => {
    const action: Action = {
      id: Math.random().toString(36).substr(2, 9),
      planId,
      title,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...options,
    };
    setActions([...actions, action]);
  };

  const handleUpdateActionStatus = (actionId: string, status: ActionStatus) => {
    setActions(actions.map(a => a.id === actionId ? { ...a, status } : a));
  };

  const handleUpdatePlanStatus = (planId: string, status: PlanStatus) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, status } : p));
  };

  const activePlans = plans.filter(p => {
    if (p.status !== 'active') return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query));
  });

  const now = new Date();

  const sortPlans = (plansToSort: Plan[]) => {
    return [...plansToSort].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'start_date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'progress':
          comparison = calculateProgress(a, actions) - calculateProgress(b, actions);
          break;
        case 'task_count': {
          const aCount = actions.filter(act => act.planId === a.id && act.status !== 'cancel').length;
          const bCount = actions.filter(act => act.planId === b.id && act.status !== 'cancel').length;
          comparison = aCount - bCount;
          break;
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const notStartedPlans = sortPlans(activePlans.filter(p => new Date(p.startDate) > now));
  const inProgressPlans = sortPlans(activePlans.filter(p => new Date(p.startDate) <= now && new Date(p.endDate) >= now));
  const overduePlans = sortPlans(activePlans.filter(p => new Date(p.endDate) < now));

  const getMobilePlans = () => {
    switch (mobileFilter) {
      case 'not_started': return notStartedPlans;
      case 'in_progress': return inProgressPlans;
      case 'overdue': return overduePlans;
      default: return inProgressPlans;
    }
  };

  const getFilterLabel = () => {
    switch (mobileFilter) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'overdue': return 'Overdue';
      default: return 'In Progress';
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 md:mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 rounded-full h-10 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-full h-10 px-4 hover:bg-muted/50">
                  {/* <MixerHorizontalIcon className="h-4 w-4 text-muted-foreground md:flex hidden" /> */}
                  <Text size="2" weight="regular" className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                    Sort By:{" "}
                    {sortOptions[sortField].label}
                    {sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 text-muted-foreground" /> : <ArrowDownIcon className="h-3 w-3 text-muted-foreground" />}
                  </Text>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] rounded-xl z-50 p-2">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-muted-foreground font-normal text-xs mb-1 px-3">SORT BY</DropdownMenuLabel>
                  {Object.entries(sortOptions).map(([key, option]) => {
                    const isSelected = sortField === key;
                    const displayDirection = isSelected ? sortDirection : 'asc';
                    const labelText = option.label;
                    const directionText = option[displayDirection as SortDirection];

                    return (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleSortChange(key as SortField)}
                        className={`py-1 my-1 px-3 flex flex-col items-start gap-0.5 cursor-pointer ${isSelected ? 'bg-primary/10 dark:bg-primary/40 text-primary dark:text-white focus:bg-primary/15' : ''}`}
                      >
                        <span className="font-semibold">{labelText}</span>
                        <span className="text-xs opacity-70 dark:text-gray-400">{directionText}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-background shadow-sm hover:bg-muted/50 rounded-full h-10 px-4">
                  {getFilterLabel()}
                  <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem onClick={() => setMobileFilter('not_started')} className="py-2 cursor-pointer">Not Started</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('in_progress')} className="py-2 cursor-pointer">In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('overdue')} className="py-2 cursor-pointer text-destructive focus:text-destructive">Overdue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setShowCreatePlan(true)} size="lg" className="hidden md:flex rounded-3xl shadow-sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Plan
          </Button>
        </div>
      </div>

      {activePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-2xl border-dashed bg-muted/10">
          <div className="bg-muted rounded-full p-4 mb-4 shadow-sm">
            <PlusIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <Heading size="5" mb="2">No Active Plans</Heading>
          <Text size="2" color="gray" align="center" style={{ maxWidth: '28rem' }} mb="6">
            Create your first plan to start organizing your goals and tracking your progress.
          </Text>
          <Button onClick={() => setShowCreatePlan(true)} className="rounded-full">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <>
          <div className="hidden md:grid gap-6 md:grid-cols-3 items-start h-full">
            {/* Coming Up Column */}
            <div className="flex flex-col gap-4 min-h-[500px]">
              <div className="flex items-center gap-2 ms-2">
                <Heading size="4" className="text-muted-foreground uppercase">
                  Coming Up
                </Heading>
                <span className="text-sm text-muted-foreground font-bold">{notStartedPlans.length}</span>
              </div>
              {notStartedPlans.length === 0 ? (
                <Text size="2" color="gray" className="py-6 text-center italic">No plans</Text>
              ) : (
                <div className="grid gap-4">
                  {notStartedPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      actions={actions}
                      onCreateAction={handleCreateAction}
                      onUpdateActionStatus={handleUpdateActionStatus}
                      onUpdatePlanStatus={handleUpdatePlanStatus}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Ongoing Column */}
            <div className="flex flex-col gap-4 min-h-[500px]">
              <div className="flex items-center gap-3 ms-2">
                <Heading size="4" className="text-muted-foreground uppercase">
                  Ongoing
                </Heading>
                <span className="text-sm text-muted-foreground font-bold">{inProgressPlans.length}</span>
              </div>
              {inProgressPlans.length === 0 ? (
                <Text size="2" color="gray" className="py-6 text-center italic">No plans</Text>
              ) : (
                <div className="grid gap-4">
                  {inProgressPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      actions={actions}
                      onCreateAction={handleCreateAction}
                      onUpdateActionStatus={handleUpdateActionStatus}
                      onUpdatePlanStatus={handleUpdatePlanStatus}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Overdue Column */}
            <div className="flex flex-col gap-4 min-h-[500px]">
              <div className="flex items-center gap-2 ms-2">
                <Heading size="4" className="text-muted-foreground uppercase">
                  Overdue
                </Heading>
                <span className="text-sm text-muted-foreground font-bold">{overduePlans.length}</span>
              </div>
              {overduePlans.length === 0 ? (
                <Text size="2" color="gray" className="py-6 text-center italic">No plans</Text>
              ) : (
                <div className="grid gap-4">
                  {overduePlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      actions={actions}
                      onCreateAction={handleCreateAction}
                      onUpdateActionStatus={handleUpdateActionStatus}
                      onUpdatePlanStatus={handleUpdatePlanStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col gap-4 h-full">
            {getMobilePlans().length === 0 ? (
              <div className="flex flex-col items-center justify-center pb-16 border rounded-2xl border-dashed bg-muted/10">
                <Text size="3" color="gray" align="center">No plans in this category.</Text>
              </div>
            ) : (
              <div className="grid gap-4">
                {getMobilePlans().map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    actions={actions}
                    onCreateAction={handleCreateAction}
                    onUpdateActionStatus={handleUpdateActionStatus}
                    onUpdatePlanStatus={handleUpdatePlanStatus}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowCreatePlan(true)}
            size="icon"
            className="md:hidden fixed bottom-24 right-5 h-14 w-14 rounded-full shadow-lg z-50"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </>
      )}

      <CreatePlanDialog
        open={showCreatePlan}
        onOpenChange={setShowCreatePlan}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}
