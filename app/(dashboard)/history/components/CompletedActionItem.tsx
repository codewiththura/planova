import { Text, Badge } from '@radix-ui/themes';
import { CheckCircledIcon, ClockIcon } from '@radix-ui/react-icons';
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
                <div className="flex flex-col gap-1 min-w-0">
                    <Text size="3" weight="medium" highContrast className="truncate">{action.title}</Text>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Text size="1" weight="medium" color="gray">{action.planName}</Text>
                        <Text size="1" color="gray">{formatActionDate(action.completedAt)}</Text>
                    </div>
                </div>
                {/* 
                <div className="flex-shrink-0">
                    <Badge color="grass" size="1" variant="surface">Done</Badge>
                </div> */}
            </div>
        </div>
    );
}
