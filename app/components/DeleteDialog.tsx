import React, { useState } from 'react';
import { AlertDialog, Button, Flex, Text, Theme } from '@radix-ui/themes';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    itemName: string | null | undefined;
    description: string;
    onDelete: () => void;
}

export function DeleteDialog({
    open,
    onOpenChange,
    title,
    itemName,
    description,
    onDelete,
}: DeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        onDelete();
        setIsDeleting(false);
        onOpenChange(false);
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content maxWidth="400px" className="p-0 overflow-hidden sm:rounded-[var(--radius-4)]">
                <Theme appearance="inherit" accentColor="violet" scaling="90%" radius="large" hasBackground={false} style={{ display: 'contents' }}>
                    <style>
                        {`
                          .rt-Button {
                            border-radius: var(--radius-4) !important;
                          }
                        `}
                    </style>
                    <div className="p-2">
                        <AlertDialog.Title size="4" weight="medium" highContrast>
                            {title}
                        </AlertDialog.Title>

                        <Flex direction="column" gap="4" mt="2" mb="4">
                            <AlertDialog.Description size="2" color="gray">
                                Are you sure you want to delete <Text weight="bold" highContrast>"{itemName}"</Text>?
                            </AlertDialog.Description>
                            <Text as="p" size="2" color="gray">
                                {description}
                            </Text>
                        </Flex>

                        <Flex gap="3" justify="end" mt="2">
                            <AlertDialog.Cancel>
                                <Button
                                    size="2"
                                    variant="soft"
                                    color="gray"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button
                                    size="2"
                                    variant="solid"
                                    color="red"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    Delete
                                </Button>
                            </AlertDialog.Action>
                        </Flex>
                    </div>
                </Theme>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
