import { Text } from '@radix-ui/themes';
import { Action, ActionStatus } from '@/app/types';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { Cross2Icon, ReloadIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { formatDate, formatTime } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';

interface ActionItemProps {
  action: Action;
  onUpdateStatus: (actionId: string, status: ActionStatus) => void;
  onEditAction?: (action: Action) => void;
  onDeleteAction?: (action: Action) => void;
}

const formatTimeRange = (start?: string, end?: string) => {
  if (!start && !end) return null;

  return [start, end]
    .filter(Boolean)
    .map((time) => formatTime(time as string))
    .join(' - ');
};

const ActionDate = ({ action }: { action: Action }) => {
  if (!action.dateMode || action.dateMode === 'none') return null;

  if (action.dateMode === 'date_range' && action.startDate && action.endDate) {
    return (
      <Text size="1" color="gray" className="block mt-0.5 truncate w-full">
        {formatDate(action.startDate)} - {formatDate(action.endDate)}
      </Text>
    );
  }

  if (action.dateMode === 'specific_date' && action.startDate) {
    const timeStr = formatTimeRange(action.startTime, action.endTime);

    return (
      <div className="flex items-center gap-1 mt-0.5 w-full overflow-hidden">
        <Text size="1" color="gray" className="truncate shrink-0">
          {formatDate(action.startDate)}
        </Text>
        {timeStr && (
          <div className="flex items-center truncate min-w-0">
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-xs text-gray-500 truncate">{timeStr}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export function ActionItem({ action, onUpdateStatus, onEditAction, onDeleteAction }: ActionItemProps) {
  const isCanceled = action.status === 'cancel';
  const isDone = action.status === 'done';
  const isPending = action.status === 'pending';
  const isActive = action.status === 'active';
  const isInactive = isCanceled || isDone;

  const handleToggleStatus = () => {
    if (isPending) onUpdateStatus(action.id, 'active');
    else if (isActive) onUpdateStatus(action.id, 'done');
    else if (isDone) onUpdateStatus(action.id, 'pending');
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 py-2 px-1 rounded-md group transition-colors w-full min-w-0",
        isCanceled && "opacity-50"
      )}
    >
      <Checkbox
        checked={isDone ? true : isActive ? 'indeterminate' : false}
        onCheckedChange={handleToggleStatus}
        disabled={isCanceled}
        className={cn(isCanceled && "cursor-not-allowed")}
      />

      <div className="flex-1 min-w-0 ml-1 overflow-hidden">
        <Text
          size="2"
          color={isInactive ? 'gray' : undefined}
          highContrast={!isInactive}
          as="div"
          className={cn(
            "transition-all truncate w-full",
            isInactive && "line-through"
          )}
        >
          {action.title}
        </Text>
        <ActionDate action={action} />
      </div>

      <div className="flex items-center gap-1 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        {isCanceled ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onUpdateStatus(action.id, 'pending')}
            aria-label="Restore Action"
          >
            <ReloadIcon className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEditAction?.(action)}
              aria-label="Edit Action"
            >
              <Pencil1Icon className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onDeleteAction?.(action)}
              aria-label="Delete Action"
            >
              <Cross2Icon className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}