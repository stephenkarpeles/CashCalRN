import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { auth } from '../src/config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await auth.signOut();
    // Navigation is handled by auth state in App.tsx
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
      <Text fontSize="$7" fontWeight="bold">Settings</Text>
      <Button theme="red" size="$4" onPress={handleLogout}>
        Log Out
      </Button>
    </YStack>
  );
} 