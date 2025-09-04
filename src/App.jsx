import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TranslatorApp from './TranslatorApp';
import SharePage from './SharePage'; // ✅ correct


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<TranslatorApp />} />
      <Route path="/share" element={<SharePage />} />
    </Routes>
  );
};

export default App;
