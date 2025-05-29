import React, { useState } from 'react';
import { YStack, Text, Input, Button, XStack, Spacer } from 'tamagui';
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../src/config/firebaseConfig';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: email,
        createdAt: new Date().toISOString(),
      });
      // Navigation to main handled by auth state in App.tsx
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4" alignItems="center" justifyContent="center">
      <Text fontSize="$8" fontWeight="bold">Sign Up</Text>
      
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
      
      <XStack width="100%" maxWidth={320} alignItems="center" position="relative">
        <Input
          flex={1}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Button
          chromeless
          onPress={() => setShowConfirmPassword((v) => !v)}
          size="$2"
          circular
          position="absolute"
          right={8}
          zIndex={1}
          tabIndex={-1}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </XStack>
      
      {error ? <Text color="$red10">{error}</Text> : null}
      
      <Spacer size="$4" />
      
      <Button
        onPress={handleSignup}
        disabled={loading}
        theme="blue"
        width="100%"
        maxWidth={320}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
      
      <Button
        onPress={() => navigation.navigate('Login')}
        theme="gray"
        variant="outlined"
        width="100%"
        maxWidth={320}
      >
        Back to Login
      </Button>
    </YStack>
  );
}
