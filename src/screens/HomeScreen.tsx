import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { auth } from '../config/firebaseConfig';

export default function HomeScreen() {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Text fontSize="$6" fontWeight="bold">Welcome to CashCal</Text>
      <Text fontSize="$4">Your personal finance companion</Text>
      <Button onPress={handleSignOut} theme="red">
        Sign Out
      </Button>
    </YStack>
  );
} 