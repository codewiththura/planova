'use client'

import Link from 'next/link'

import { Chrome } from 'lucide-react'
import {
    Heading,
    Text,
    TextField,
    Link as RadixLink,
    Button,
    Flex,
    Box,
    Callout,
} from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, } from 'firebase/auth'
import { auth } from '@/app/lib/firebase'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg('')

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()
            document.cookie = `session=${token}; path=/; max-age=604800; SameSite=Lax`
            router.push('/')
        } catch (error: any) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setErrorMsg('Invalid email or password.')
            } else {
                setErrorMsg('An error occurred during login.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        setErrorMsg('')
        try {
            const provider = new GoogleAuthProvider()
            const userCredential = await signInWithPopup(auth, provider)
            const token = await userCredential.user.getIdToken()
            document.cookie = `session=${token}; path=/; max-age=604800; SameSite=Lax`
            router.push('/')
        } catch (error: any) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                setErrorMsg('An account already exists with this email. Please sign in using your existing provider.')
            } else {
                setErrorMsg('An error occurred during Google sign in.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md rounded-2xl bg-card p-10 shadow-2xl ring-1 ring-border/50">
                <div className="text-center mb-6">
                    <Heading size="7" weight="bold" highContrast className="text-center">
                        Welcome back
                    </Heading>
                    <Text as="p" size="2" color="gray" className="text-center mt-2">
                        Sign in to your Planova account
                    </Text>
                </div>

                {errorMsg && (
                    <Callout.Root color="red" className="mb-6">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{errorMsg}</Callout.Text>
                    </Callout.Root>
                )}

                <form onSubmit={handleEmailLogin}>
                    <Flex direction="column" gap="5">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </Flex>

                        <Button size="3" variant="solid" color="violet" style={{ width: '100%' }} className="cursor-pointer" type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
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

                <div>
                    <Button
                        size="3"
                        variant="surface"
                        color="gray"
                        style={{ width: '100%' }}
                        className="cursor-pointer"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <Chrome width="16" height="16" />
                        Continue with Google
                    </Button>
                </div>

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
