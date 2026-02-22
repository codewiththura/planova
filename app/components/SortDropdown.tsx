import { Button } from '@/app/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel } from '@/app/components/ui/dropdown-menu';
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
                    <Text size="2" weight="medium" highContrast className="flex items-center gap-1.5 whitespace-nowrap">
                        Sort By:{" "}
                        <Text color="gray" weight="regular">
                            {sortOptions[sortField].label}
                        </Text>
                        {sortDirection === 'asc' ? <ArrowUpIcon className="h-3 w-3 text-muted-foreground" /> : <ArrowDownIcon className="h-3 w-3 text-muted-foreground" />}
                    </Text>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-[200px] rounded-xl z-50 p-2">
                <DropdownMenuRadioGroup value={sortField}>
                    <DropdownMenuLabel asChild className="ps-0 mb-1">
                        <Text size="1" weight="bold" color="gray" as="div" className="uppercase tracking-wider">SORT BY</Text>
                    </DropdownMenuLabel>
                    {(Object.keys(sortOptions) as T[]).map((key) => {
                        const option = sortOptions[key];
                        const isSelected = sortField === key;
                        const displayDirection = isSelected ? sortDirection : (option.defaultDirection || 'asc');
                        const labelText = option.label;
                        const directionText = option[displayDirection].replace('->', '→');

                        return (
                            <DropdownMenuRadioItem
                                key={key}
                                value={key}
                                onSelect={(e) => {
                                    if (isSelected) e.preventDefault();
                                    onSortChange(key);
                                }}
                                className="py-1 my-1 cursor-pointer data-[highlighted]:bg-accent group"
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <Text size="2" weight="medium" highContrast className="group-data-[highlighted]:!text-accent-foreground transition-colors">
                                        {labelText}
                                    </Text>
                                    <Text size="1" color="gray" className="group-data-[highlighted]:!text-accent-foreground/70 pt-0.5 transition-colors">
                                        {directionText}
                                    </Text>
                                </div>
                            </DropdownMenuRadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
