import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  username: { type: String, required: true },
  inputText: { type: String, required: true },
  outputText: { type: String, required: true },
  sourceLang: { type: String, required: true },
  targetLang: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('History', historySchema);
