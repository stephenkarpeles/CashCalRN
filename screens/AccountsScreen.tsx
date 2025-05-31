import React, { useState, useEffect } from 'react';
import { YStack, Text, Button, XStack, Dialog, Checkbox, Label, ScrollView, Card } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Linking } from 'react-native';

// Plaid account type (partial, for demo)
type PlaidAccount = {
  account_id: string;
  name: string;
  subtype: string;
  mask: string;
  balances?: { available?: number; current?: number; iso_currency_code?: string };
};

export default function AccountsScreen() {
  const [showDialog, setShowDialog] = useState(false);
  const [accountsToSelect, setAccountsToSelect] = useState<PlaidAccount[]>([]); // Accounts returned from Plaid
  const [selectedAccounts, setSelectedAccounts] = useState<Record<string, boolean>>({}); // {account_id: true/false}
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState<PlaidAccount[]>([]); // Accounts from Firestore
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const [loadingPlaid, setLoadingPlaid] = useState(false);

  // Listen to Firestore for user's accounts
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'accounts'), (snap) => {
      const accounts: PlaidAccount[] = [];
      snap.forEach((doc) => accounts.push(doc.data() as PlaidAccount));
      setUserAccounts(accounts);
    });
    return () => unsub();
  }, [user, db]);

  // Real Plaid Link flow
  const handlePlaidLink = async () => {
    setShowDialog(false);
    if (!user) {
      console.log('No user found');
      return;
    }
    setLoadingPlaid(true);
    try {
      const res = await fetch('http://192.168.4.93:5001/api/create_link_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid }),
      });
      const { link_token } = await res.json();
      if (!link_token) {
        console.log('No link_token received');
        setLoadingPlaid(false);
        return;
      }
      // Open Plaid Link in the browser
      Linking.openURL(`https://cdn.plaid.com/link/v2/stable/link.html?token=${link_token}`);
    } catch (e) {
      console.log('Error getting Plaid link token', e);
    } finally {
      setLoadingPlaid(false);
    }
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
      <YStack flex={1} alignItems="center" justifyContent="flex-start" paddingTop="$2" space="$3">
        <Text fontSize="$7" fontWeight="bold">Accounts</Text>
        {userAccounts.length === 0 && <Text color="$gray10">No accounts connected yet.</Text>}
        {userAccounts.map((account) => (
          <Card key={account.account_id} bordered elevate width={320} padding="$3" marginBottom="$2">
            <YStack>
              <Text fontSize="$6" fontWeight="bold">{account.name}</Text>
              <Text color="$gray10">{account.subtype} ••••{account.mask}</Text>
              <Text fontSize="$5" color="$green10" marginTop="$2">
                Balance: {account.balances?.current != null ? `$${account.balances.current.toFixed(2)}` : 'N/A'}
              </Text>
            </YStack>
          </Card>
        ))}
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
                onPress={handlePlaidLink}
                disabled={loadingPlaid}
              >
                {loadingPlaid ? 'Loading...' : 'Connect to Plaid'}
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