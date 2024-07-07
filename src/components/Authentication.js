import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Ensure this path is correct for your project
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

function Authentication({ onAuthStateChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      onAuthStateChange(user);
    });
    return unsubscribe;
  }, [onAuthStateChange]);

  const signUp = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const logIn = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="authentication">
      {user ? (
        <div className="user-info">
          <h2>Welcome, {user.email}</h2>
          <button onClick={logOut}>Log Out</button>
        </div>
      ) : (
        <div>
          <h2>Please log in or sign up</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={logIn}>Log In</button>
          <button onClick={signUp}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default Authentication;
