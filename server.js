const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Mesaj şeması
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Kök endpoint
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Mesaj gönderme endpoint’i
app.post('/send-message', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(200).json({ message: 'Mesaj kaydedildi' });
  } catch (err) {
    console.error('Error in /send-message:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mesajları alma endpoint’i
app.get('/messages', async (req, res) => {
  try {
    console.log('GET /messages endpoint called');
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    console.error('Error in /messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Port ayarı
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
