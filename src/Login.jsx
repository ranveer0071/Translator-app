import React, { useState, useEffect } from 'react';
import './index.css';
import API_BASE_URL from './api'; // Make sure this exports your backend base URL

const Login = ({ onLogin }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Ask notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    const endpoint = isNewUser ? '/auth/signup' : '/auth/login';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      // Success
      onLogin(username);
      setError('');

      if (isNewUser) {
        // Play success sound
        const audio = new Audio('/success.mp3');
        audio.play();

        // Notification
        if (Notification.permission === 'granted') {
          new Notification('Account Created ✅', {
            body: `Welcome, ${username}! Your account was created successfully.`,
            icon: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
          });
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isNewUser ? '🆕 Create Account' : '🔐 Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isNewUser ? 'Create Account' : 'Login'}</button>
        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          {isNewUser ? 'Already have an account?' : 'New user?'}{' '}
          <span
            className="link"
            onClick={() => {
              setIsNewUser(!isNewUser);
              setError('');
            }}
          >
            {isNewUser ? 'Login' : 'Create one'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
