import React, { useState } from 'react';
import { YStack, Text, Button, XStack, Dialog } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';

export default function AccountsScreen() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <YStack flex={1}>
      <XStack justifyContent="flex-end" padding="$4">
        <Button
          circular
          size="$4"
          icon={<Plus size={24} />}
          onPress={() => setShowDialog(true)}
        />
      </XStack>
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Text fontSize="$7" fontWeight="bold">Accounts</Text>
        {/* List of accounts will go here */}
      </YStack>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" />
          <Dialog.Content bordered elevate key="content" width={300}>
            <YStack space="$4" alignItems="center">
              <Dialog.Title>Add Account</Dialog.Title>
              <Button
                theme="blue"
                size="$4"
                onPress={() => {
                  // TODO: Launch Plaid Link here
                  setShowDialog(false);
                }}
              >
                Connect to Plaid
              </Button>
              <Dialog.Close asChild>
                <Button theme="gray" variant="outlined">Cancel</Button>
              </Dialog.Close>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  );
}
