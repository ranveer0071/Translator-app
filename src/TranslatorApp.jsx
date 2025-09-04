import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Login from './Login';
import StatusBar from './StatusBar';
import Settings from './Settings';
import Guide from './Guide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// ✅ Language map
const languages = {
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Portuguese: 'pt',
  Russian: 'ru',
  Chinese: 'zh',
  Japanese: 'ja',
  Korean: 'ko',
  Arabic: 'ar',
  Turkish: 'tr',
  Dutch: 'nl',
  Hindi: 'hi',
  Gujarati: 'gu',
  Marathi: 'mr',
  Tamil: 'ta',
  Telugu: 'te',
  Kannada: 'kn',
  Malayalam: 'ml',
  Bengali: 'bn',
  Punjabi: 'pa',
  Urdu: 'ur',
};

// ✅ Flags
const getFlag = (lang) => {
  const flagMap = {
    English: '🇬🇧',
    Spanish: '🇪🇸',
    French: '🇫🇷',
    German: '🇩🇪',
    Italian: '🇮🇹',
    Portuguese: '🇵🇹',
    Russian: '🇷🇺',
    Chinese: '🇨🇳',
    Japanese: '🇯🇵',
    Korean: '🇰🇷',
    Arabic: '🇸🇦',
    Turkish: '🇹🇷',
    Dutch: '🇳🇱',
    Hindi: '🇮🇳',
    Gujarati: '🇮🇳',
    Marathi: '🇮🇳',
    Tamil: '🇮🇳',
    Telugu: '🇮🇳',
    Kannada: '🇮🇳',
    Malayalam: '🇮🇳',
    Bengali: '🇮🇳',
    Punjabi: '🇮🇳',
    Urdu: '🇵🇰',
  };
  return flagMap[lang] || '';
};

// ✅ Best voice helper
const waitForVoices = () =>
  new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) resolve(voices);
    else window.speechSynthesis.onvoiceschanged = () =>
      resolve(window.speechSynthesis.getVoices());
  });

