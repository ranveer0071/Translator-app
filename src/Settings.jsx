import React from 'react';
import './index.css';

const Settings = ({ darkMode, setDarkMode, onLogout }) => {
  return (
    <div className="settings-container">
      <h2 style={{ marginBottom: '20px' }}>⚙️ Settings</h2>

      <label style={{ display: 'block', margin: '10px 0' }}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          style={{ marginRight: '8px' }}
        />
        Dark Mode: {darkMode ? 'ON 🌙' : 'OFF 🌞'}
      </label>

      <button
        onClick={onLogout}
        className="logout-btn"
        style={{
          marginTop: '20px',
          padding: '10px 16px',
          backgroundColor: '#ea5455',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Settings;
