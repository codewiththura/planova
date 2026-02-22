'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'

function OnboardingForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isWelcome = searchParams.get('welcome') === 'true'

    return (
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-10 shadow-2xl ring-1 ring-border/50">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {isWelcome ? "Welcome!" : "Set up your profile"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {isWelcome
                        ? "Let's set up your profile so you aren't confused by an empty dashboard."
                        : "Complete your profile to get the most out of Planova."}
                </p>
            </div>

            <form className="space-y-6" action={() => router.push('/')}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="orgName">Workspace Name</Label>
                        <Input
                            id="orgName"
                            name="orgName"
                            type="text"
                            placeholder="My Workspace"
                            required
                            className="h-12 bg-background/50 focus-visible:ring-violet-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Your Role</Label>
                        <Input
                            id="role"
                            name="role"
                            type="text"
                            placeholder="e.g. Designer, Developer, Manager"
                            className="h-12 bg-background/50 focus-visible:ring-violet-500"
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full h-12 text-md font-medium bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
                    Go to Dashboard
                </Button>
            </form>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <OnboardingForm />
            </Suspense>
        </div>
    )
}
