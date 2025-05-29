import React, { useState } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../src/config/firebaseConfig';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        width="100%"
        maxWidth={320}
      />
      
      <Input
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        width="100%"
        maxWidth={320}
      />
      
      {error ? <Text color="$red10">{error}</Text> : null}
      
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
