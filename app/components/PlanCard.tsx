import React, { useState } from 'react';
import { Plan, Action } from '@/app/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { PlusIcon, CalendarIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
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
  onCreateAction: (planId: string, title: string) => void;
  onUpdateActionStatus: (actionId: string, status: Action['status']) => void;
  onUpdatePlanStatus: (planId: string, status: Plan['status']) => void;
}

export function PlanCard({ plan, actions, onCreateAction, onUpdateActionStatus, onUpdatePlanStatus }: PlanCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showCreateAction, setShowCreateAction] = useState(false);
  
  const progress = calculateProgress(plan, actions);
  const daysLeft = getDaysLeft(plan);
  const overdue = isOverdue(plan);
  const planActions = actions.filter(action => action.planId === plan.id);
  const activeActions = planActions.filter(action => action.status !== 'cancel');

  const handleCreateAction = (title: string) => {
    onCreateAction(plan.id, title);
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
        "transition-all",
        overdue && "border-destructive"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                {overdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
              {plan.description && (
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Actions
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
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              <span className={cn(overdue && "text-destructive font-medium")}>
                {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
              </span>
            </div>
          </div>
          
          <div className="space-y-2 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {planActions.filter(a => a.status === 'done').length} of {activeActions.length} actions completed
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
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
            <div className="space-y-1 border-t pt-3">
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
            <div className="text-center py-8 text-sm text-muted-foreground border-t">
              No actions yet. Click "Add Action" to get started.
            </div>
          )}
        </CardContent>
      </Card>
      
      <CreateActionDialog
        open={showCreateAction}
        onOpenChange={setShowCreateAction}
        planTitle={plan.title}
        onCreateAction={handleCreateAction}
      />
    </>
  );
}
