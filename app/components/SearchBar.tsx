import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Text } from '@radix-ui/themes';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/app/lib/utils';
import { ChangeEvent } from 'react';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className,
    containerClassName,
}: SearchBarProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={cn("flex items-center gap-2 w-full sm:w-auto", containerClassName)}>
            <div className="relative flex-1 sm:w-[280px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                {!value && (
                    <div className="absolute left-9 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Text size="2" color="gray">{placeholder}</Text>
                    </div>
                )}
                <Input
                    value={value}
                    onChange={handleChange}
                    className={cn("w-full pl-9 rounded-full h-10 bg-background", className)}
                />
            </div>
        </div>
    );
}
