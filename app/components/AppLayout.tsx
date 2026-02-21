"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/app/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                isCollapsed ? "md:ml-20" : "md:ml-56"
            )}>
                <TopNavbar />
                <main className="flex-1 w-full pt-5 pb-24 md:pb-10">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
