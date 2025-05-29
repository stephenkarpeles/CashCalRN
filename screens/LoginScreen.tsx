import React, { useState } from 'react';
import { YStack, Text, Input, Button, XStack } from 'tamagui';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation to main handled by auth state in App.tsx
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4" alignItems="center" justifyContent="center">
      <Text fontSize="$8" fontWeight="bold">Login</Text>
      
      <Input
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        width="100%"
        maxWidth={320}
      />
      
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        width="100%"
        maxWidth={320}
      />
      
      {error ? <Text color="$red10">{error}</Text> : null}
      
      <Button
        onPress={handleLogin}
        disabled={loading}
        theme="blue"
        width="100%"
        maxWidth={320}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      
      <Button
        onPress={() => navigation.navigate('Signup')}
        theme="gray"
        variant="outlined"
        width="100%"
        maxWidth={320}
      >
        Sign Up
      </Button>
    </YStack>
  );
}
