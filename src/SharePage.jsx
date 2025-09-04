import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SharePage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('user');

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    fetch(`http://localhost:5000/api/history/${username}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => setHistory([]));
  }, [username, navigate]);

  const handleDownload = async (text, lang) => {
    const apiKey = '65c820ebae9c4a0cb96e662078b32bc0';
    const response = await fetch(
      `https://api.voicerss.org/?key=${apiKey}&hl=${lang}&src=${encodeURIComponent(text)}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.mp3';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyLink = (entry) => {
    const url = `${window.location.origin}/share?input=${encodeURIComponent(entry.inputText)}&output=${encodeURIComponent(entry.outputText)}&from=${entry.sourceLang}&to=${entry.targetLang}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied!');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: 'auto', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 Your Translation History</h2>

      {history.length === 0 ? (
        <p style={{ color: '#666' }}>No history available.</p>
      ) : (
        history.map((entry, i) => (
          <div key={i} style={{
            marginBottom: '20px',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            background: '#f9f9f9',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
          }}>
            <p><strong>{entry.sourceLang} ➡ {entry.targetLang}</strong></p>
            <p style={{ margin: '8px 0' }}><em>{entry.inputText}</em> → <strong>{entry.outputText}</strong></p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => handleDownload(entry.outputText, entry.targetLang)} style={{
                padding: '10px 16px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>⬇️ Download Audio</button>
              <button onClick={() => handleCopyLink(entry)} style={{
                padding: '10px 16px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>🔗 Copy Share Link</button>
            </div>
          </div>
        ))
      )}


      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 18px',
          backgroundColor: '#3291ff',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        ⬅ Back to Translator
      </button>

    </div>
  );
};

export default SharePage;