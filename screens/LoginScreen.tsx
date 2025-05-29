import React, { useState } from 'react';
import { YStack, Text, Input, Button, XStack, Spacer } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      
      <XStack width="100%" maxWidth={320} alignItems="center" position="relative">
        <Input
          flex={1}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          chromeless
          onPress={() => setShowPassword((v) => !v)}
          size="$2"
          circular
          position="absolute"
          right={8}
          zIndex={1}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </XStack>
      
      {error ? <Text color="$red10">{error}</Text> : null}
      
      <Spacer size="$4" />
      
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
