import { Heading, Text } from '@radix-ui/themes';
import { Plan, Action, ActionStatus, PlanStatus } from '@/app/types';
import { PlanCard } from '@/app/(dashboard)/components/PlanCard';
import Image from 'next/image';

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
    onDeletePlan: (planId: string) => void;
    onDeleteAction: (actionId: string) => void;
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
    onDeletePlan,
    onDeleteAction,
    onUpdateActionStatus,
    onUpdatePlanStatus,
}: PlanColumnProps) {
    return (
        <div className="flex flex-col gap-4 min-h-[500px]">
            <div className="flex items-center gap-2 ms-2">
                <Text size="1" weight="bold" color="gray" className="uppercase tracking-wider">
                    {title}
                </Text>
                <Text size="1" weight="bold" color={title.toLowerCase() === 'overdue' ? 'red' : 'gray'}>
                    {plans.length}
                </Text>
            </div>
            {plans.length === 0 ? (
                <>
                    <div className="w-full flex items-center justify-center mt-6">
                        <Image
                            src="/illustrations/cat-astronaut-rafiki.svg"
                            alt="No plans illustration"
                            width={180}
                            height={180}
                            priority
                            className="w-[180px] h-auto drop-shadow-sm"
                        />
                    </div>
                    <Text size="2" color="gray" className="text-center italic">No plans</Text>
                </>
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
                            onDeletePlan={onDeletePlan}
                            onDeleteAction={onDeleteAction}
                            onUpdateActionStatus={onUpdateActionStatus}
                            onUpdatePlanStatus={onUpdatePlanStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
