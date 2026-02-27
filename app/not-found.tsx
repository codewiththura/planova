import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export default function NotFound() {
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
                    background: "var(--accent)",
                    color: "var(--primary)",
                }}
            >
                <QuestionMarkCircledIcon width="32" height="32" />
            </Flex>

            <Flex direction="column" align="center" gap="2" style={{ textAlign: "center" }}>
                <Heading size="8" weight="bold" style={{ letterSpacing: "-0.02em" }}>
                    404 - Not Found
                </Heading>
                <Text color="gray" size="3" style={{ maxWidth: "400px" }}>
                    The page you are looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </Text>
            </Flex>

            <Button size="3" variant="soft" highContrast asChild style={{ cursor: "pointer" }}>
                <Link href="/">
                    Return to Dashboard
                </Link>
            </Button>
        </Flex>
    );
}
