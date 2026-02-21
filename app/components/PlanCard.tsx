import React, { useState } from 'react';
import { Plan, Action } from '@/app/types';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { PlusIcon, CalendarIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, CheckCircledIcon, CrossCircledIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Heading, Text, Flex } from '@radix-ui/themes';
import { calculateProgress, getDaysLeft, formatDate, isOverdue } from '@/app/utils/helpers';
import { ActionItem } from './ActionItem';
import { CreateActionDialog } from './CreateActionDialog';
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
  onUpdateActionStatus: (actionId: string, status: Action['status']) => void;
  onUpdatePlanStatus: (planId: string, status: Plan['status']) => void;
}

export function PlanCard({ plan, actions, onCreateAction, onUpdateActionStatus, onUpdatePlanStatus }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showCreateAction, setShowCreateAction] = useState(false);

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

  return (
    <>
      <Card className={cn(
        "transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-primary/40",
        overdue && "border-destructive hover:border-destructive"
      )}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCompletePlan}>
                  <CheckCircledIcon className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClosePlan}>
                  <CrossCircledIcon className="mr-2 h-4 w-4" />
                  Close Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Flex align="center" gap="2">
              <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
              <Text size="1" color="gray">{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</Text>
            </Flex>
            <Flex align="center" gap="2">
              <ClockIcon className="h-3.5 w-3.5 text-gray-500" />
              <Text size="1" color={overdue ? "red" : "gray"} weight={overdue ? "medium" : undefined}>
                {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
              </Text>
            </Flex>
          </div>

          <div className="space-y-1.5 pt-3">
            <div className="flex items-center justify-between text-xs">
              <Text size="1" color="gray">Progress</Text>
              <Text size="1" weight="medium">{progress}%</Text>
            </div>
            <Progress value={progress} className="h-1.5" />
            <Text size="1" color="gray">
              {planActions.filter(a => a.status === 'done').length} of {activeActions.length} actions completed
            </Text>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-1.5"
            >
              {expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              {planActions.length} {planActions.length === 1 ? 'Action' : 'Actions'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateAction(true)}
              className="gap-1.5"
            >
              <PlusIcon className="h-4 w-4" />
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
    </>
  );
}
