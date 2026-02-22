import { Heading, Text } from '@radix-ui/themes';
import { CheckCircledIcon, ClockIcon } from '@radix-ui/react-icons';
import { Badge } from '@/app/components/ui/badge';
import { cn } from '@/app/lib/utils';

interface ActionTemp {
    id: string;
    title: string;
    planName: string;
    completedAt: string;
}

interface CompletedActionItemProps {
    action: ActionTemp;
    isLast: boolean;
}

export function CompletedActionItem({ action, isLast }: CompletedActionItemProps) {
    const formatActionDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={cn("relative flex items-start gap-4 sm:gap-6 group mb-5", !isLast && "border-b border-border/40 sm:border-0 pb-5 sm:pb-0")}>
            <div className="relative z-10 flex-shrink-0 bg-background pt-0.5 pb-1 hidden sm:block mt-1">
                <CheckCircledIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 flex flex-row items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <Heading size="3" as="h4" className="font-medium">{action.title}</Heading>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                        <Text size="2">{action.planName}</Text>
                        <div className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            <Text size="2">{formatActionDate(action.completedAt)}</Text>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <Badge variant="outline" className="px-3 py-0.5 rounded-full text-xs font-semibold text-foreground bg-accent/10 border-border/80">
                        Done
                    </Badge>
                </div>
            </div>
        </div>
    );
}
