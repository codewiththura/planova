"use client";

import { useState } from 'react';
import { Plan } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { PlanCard } from '@/app/(dashboard)/components/PlanCard';
import { PlanColumn } from '@/app/(dashboard)/components/PlanColumn';
import { PlanDialog } from '@/app/(dashboard)/components/PlanDialog';
import { PlusIcon, ChevronDownIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { Heading, Spinner, Text } from '@radix-ui/themes';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { calculateProgress } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';
import { SortDropdown, SortDirection } from '@/app/components/SortDropdown';
import { SearchBar } from '@/app/components/SearchBar';
import { useAppData } from '@/app/hooks/useAppData';
import Image from 'next/image';
import { toast } from 'sonner';

type SortField = 'start_date' | 'progress' | 'task_count';

const sortOptions: Record<SortField, { label: string, asc: string, desc: string, defaultDirection?: SortDirection }> = {
  start_date: { label: 'Start Date', asc: 'Earliest → Latest', desc: 'Latest → Earliest' },
  progress: { label: 'Progress', asc: 'Least → Most', desc: 'Most → Least' },
  task_count: { label: 'Task Count', asc: 'Fewest → Most', desc: 'Most → Fewest' }
};

export default function Dashboard() {
  const {
    plans,
    actions,
    loading,
    handleCreatePlan,
    handleEditPlan,
    handleDeletePlan,
    handleCreateAction,
    handleEditAction,
    handleUpdateActionStatus,
    handleUpdatePlanStatus,
    handleDeleteAction
  } = useAppData();

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

  const getPlanCategory = (startDate: string, endDate: string): 'coming_up' | 'ongoing' | 'overdue' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) return 'overdue';
    if (start > now) return 'coming_up';
    return 'ongoing';
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 md:mb-6">
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
                <Button variant="outline" className="gap-1 bg-background hover:bg-muted/50 rounded-full h-10 px-4">
                  {getFilterLabel()}
                  <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl">
                <DropdownMenuItem onClick={() => setMobileFilter('coming_up')} className={cn("py-2 cursor-pointer", mobileFilter === 'coming_up' && "bg-primary/10 text-primary dark:bg-primary/15 dark:text-accent-foreground focus:bg-primary/40")}>Coming Up</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('ongoing')} className={cn("py-2 cursor-pointer", mobileFilter === 'ongoing' && "bg-primary/10 text-primary dark:bg-primary/15 dark:text-accent-foreground focus:bg-primary/40")}>Ongoing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMobileFilter('overdue')} className={cn("py-2 cursor-pointer", mobileFilter === 'overdue' && "bg-primary/10 text-primary dark:bg-primary/15 dark:text-accent-foreground focus:bg-primary/40")}>Overdue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={() => setShowCreatePlan(true)} size="lg" className="hidden md:flex rounded-3xl shadow-sm">
            <Text size="2" weight="medium">+ New Plan</Text>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Text size="3" color="gray">Loading...</Text>
        </div>
      ) : activePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 px-4 border rounded-2xl border-dashed bg-muted/10">
          <div className="w-full max-w-[200px] mb-4 flex items-center justify-center">
            <Image
              src="/illustrations/innovations-rafki.svg"
              alt="Innovation illustration showing gears and a lightbulb"
              width={240}
              height={240}
              priority
              className="w-full h-auto drop-shadow-sm"
            />
          </div>
          <Heading size="5" mb="2">No Active Plans</Heading>
          <Text size="2" color="gray" align="center" style={{ maxWidth: '28rem' }} my="4">
            Create your first plan to start organizing your goals and tracking your progress.
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreatePlan(true)}
            className="h-8 hover:bg-primary/10 rounded-full px-3 pointer-events-auto"
          >
            <Text size="2" weight="medium" color="violet"><PlusIcon className="mr-1 h-4 w-4 inline-block" /> Create Your First Plan</Text>
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
              <>
                <div className="w-full flex items-center justify-center mt-6">
                  <Image
                    src="/illustrations/cat-astronaut-rafiki.svg"
                    alt="No plans illustration"
                    width={180}
                    height={180}
                    priority
                    className="w-[240px] h-auto drop-shadow-sm"
                  />
                </div>
                <Text size="2" color="gray" className="text-center italic">No plans</Text>
              </>
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

      <PlanDialog
        open={showCreatePlan}
        onOpenChange={setShowCreatePlan}
        onSave={(newPlan) => {
          handleCreatePlan(newPlan);

          const category = getPlanCategory(newPlan.startDate, newPlan.endDate);
          const categoryLabels = {
            coming_up: 'Coming Up',
            ongoing: 'Ongoing',
            overdue: 'Overdue'
          };

          toast.custom((t) => (
            <div className="flex items-center gap-2 p-3 px-4 rounded-xl bg-accent border border-border/50 shadow-sm mx-auto w-[350px] max-w-[calc(100vw-32px)]">
              <CheckCircledIcon className="h-4 w-4 text-primary shrink-0" />
              <Text size="2" weight="medium" className="truncate text-foreground">Plan added to {categoryLabels[category]}</Text>
            </div>
          ));
          // On mobile, auto-switch to the relevant filter
          setMobileFilter(category);
        }}
      />
    </div>
  );
}
