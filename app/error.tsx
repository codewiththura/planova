'use client';

import { useEffect } from 'react';
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Flex
            align="center"
            justify="center"
            direction="column"
            gap="5"
            style={{ height: "100vh", width: "100%", padding: "20px" }}
        >
            <Flex
                align="center"
                justify="center"
                style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--destructive)",
                    color: "white",
                }}
            >
                <ExclamationTriangleIcon width="32" height="32" />
            </Flex>

            <Flex direction="column" align="center" gap="2" style={{ textAlign: "center" }}>
                <Heading size="8" weight="bold" style={{ letterSpacing: "-0.02em" }}>
                    Something went wrong
                </Heading>
                <Text color="gray" size="3" style={{ maxWidth: "400px" }}>
                    We encountered an unexpected error. Don&apos;t worry, your data is safe.
                    Try refreshing or returning to the dashboard.
                </Text>
            </Flex>

            <Flex gap="3">
                <Button
                    size="3"
                    variant="soft"
                    color="gray"
                    highContrast
                    onClick={() => window.location.href = '/'}
                    style={{ cursor: "pointer" }}
                >
                    Go Home
                </Button>
                <Button
                    size="3"
                    variant="solid"
                    onClick={() => reset()}
                    style={{ cursor: "pointer" }}
                >
                    <ReloadIcon />
                    Try Again
                </Button>
            </Flex>
        </Flex>
    );
}
