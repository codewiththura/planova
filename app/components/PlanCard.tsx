import React, { useState } from 'react';
import { Plan, Action } from '@/app/types';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { PlusIcon, CalendarIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, CheckCircledIcon, DotsHorizontalIcon, Pencil1Icon, TrashIcon, ArchiveIcon } from '@radix-ui/react-icons';
import { Heading, Text, Flex } from '@radix-ui/themes';
import { calculateProgress, getDaysLeft, formatDate, isOverdue } from '@/app/utils/helpers';
import { ActionItem } from './ActionItem';
import { CreateActionDialog } from './CreateActionDialog';
import { EditActionDialog } from './EditActionDialog';
import { EditPlanDialog } from './EditPlanDialog';
import { DeletePlanDialog } from './DeletePlanDialog';
import { DeleteActionDialog } from './DeleteActionDialog';
import { cn } from '@/app/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

interface PlanCardProps {
  plan: Plan;
  actions: Action[];
  onCreateAction: (planId: string, title: string, options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }) => void;
  onEditAction: (actionId: string, title: string, options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }) => void;
  onEditPlan: (planId: string, updates: { title: string; description: string; startDate: string; endDate: string; }) => void;
  onDeletePlan: (planId: string) => void;
  onDeleteAction: (actionId: string) => void;
  onUpdateActionStatus: (actionId: string, status: Action['status']) => void;
  onUpdatePlanStatus: (planId: string, status: Plan['status']) => void;
}

export function PlanCard({ plan, actions, onCreateAction, onEditAction, onEditPlan, onDeletePlan, onDeleteAction, onUpdateActionStatus, onUpdatePlanStatus }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showCreateAction, setShowCreateAction] = useState(false);
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [showDeletePlan, setShowDeletePlan] = useState(false);
  const [actionToEdit, setActionToEdit] = useState<Action | null>(null);
  const [actionToDelete, setActionToDelete] = useState<Action | null>(null);

  const progress = calculateProgress(plan, actions);
  const daysLeft = getDaysLeft(plan);
  const overdue = isOverdue(plan);
  const planActions = actions.filter(action => action.planId === plan.id);
  const activeActions = planActions.filter(action => action.status !== 'cancel');

  const handleCreateAction = (title: string, options?: any) => {
    onCreateAction(plan.id, title, options);
  };

  const handleCompletePlan = () => {
    onUpdatePlanStatus(plan.id, 'completed');
  };

  const handleClosePlan = () => {
    onUpdatePlanStatus(plan.id, 'closed');
  };

  const isOngoing = plan.status === 'active' && !overdue && new Date(plan.startDate) <= new Date();

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative border-border/60 dark:bg-card/80 dark:border-border/40 border-l-[3px] border-l-transparent",
        overdue
          ? "dark:border-l-destructive/50 border-l-destructive hover:border-l-destructive/80"
          : isOngoing
            ? "dark:border-l-green-500/50 border-l-green-500 hover:border-l-green-500/80"
            : "hover:border-primary/40 dark:hover:border-primary/30"
      )}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Heading size="3" as="h3">{plan.title}</Heading>
              </div>
              {plan.description && (
                <Text as="p" size="2" color="gray">{plan.description}</Text>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='w-40'>
                <DropdownMenuItem onClick={() => setShowEditPlan(true)}>
                  <Pencil1Icon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCompletePlan}>
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                  Finish
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClosePlan}>
                  <ArchiveIcon className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeletePlan(true)} className="text-destructive focus:text-destructive">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 pt-3 pb-1">
            <Flex align="center" gap="2">
              <CalendarIcon className="h-3.5 w-3.5 text-foreground" />
              <Text size="1" className="text-foreground">{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</Text>
            </Flex>
            <Flex align="center" gap="2">
              <ClockIcon className={cn("h-3.5 w-3.5", overdue ? "text-red-500/70" : "text-foreground")} />
              <Text size="1" className={cn(overdue ? "text-red-500 font-medium" : "text-foreground")}>
                {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
              </Text>
            </Flex>
          </div>

          <div className="space-y-2 pt-3">
            <div className="flex items-center justify-between text-[11px] font-medium tracking-wide text-muted-foreground">
              <span className="uppercase tracking-wider">Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 dark:bg-muted/40" />
            <Text size="1" className="text-muted-foreground/60">
              {planActions.filter(a => a.status === 'done').length} of {activeActions.length} actions completed
            </Text>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-4 pt-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-1.5 h-8 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full px-3"
            >
              {expanded ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
              {planActions.length} {planActions.length === 1 ? 'Action' : 'Actions'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateAction(true)}
              className="gap-1 h-8 text-[12px] font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-full px-3 pointer-events-auto"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Add Action
            </Button>
          </div>

          {expanded && planActions.length > 0 && (
            <div className="space-y-1 border-t pt-2 max-h-[160px] overflow-y-auto pr-1">
              {planActions.map((action) => (
                <ActionItem
                  key={action.id}
                  action={action}
                  onUpdateStatus={onUpdateActionStatus}
                  onEditAction={setActionToEdit}
                  onDeleteAction={setActionToDelete}
                />
              ))}
            </div>
          )}

          {expanded && planActions.length === 0 && (
            <Text align="center" size="2" color="gray" className="py-8 border-t block">
              No actions yet. Click "Add Action" to get started.
            </Text>
          )}
        </CardContent>
      </Card>

      <CreateActionDialog
        open={showCreateAction}
        onOpenChange={setShowCreateAction}
        planTitle={plan.title}
        planStartDate={plan.startDate}
        planEndDate={plan.endDate}
        onCreateAction={handleCreateAction}
      />

      <EditActionDialog
        open={!!actionToEdit}
        onOpenChange={(open) => {
          if (!open) setActionToEdit(null);
        }}
        planTitle={plan.title}
        planStartDate={plan.startDate}
        planEndDate={plan.endDate}
        action={actionToEdit}
        onEditAction={onEditAction}
        onArchiveAction={(actionId: string) => onUpdateActionStatus(actionId, 'cancel')}
      />

      <DeleteActionDialog
        open={!!actionToDelete}
        onOpenChange={(open) => {
          if (!open) setActionToDelete(null);
        }}
        action={actionToDelete}
        onDeleteAction={onDeleteAction}
      />

      <EditPlanDialog
        open={showEditPlan}
        onOpenChange={setShowEditPlan}
        plan={plan}
        onEditPlan={onEditPlan}
      />

      <DeletePlanDialog
        open={showDeletePlan}
        onOpenChange={setShowDeletePlan}
        plan={plan}
        onDeletePlan={onDeletePlan}
      />
    </>
  );
}
