"use client";

import { Heading, Text } from "@radix-ui/themes";
import { Download, Upload } from "lucide-react";

interface DataManagementSectionProps {
    handleExport: () => void;
}

export function DataManagementSection({ handleExport }: DataManagementSectionProps) {
    return (
        <div className="mt-5 bg-card rounded-2xl border border-border p-6">
            <Heading size="4" weight="bold">Data Management</Heading>
            <Text as="p" size="2" color="gray" className="mt-0.5 mb-2">Manage and control your app data</Text>

            {/* Export */}
            <div className="flex justify-between items-center py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <Download className="h-4 w-4" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Export Data</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">Download all your data as JSON</Text>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors bg-transparent"
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>

            {/* Import */}
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                        <Upload className="h-4 w-4" />
                    </div>
                    <div>
                        <Text as="p" size="2" weight="medium">Import Data</Text>
                        <Text as="p" size="1" color="gray" className="mt-0.5">Restore data from a backup file</Text>
                    </div>
                </div>
                <button
                    onClick={() => alert("Import feature coming soon!")}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors bg-transparent"
                >
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">Import</span>
                </button>
            </div>
        </div>
    );
}
