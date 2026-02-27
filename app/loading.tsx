import { Flex, Spinner, Text } from "@radix-ui/themes";

export default function Loading() {
    return (
        <Flex
            align="center"
            justify="center"
            direction="column"
            gap="4"
            style={{ height: "100vh", width: "100%" }}
        >
            <Spinner size="3" />
            <Text color="gray" size="2" weight="medium" style={{ opacity: 0.8 }}>
                Loading Planova...
            </Text>
        </Flex>
    );
}
