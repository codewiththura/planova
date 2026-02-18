import Link from 'next/link';
import { TargetIcon } from '@radix-ui/react-icons';

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
                            <h1 className="font-semibold text-lg">Planova</h1>
                            <p className="text-xs text-muted-foreground">Turn plans into actions</p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
