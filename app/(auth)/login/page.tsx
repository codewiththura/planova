'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { continueWithGoogle, loginWithEmail } from '@/app/actions/auth'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-10 shadow-2xl ring-1 ring-border/50">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to your Planova account</p>
                </div>

                <form action={loginWithEmail} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="h-12 bg-background/50 focus-visible:ring-violet-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-sm font-medium text-violet-500 hover:text-violet-400 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="h-12 bg-background/50 focus-visible:ring-violet-500"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-md font-medium bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
                        Sign In
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <form>
                    <Button
                        type="submit"
                        formAction={() => continueWithGoogle('login')}
                        variant="outline"
                        className="w-full h-12 text-md font-medium border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        <Chrome className="mr-2 h-5 w-5" />
                        Continue with Google
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-violet-500 hover:text-violet-400 hover:underline transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
