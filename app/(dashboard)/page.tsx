"use client";

import { useState } from 'react';
import { Plan, Action, ActionStatus, PlanStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { PlanCard } from '@/app/(dashboard)/components/PlanCard';
import { PlanColumn } from '@/app/(dashboard)/components/PlanColumn';
import { CreatePlanDialog } from '@/app/(dashboard)/components/CreatePlanDialog';
import { PlusIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { calculateProgress } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { SortDropdown, SortDirection } from '@/app/components/SortDropdown';
import { SearchBar } from '@/app/components/SearchBar';
import { initialPlans, initialActions } from './lib/data';

type SortField = 'start_date' | 'progress' | 'task_count';

const sortOptions: Record<SortField, { label: string, asc: string, desc: string, defaultDirection?: SortDirection }> = {
  start_date: { label: 'Start Date', asc: 'Earliest → Latest', desc: 'Latest → Earliest' },
  progress: { label: 'Progress', asc: 'Least → Most', desc: 'Most → Least' },
  task_count: { label: 'Task Count', asc: 'Fewest → Most', desc: 'Most → Fewest' }
};

export default function Dashboard() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [mobileFilter, setMobileFilter] = useState<'coming_up' | 'ongoing' | 'overdue'>('ongoing');
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

  const handleEditPlan = (planId: string, updates: { title: string; description: string; startDate: string; endDate: string; }) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, ...updates } : p));
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter(p => p.id !== planId));
    setActions(actions.filter(a => a.planId !== planId));
  };

  const handleDeleteAction = (actionId: string) => {
    setActions(actions.filter(a => a.id !== actionId));
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

  const handleEditAction = (actionId: string, title: string, options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }) => {
    setActions(actions.map(a => a.id === actionId ? { ...a, title, ...options } : a));
  };

  const handleUpdateActionStatus = (actionId: string, status: ActionStatus) => {
    setActions(actions.map(a => a.id === actionId ? { ...a, status } : a));
  };

  const handleUpdatePlanStatus = (planId: string, status: PlanStatus) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, status, ...(status === 'completed' ? { completedAt: new Date().toISOString() } : status === 'closed' ? { closedAt: new Date().toISOString() } : {}) } : p));
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

  const comingUpPlans = sortPlans(activePlans.filter(p => new Date(p.startDate) > now));
  const ongoingPlans = sortPlans(activePlans.filter(p => new Date(p.startDate) <= now && new Date(p.endDate) >= now));
  const overduePlans = sortPlans(activePlans.filter(p => new Date(p.endDate) < now));

  const getMobilePlans = () => {
    switch (mobileFilter) {
      case 'coming_up': return comingUpPlans;
      case 'ongoing': return ongoingPlans;
      case 'overdue': return overduePlans;
      default: return ongoingPlans;
    }
  };

  const getFilterLabel = () => {
    switch (mobileFilter) {
      case 'coming_up': return 'Coming Up';
      case 'ongoing': return 'Ongoing';
      case 'overdue': return 'Overdue';
      default: return 'Ongoing';
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 md:mb-6">
        <SearchBar
          placeholder="Search plans..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="shrink-0">
            <SortDropdown
              sortOptions={sortOptions}
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              align="start"
            />
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
                <DropdownMenuItem onClick={() => setMobileFilter('coming_up')} className={cn("py-2 cursor-pointer", mobileFilter === 'coming_up' && "bg-primary/10 text-primary dark:bg-primary/40 focus:bg-primary/15")}>Coming Up</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('ongoing')} className={cn("py-2 cursor-pointer", mobileFilter === 'ongoing' && "bg-primary/10 text-primary dark:bg-primary/40 focus:bg-primary/15")}>Ongoing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('overdue')} className={cn("py-2 cursor-pointer", mobileFilter === 'overdue' ? "bg-destructive/10 text-destructive dark:bg-destructive/40 focus:bg-destructive/15 focus:text-destructive" : "text-destructive focus:text-destructive")}>Overdue</DropdownMenuItem>
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
            <PlanColumn
              title="Coming Up"
              plans={comingUpPlans}
              actions={actions}
              onCreateAction={handleCreateAction}
              onEditAction={handleEditAction}
              onEditPlan={handleEditPlan}
              onDeletePlan={handleDeletePlan}
              onDeleteAction={handleDeleteAction}
              onUpdateActionStatus={handleUpdateActionStatus}
              onUpdatePlanStatus={handleUpdatePlanStatus}
            />
            <PlanColumn
              title="Ongoing"
              plans={ongoingPlans}
              actions={actions}
              onCreateAction={handleCreateAction}
              onEditAction={handleEditAction}
              onEditPlan={handleEditPlan}
              onDeletePlan={handleDeletePlan}
              onDeleteAction={handleDeleteAction}
              onUpdateActionStatus={handleUpdateActionStatus}
              onUpdatePlanStatus={handleUpdatePlanStatus}
            />
            <PlanColumn
              title="Overdue"
              plans={overduePlans}
              actions={actions}
              onCreateAction={handleCreateAction}
              onEditAction={handleEditAction}
              onEditPlan={handleEditPlan}
              onDeletePlan={handleDeletePlan}
              onDeleteAction={handleDeleteAction}
              onUpdateActionStatus={handleUpdateActionStatus}
              onUpdatePlanStatus={handleUpdatePlanStatus}
            />
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
                    onEditAction={handleEditAction}
                    onEditPlan={handleEditPlan}
                    onDeletePlan={handleDeletePlan}
                    onDeleteAction={handleDeleteAction}
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
