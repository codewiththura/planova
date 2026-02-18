import { Text } from '@radix-ui/themes';

import { Action, ActionStatus } from '@/app/types';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Button } from '@/app/components/ui/button';
import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '@/app/lib/utils';

interface ActionItemProps {
  action: Action;
  onUpdateStatus: (actionId: string, status: ActionStatus) => void;
}

export function ActionItem({ action, onUpdateStatus }: ActionItemProps) {
  const handleCheckboxChange = (checked: boolean) => {
    if (action.status === 'pending') {
      onUpdateStatus(action.id, 'done');
    } else if (action.status === 'done') {
      onUpdateStatus(action.id, 'pending');
    }
  };

  const handleCancel = () => {
    onUpdateStatus(action.id, 'cancel');
  };

  const handleRestore = () => {
    onUpdateStatus(action.id, 'pending');
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

      <Text
        size="2"
        className={cn(
          "flex-1 transition-all",
          action.status === 'done' && "line-through text-muted-foreground",
          action.status === 'cancel' && "line-through text-muted-foreground"
        )}
      >
        {action.title}
      </Text>

      {action.status === 'cancel' ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRestore}
        >
          <ReloadIcon className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCancel}
        >
          <Cross2Icon className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
