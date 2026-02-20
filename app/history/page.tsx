import { Heading, Text, Flex, Box } from '@radix-ui/themes';

export default function HistoryPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <Heading size="8" mb="6">History</Heading>
            <Flex direction="column" gap="4">
                <Box className="border rounded-lg p-6 bg-muted/20">
                    <Heading size="5" mb="2">Past Plans</Heading>
                    <Text size="2" color="gray">
                        View your completed and archived plans here. This feature is coming soon!
                    </Text>
                </Box>
            </Flex>
        </div>
    );
}
