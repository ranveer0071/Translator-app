import express from 'express';
import History from '../models/History.js';

const router = express.Router();

// Save translation
router.post('/', async (req, res) => {
  try {
    const history = new History(req.body);
    await history.save();
    res.status(201).json({ message: 'Translation history saved!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving history' });
  }
});

// Get translation history by username
router.get('/:username', async (req, res) => {
  try {
    const histories = await History.find({ username: req.params.username }).sort({ timestamp: -1 });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

export default router;
