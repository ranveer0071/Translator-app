import React from 'react';
import './index.css';

const Guide = () => {
  return (
    <div className="guide-container">
      <h2>📖 User Guide</h2>

      <p>Welcome to the Multilingual Voice Translator Web App!</p>

      <ul>
        <li>🎤 <strong>Speak:</strong> Click "Speak" to convert your voice into text.</li>
        <li>💬 <strong>Type:</strong> Or type your message manually in the input box.</li>
        <li>🌐 <strong>Languages:</strong> Choose source (from) and target (to) languages.</li>
        <li>🔁 <strong>Swap:</strong> Use "🔁 Swap Languages" to reverse them instantly.</li>
        <li>🧠 <strong>Auto-Detect:</strong> Select "Auto-Detect" to guess the input language.</li>
        <li>🔈 <strong>Play:</strong> Hear the translated output aloud.</li>
        <li>🔊 <strong>Play Input:</strong> Hear your original input spoken.</li>
        <li>⬇️ <strong>Download:</strong> Save translated audio as an MP3 file.</li>
        <li>🎨 <strong>Settings:</strong> Toggle dark/light mode for better readability.</li>
        <li>🔐 <strong>Login:</strong> Create an account to personalize your experience.</li>
      </ul>

      <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
        Built with ❤️ by Ranveer Surendrapratap Singh (TYIT-C, Roll No. 202)
      </p>
    </div>
  );
};

export default Guide;
