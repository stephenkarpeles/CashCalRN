import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import config from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import AccountsScreen from './screens/AccountsScreen';
import BudgetScreen from './screens/BudgetScreen';
import CalendarScreen from './screens/CalendarScreen';
import CashflowScreen from './screens/CashflowScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './src/config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';
          if (route.name === 'Accounts') iconName = 'wallet-outline';
          else if (route.name === 'Budget') iconName = 'pie-chart-outline';
          else if (route.name === 'Calendar') iconName = 'calendar-outline';
          else if (route.name === 'Cashflow') iconName = 'trending-up-outline';
          else if (route.name === 'Transactions') iconName = 'list-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Cashflow" component={CashflowScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthInitialized) {
    return null; // Or a loading screen
  }

  return (
    <TamaguiProvider config={config}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}
