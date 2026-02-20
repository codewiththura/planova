
import Link from 'next/link';
import { TargetIcon } from '@radix-ui/react-icons';
import { Heading } from '@radix-ui/themes';

export function MobileHeader() {
    return (
        <div className="fixed top-0 left-0 right-0 z-40 bg-card border-b h-14 flex items-center px-6 py-2 md:hidden">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground rounded-lg p-1.5">
                    <TargetIcon className="h-4 w-4" />
                </div>
                <Heading size="3">Planova</Heading>
            </Link>
        </div>
    );
}
