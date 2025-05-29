import React, { useState } from 'react';
import { YStack, Text, Button, XStack, Dialog, Checkbox, Label, ScrollView } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Plaid account type (partial, for demo)
type PlaidAccount = {
  account_id: string;
  name: string;
  subtype: string;
  mask: string;
};

export default function AccountsScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const [accountsToSelect, setAccountsToSelect] = useState<PlaidAccount[]>([]); // Accounts returned from Plaid
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, boolean>>({}); // {account_id: true/false}
  const [showSelectModal, setShowSelectModal] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  // Mock Plaid flow for testing
  const handleMockPlaid = async () => {
    setShowDialog(false);
    if (!user) return;
    const publicToken = 'test-public-token';
    // Exchange public_token for access_token and fetch accounts from backend
    const res = await fetch('http://localhost:5001/api/exchange_public_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token: publicToken, uid: user.uid }),
    });
    if (!res.ok) return;
    // Now fetch accounts
    const accountsRes = await fetch('http://localhost:5001/api/get_accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid }),
    });
    const accounts: PlaidAccount[] = await accountsRes.json();
    setAccountsToSelect(accounts);
    setSelectedAccounts(accounts.reduce((acc: Record<string, boolean>, a: PlaidAccount) => ({ ...acc, [a.account_id]: false }), {}));
    setShowSelectModal(true);
  };

  const handleAddSelectedAccounts = async () => {
    if (!user) return;
    for (const account of accountsToSelect) {
      if (selectedAccounts[account.account_id]) {
        await setDoc(doc(collection(db, 'users', user.uid, 'accounts'), account.account_id), account);
      }
    }
    setShowSelectModal(false);
  };

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
                onPress={handleMockPlaid}
              >
                Connect to Plaid (Mock)
              </Button>
              <Dialog.Close asChild>
                <Button theme="gray" variant="outlined">Cancel</Button>
              </Dialog.Close>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      {/* Account selection modal */}
      <Dialog open={showSelectModal} onOpenChange={setShowSelectModal}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay2" />
          <Dialog.Content bordered elevate key="content2" width={340}>
            <YStack space="$4" alignItems="center">
              <Dialog.Title>Select Accounts to Add</Dialog.Title>
              <ScrollView height={200} width={300}>
                {accountsToSelect.map((account) => (
                  <XStack key={account.account_id} alignItems="center" space="$2" marginBottom="$2">
                    <Checkbox
                      checked={selectedAccounts[account.account_id]}
                      onCheckedChange={(checked) => setSelectedAccounts((prev) => ({ ...prev, [account.account_id]: checked as boolean }))}
                    />
                    <Label>{account.name} ({account.subtype}) - {account.mask}</Label>
                  </XStack>
                ))}
              </ScrollView>
              <Button theme="blue" onPress={handleAddSelectedAccounts}>
                Add Selected Accounts
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
