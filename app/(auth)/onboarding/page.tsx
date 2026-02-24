'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Heading,
    Text,
    TextField,
    Button,
    Flex,
} from '@radix-ui/themes'

function OnboardingForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isWelcome = searchParams.get('welcome') === 'true'

    return (
        <div className="w-full max-w-md rounded-2xl bg-card p-10 shadow-2xl ring-1 ring-border/50">
            <div className="text-center mb-8">
                <Heading size="7" weight="bold" highContrast className="text-center">
                    {isWelcome ? "Welcome!" : "Set up your profile"}
                </Heading>
                <Text as="p" size="2" color="gray" className="text-center mt-2">
                    {isWelcome
                        ? "Let's set up your profile so you aren't confused by an empty dashboard."
                        : "Complete your profile to get the most out of Planova."}
                </Text>
            </div>

            <form action={() => router.push('/')}>
                <Flex direction="column" gap="6">
                    <Flex direction="column" gap="2">
                        <Text as="label" size="2" weight="medium" highContrast htmlFor="orgName">
                            Workspace Name
                        </Text>
                        <TextField.Root
                            id="orgName"
                            name="orgName"
                            type="text"
                            size="3"
                            placeholder="My Workspace"
                            required
                        />
                    </Flex>
                    <Flex direction="column" gap="2">
                        <Text as="label" size="2" weight="medium" highContrast htmlFor="role">
                            Your Role
                        </Text>
                        <TextField.Root
                            id="role"
                            name="role"
                            type="text"
                            size="3"
                            placeholder="e.g. Designer, Developer, Manager"
                        />
                    </Flex>

                    <Button size="3" variant="solid" color="violet" style={{ width: '100%' }} className="cursor-pointer mt-2" type="submit">
                        Go to Dashboard
                    </Button>
                </Flex>
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
