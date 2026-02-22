import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel } from '@/app/components/ui/dropdown-menu';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { Text } from '@radix-ui/themes';

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
    label: string;
    asc: string;
    desc: string;
    defaultDirection?: SortDirection;
}

export interface SortDropdownProps<T extends string> {
    sortOptions: Record<T, SortOption>;
    sortField: T;
    sortDirection: SortDirection;
    onSortChange: (field: T) => void;
    align?: 'start' | 'center' | 'end';
}

export function SortDropdown<T extends string>({
    sortOptions,
    sortField,
    sortDirection,
    onSortChange,
    align = 'start',
}: SortDropdownProps<T>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-full h-10 px-4 hover:bg-muted/50">
                    <Text size="2" weight="regular" className="text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                        Sort By:{" "}
                        {sortOptions[sortField].label}
                        {sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 text-muted-foreground" /> : <ArrowDownIcon className="h-3 w-3 text-muted-foreground" />}
                    </Text>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-[200px] rounded-xl z-50 p-2">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground font-normal text-xs mb-1 px-3">SORT BY</DropdownMenuLabel>
                    {(Object.keys(sortOptions) as T[]).map((key) => {
                        const option = sortOptions[key];
                        const isSelected = sortField === key;
                        const displayDirection = isSelected ? sortDirection : (option.defaultDirection || 'asc');
                        const labelText = option.label;
                        const directionText = option[displayDirection];

                        return (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => onSortChange(key)}
                                className={`py-1 my-1 px-3 flex flex-col items-start gap-0.5 cursor-pointer ${isSelected ? 'bg-primary/10 dark:bg-primary/40 text-primary dark:text-white focus:bg-primary/15' : ''
                                    }`}
                            >
                                <span className="font-semibold">{labelText}</span>
                                <span className="text-xs opacity-70 dark:text-gray-400">{directionText}</span>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