const TranslatorApp = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Hindi');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  async function detectLanguage(text) {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
      const data = await response.json();
      return data?.detectedLanguage?.code || 'en';
    } catch (error) {
      console.error("Language detection failed:", error);
      return 'en';
    }
  }



  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) setUser(storedUser);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/history/${user}`)
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error('Failed to fetch history:', err));
    }
  }, [user]);


  const handleTranslate = async (customText) => {
    const text = customText || inputText;
    if (!text.trim()) return toast.warning('Please enter some text to translate.');

    try {
      const detectedCode = await detectLanguage(text);
      const detectedLangName = Object.keys(languages).find(
        key => languages[key] === detectedCode
      ) || fromLang;

      setFromLang(detectedLangName);
      toast.info(`Detected language: ${detectedLangName}`);

      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `${detectedCode}|${languages[toLang]}`,
        },
      });

      const translated = response.data.responseData.translatedText;
      setOutputText(translated);

      const newEntry = {
        username: user,
        inputText: text,
        outputText: translated,
        sourceLang: detectedLangName,
        targetLang: toLang,
        timestamp: new Date().toISOString(),
      };

      await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      setHistory(prev => [newEntry, ...prev]);
      toast.success('Translation saved!');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Try again.');
    }
  };

  const transcribeAudioFile = async (file) => {
    const apiKey = 'apikey here'; // Replace

    try {
      const uploadRes = await axios({
        method: 'POST',
        url: 'https://api.assemblyai.com/v2/upload',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/octet-stream',
        },
        data: file,
      });

      const audioUrl = uploadRes.data.upload_url;

      const transcriptRes = await axios({
        method: 'POST',
        url: 'https://api.assemblyai.com/v2/transcript',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        data: { audio_url: audioUrl },
      });

      const transcriptId = transcriptRes.data.id;
      toast.info('Transcribing audio...');

      let transcriptData;
      while (true) {
        const polling = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { authorization: apiKey },
        });

        transcriptData = polling.data;
        if (transcriptData.status === 'completed') break;
        if (transcriptData.status === 'error') throw new Error(transcriptData.error);

        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      setInputText(transcriptData.text);
      toast.success('Audio transcribed!');
      await handleTranslate(transcriptData.text);
    } catch (err) {
      console.error('Transcription failed:', err);
      toast.error('Failed to transcribe audio.');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Selected file: ${file.name}`);
      await transcribeAudioFile(file);
    }
  };

  const handleSpeech = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US'; // generic base language for recognition
    recognition.start();

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setInputText(speechText);

      const detectedCode = await detectLanguage(speechText);
      const detectedLangName = Object.keys(languages).find(
        key => languages[key] === detectedCode
      ) || fromLang;

      setFromLang(detectedLangName);
      toast.info(`Detected spoken language: ${detectedLangName}`);

      setTimeout(() => handleTranslate(speechText), 500);
    };

    recognition.onerror = (event) => {
      toast.error(`Speech error: ${event.error}`);
    };
  };


  const handleSpeakOutput = async () => {
    if (!outputText) return;
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = languages[toLang];

    const voices = await waitForVoices();
    const match = voices.find(v => v.lang.toLowerCase().startsWith(languages[toLang]));
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakInput = async () => {
    if (!inputText) return;
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = languages[fromLang];

    const voices = await waitForVoices();
    const match = voices.find(v => v.lang.toLowerCase().startsWith(languages[fromLang]));
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
  };

  const downloadAudio = async () => {
    if (!outputText) return toast.warning('No output to download.');
    const apiKey = 'your api key here'; // Replace

    try {
      const response = await fetch(
        `https://api.voicerss.org/?key=${apiKey}&hl=${languages[toLang]}&src=${encodeURIComponent(outputText)}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translation.mp3';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Audio downloaded!');
    } catch (error) {
      toast.error('Failed to download audio.');
    }
  };

  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  if (!user) {
    return <Login onLogin={(username) => {
      setUser(username);
      localStorage.setItem('user', username);
    }} />;
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <ToastContainer position="top-right" autoClose={3000} />
      <StatusBar user={user} setView={setView} />

      {view === 'home' && (
        <section className="hero">
          <div className="hero-banner">
            <img src="/assets/images/hero-bg.png" alt="Voice Translator Banner" />
          </div>

          <section className="hero-top">
            <h1>Online Audio Translator</h1>
            <p>Automatically translate subtitles or voice in your audio</p>
            <label className="upload-button">
              🎧 Choose File
              <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </section>

          <section className="how-to-section">
            <h2>How to Translate Audio</h2>
            <div className="steps">
              <div><strong>1️⃣</strong><p>Upload your audio file</p></div>
              <div><strong>2️⃣</strong><p>Transcribe & Translate</p></div>
              <div><strong>3️⃣</strong><p>Download Result</p></div>
            </div>
          </section>

          <div className="language-selectors">
            <label>From</label>
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
              {Object.keys(languages).map(lang => (
                <option key={lang} value={lang}>{getFlag(lang)} {lang}</option>
              ))}
            </select>

            <label>To</label>
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}>
              {Object.keys(languages).map(lang => (
                <option key={lang} value={lang}>{getFlag(lang)} {lang}</option>
              ))}
            </select>
          </div>

          <div className="text-section">
            <label>Enter Text</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak..."
            />

            <label>Output</label>
            <input
              type="text"
              value={outputText}
              readOnly
              className="output-field"
            />
          </div>

          <div className="button-group">
            <button className="translate" onClick={() => handleTranslate()}>Translate</button>
            <button className="speak" onClick={handleSpeech}>🎤 Speak</button>
            <button className="speak" onClick={handleSpeakOutput}>🔈 Play Output</button>
            <button className="speak" onClick={handleSpeakInput}>🔊 Play Input</button>
            <button className="swap-btn" onClick={handleSwapLanguages}>🔁 Swap</button>
            <button className="toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
            <button className="download" onClick={downloadAudio}>⬇️ Download Audio</button>
            <button className="translate" onClick={() => navigate('/share')}>🔗 Share Translation</button>
          </div>
        </section>
      )}

      {view === 'settings' && (
        <Settings
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={() => {
            setUser(null);
            setView('home');
            setHistory([]);
            localStorage.removeItem('user');
            toast.info('Logged out successfully.');
          }}
        />
      )}

      {view === 'guide' && <Guide />}
    </div>
  );
};

export default TranslatorApp;
