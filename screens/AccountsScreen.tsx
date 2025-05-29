import React, { useState, useCallback } from 'react';
import { YStack, Text, Button, XStack, Dialog } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { usePlaidLink } from 'react-native-plaid-link-sdk';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

export default function AccountsScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const onSuccess = useCallback(async (public_token: string) => {
    if (!user) return;
    // Exchange public_token for access_token and fetch accounts from backend
    const res = await fetch('http://localhost:5001/api/exchange_public_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token, uid: user.uid }),
    });
    if (!res.ok) return;
    // Now fetch accounts
    const accountsRes = await fetch('http://localhost:5001/api/get_accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid }),
    });
    const accounts = await accountsRes.json();
    // Store each account in Firestore under users/{uid}/accounts/{accountId}
    for (const account of accounts) {
      await setDoc(doc(collection(db, 'users', user.uid, 'accounts'), account.account_id), account);
    }
  }, [user, db]);

  const { open, ready } = usePlaidLink({
    tokenConfig: {
      token: 'link-sandbox-...', // TODO: Replace with a generated link token from your backend
      noLoadingState: false,
    },
    onSuccess: (public_token) => {
      setShowDialog(false);
      onSuccess(public_token);
    },
    onExit: () => setShowDialog(false),
  });

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
                  if (ready) open();
                }}
                disabled={!ready}
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
