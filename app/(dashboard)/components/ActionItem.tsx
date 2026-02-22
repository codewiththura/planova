import { Text } from '@radix-ui/themes';

import { Action, ActionStatus } from '@/app/types';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { Cross2Icon, ReloadIcon, CalendarIcon, ClockIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { formatDate } from '@/app/utils/helpers';
import { cn } from '@/app/lib/utils';

interface ActionItemProps {
  action: Action;
  onUpdateStatus: (actionId: string, status: ActionStatus) => void;
  onEditAction?: (action: Action) => void;
  onDeleteAction?: (action: Action) => void;
}

export function ActionItem({ action, onUpdateStatus, onEditAction, onDeleteAction }: ActionItemProps) {
  const handleCheckboxChange = (checked: boolean) => {
    if (action.status === 'pending') {
      onUpdateStatus(action.id, 'done');
    } else if (action.status === 'done') {
      onUpdateStatus(action.id, 'pending');
    }
  };

  const handleDelete = () => {
    if (onDeleteAction) onDeleteAction(action);
  };

  const handleRestore = () => {
    onUpdateStatus(action.id, 'pending');
  };

  const handleEdit = () => {
    if (onEditAction) {
      onEditAction(action);
    }
  };

  const renderActionDate = () => {
    if (!action.dateMode || action.dateMode === 'none') return null;

    if (action.dateMode === 'date_range' && action.startDate && action.endDate) {
      return (
        <Text size="1" color="gray" className="flex items-center gap-1 mt-0.5">
          <CalendarIcon className="w-3 h-3" />
          {formatDate(action.startDate)} - {formatDate(action.endDate)}
        </Text>
      );
    }

    if (action.dateMode === 'specific_date' && action.startDate) {
      const timeStr = (action.startTime && action.endTime)
        ? `${action.startTime} - ${action.endTime}`
        : action.startTime || action.endTime;

      return (
        <Text size="1" color="gray" className="flex items-center gap-1 mt-0.5">
          <CalendarIcon className="w-3 h-3" />
          {formatDate(action.startDate)}
          {timeStr && (
            <>
              <ClockIcon className="w-3 h-3 ml-1" />
              {timeStr}
            </>
          )}
        </Text>
      );
    }

    return null;
  };

  return (
    <div className={cn(
      "flex items-center gap-3 py-2 px-3 rounded-md group transition-colors",
      action.status === 'cancel' && "opacity-50"
    )}>
      <Checkbox
        checked={action.status === 'done'}
        onCheckedChange={handleCheckboxChange}
        disabled={action.status === 'cancel'}
        className={cn(action.status === 'cancel' && "cursor-not-allowed")}
      />

      <div className="flex-1 min-w-0">
        <Text
          size="2"
          className={cn(
            "transition-all block truncate",
            action.status === 'done' && "line-through text-muted-foreground",
            action.status === 'cancel' && "line-through text-muted-foreground"
          )}
        >
          {action.title}
        </Text>
        {renderActionDate()}
      </div>

      {action.status === 'cancel' ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          onClick={handleRestore}
        >
          <ReloadIcon className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleEdit}
          >
            <Pencil1Icon className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleDelete}
          >
            <Cross2Icon className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
