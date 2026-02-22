import { Card, CardContent } from '@/app/components/ui/card';
import { Heading, Text } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, ClockIcon } from '@radix-ui/react-icons';
import { Badge } from '@/app/components/ui/badge';
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
                    <div className="flex-1 flex flex-col gap-2">
                        <Heading size="3" as="h3" className="line-clamp-1">{plan.title}</Heading>
                        <Text size="2" color="gray" className="flex items-center gap-1.5 text-muted-foreground">
                            <ClockIcon className="h-3 w-3" />
                            {formatDateTime(plan.completedAt || plan.closedAt || plan.endDate)}
                        </Text>
                    </div>
                </div>

                <div className="mt-2">
                    <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'} className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.status === 'completed' ? 'bg-primary text-primary-foreground' : ''}`}>
                        {plan.status === 'completed' ? 'Completed' : 'Closed'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
