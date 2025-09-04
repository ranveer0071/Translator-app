import React from 'react';
import './index.css';

const StatusBar = ({ user, setView }) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span>👤 {user}</span>
      </div>
      <div className="status-right">
        <button onClick={() => setView('home')}>🏠 Home</button>
        <button onClick={() => setView('settings')}>⚙️ Settings</button>
        <button onClick={() => setView('guide')}>📖 Guide</button>
      </div>
    </div>
  );
};

export default StatusBar;
