import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGfvfo_9Kwcdpyv3JZuBXdl3ZZzCDb-30",
  authDomain: "neighborhood-9e56c.firebaseapp.com",
  projectId: "neighborhood-9e56c",
  storageBucket: "neighborhood-9e56c.appspot.com",
  messagingSenderId: "639860440716",
  appId: "1:639860440716:web:36163b81735364f6ab05a9",
  measurementId: "G-CD72L0TRK1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
