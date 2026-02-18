import Link from 'next/link';
import { TargetIcon } from '@radix-ui/react-icons';
import { Heading, Text } from '@radix-ui/themes';

export function Navbar() {
    return (
        <header className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="bg-primary text-primary-foreground rounded-lg p-2">
                            <TargetIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <Heading size="3">Planova</Heading>
                            <Text size="1" color="gray">Turn plans into actions</Text>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
