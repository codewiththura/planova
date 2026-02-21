import { Heading, Text } from '@radix-ui/themes';
import { Plan, Action, ActionStatus, PlanStatus } from '@/app/types';
import { PlanCard } from '@/app/components/PlanCard';

interface PlanColumnProps {
    title: string;
    plans: Plan[];
    actions: Action[];
    onCreateAction: (
        planId: string,
        title: string,
        options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }
    ) => void;
    onEditAction: (actionId: string, title: string, options?: { dateMode?: 'none' | 'date_range' | 'specific_date', startDate?: string, endDate?: string, startTime?: string, endTime?: string }) => void;
    onEditPlan: (planId: string, updates: { title: string; description: string; startDate: string; endDate: string; }) => void;
    onUpdateActionStatus: (actionId: string, status: ActionStatus) => void;
    onUpdatePlanStatus: (planId: string, status: PlanStatus) => void;
}

export function PlanColumn({
    title,
    plans,
    actions,
    onCreateAction,
    onEditAction,
    onEditPlan,
    onUpdateActionStatus,
    onUpdatePlanStatus,
}: PlanColumnProps) {
    return (
        <div className="flex flex-col gap-4 min-h-[500px]">
            <div className="flex items-center gap-2 ms-2">
                <Heading size="4" className="text-muted-foreground uppercase">
                    {title}
                </Heading>
                <span className="text-sm text-muted-foreground font-bold">{plans.length}</span>
            </div>
            {plans.length === 0 ? (
                <Text size="2" color="gray" className="py-6 text-center italic">No plans</Text>
            ) : (
                <div className="grid gap-4">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            actions={actions}
                            onCreateAction={onCreateAction}
                            onEditAction={onEditAction}
                            onEditPlan={onEditPlan}
                            onUpdateActionStatus={onUpdateActionStatus}
                            onUpdatePlanStatus={onUpdatePlanStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
