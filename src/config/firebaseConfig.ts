import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIhLFazlQ-gJTGfeDkzqSyhInYzP0Pa7A",
  authDomain: "cashcalrn.firebaseapp.com",
  projectId: "cashcalrn",
  storageBucket: "cashcalrn.firebasestorage.app",
  messagingSenderId: "929250358075",
  appId: "1:929250358075:web:dbfa56d9089842f5f93d1e",
  measurementId: "G-DM9QXTR258"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth }; 