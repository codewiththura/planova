'use client'

import Link from 'next/link'
import { continueWithGoogle, loginWithEmail } from '@/app/actions/auth'
import { Chrome } from 'lucide-react'
import {
    Heading,
    Text,
    TextField,
    Link as RadixLink,
    Button,
    Flex,
    Box,
} from '@radix-ui/themes'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md rounded-2xl bg-card p-10 shadow-2xl ring-1 ring-border/50">
                <div className="text-center mb-8">
                    <Heading size="7" weight="bold" highContrast className="text-center">
                        Welcome back
                    </Heading>
                    <Text as="p" size="2" color="gray" className="text-center">
                        Sign in to your Planova account
                    </Text>
                </div>

                <form action={loginWithEmail}>
                    <Flex direction="column" gap="6">
                        <Flex direction="column" gap="2">
                            <Text as="label" size="2" weight="medium" highContrast htmlFor="email">
                                Email
                            </Text>
                            <TextField.Root
                                id="email"
                                name="email"
                                type="email"
                                size="3"
                                placeholder="m@example.com"
                                required
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Flex justify="between" align="center">
                                <Text as="label" size="2" weight="medium" highContrast htmlFor="password">
                                    Password
                                </Text>
                                <RadixLink asChild size="2" weight="medium" color="violet">
                                    <Link href="#">Forgot password?</Link>
                                </RadixLink>
                            </Flex>
                            <TextField.Root
                                id="password"
                                name="password"
                                type="password"
                                size="3"
                                required
                            />
                        </Flex>

                        <Button size="3" variant="solid" color="violet" style={{ width: '100%' }} className="cursor-pointer">
                            Sign In
                        </Button>
                    </Flex>
                </form>

                <div className="flex items-center my-5">
                    <div className="flex-grow border-t border-border"></div>
                    <Text size="1" weight="medium" className="uppercase tracking-wider px-2 text-muted-foreground">
                        Or continue with
                    </Text>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <form>
                    <Button
                        size="3"
                        variant="surface"
                        color="gray"
                        style={{ width: '100%' }}
                        className="cursor-pointer"
                        formAction={() => continueWithGoogle('login')}
                        type="submit"
                    >
                        <Chrome width="16" height="16" />
                        Continue with Google
                    </Button>
                </form>

                <div className="text-center mt-4">
                    <Text size="2" color="gray" className="text-center">
                        Don&apos;t have an account?{' '}
                        <RadixLink asChild color="violet" weight="medium">
                            <Link href="/signup">Sign up</Link>
                        </RadixLink>
                    </Text>
                </div>
            </div>
        </div>
    )
}
