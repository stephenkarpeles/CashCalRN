import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }; 