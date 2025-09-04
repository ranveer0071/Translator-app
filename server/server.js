import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import historyRoutes from './routes/history.js';
import authRoutes from './routes/auth.js';



dotenv.config(); // ✅ Load env first

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;


console.log('📦 Loaded MONGODB_URI:', MONGODB_URI); // ✅ Add debug log

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Check .env file!');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/history', historyRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Backend is connected!' });
});

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
