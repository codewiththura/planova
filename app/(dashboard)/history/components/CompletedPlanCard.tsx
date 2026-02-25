import { Card, CardContent } from '@/app/components/ui/card';
import { Text, Badge } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, ClockIcon } from '@radix-ui/react-icons';
import { formatDateTime } from '@/app/utils/helpers';
import { Plan } from '@/app/types';

interface CompletedPlanCardProps {
    plan: Plan;
}

export function CompletedPlanCard({ plan }: CompletedPlanCardProps) {
    return (
        <Card className="transition-all duration-100 ease-out hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative border-border/60 dark:bg-card/80 dark:border-border/40 hover:border-primary/40 dark:hover:border-primary/30 rounded-xl w-full">
            <CardContent className="p-4 flex flex-row items-center justify-between gap-3 sm:gap-10">
                <div className="flex items-center gap-3 w-full">
                    <div className="mt-0.5 shrink-0">
                        {plan.status === 'completed' ? (
                            <CheckCircledIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <CrossCircledIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <Text size="3" weight="medium" highContrast className="truncate">{plan.title}</Text>
                        <Text size="1" color="gray">
                            Completed: {formatDateTime(plan.completedAt || plan.cancelledAt || plan.endDate)}
                        </Text>
                    </div>
                </div>

                <div>
                    <Badge color={plan.status === 'completed' ? 'grass' : 'gray'} size="1" variant="soft">
                        {plan.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
