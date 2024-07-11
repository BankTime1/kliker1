const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from the root directory

const TELEGRAM_API_TOKEN = 'YOUR_TELEGRAM_API_TOKEN';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

let coins = 0; // Variable to store the number of coins

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html')); // Serve the clicker interface
});

app.post('/webhook', (req, res) => {
  const message = req.body.message;

  console.log('Received message:', message);

  res.sendStatus(200);

  if (message && message.text) {
    handleMessage(message);
  }
});

function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    const clickerUrl = 'https://kliker1-1p1q.vercel.app/'; // Replace with the actual URL of your web page
    sendMessage(chatId, `Welcome to the Crypto Clicker! Click the link below to start earning coins:\n${clickerUrl}`);
  } else if (text === '/getcoins') {
    sendMessage(chatId, `You have ${coins} coins.`);
  } else {
    sendMessage(chatId, `You said: ${text}`);
  }
}

function sendMessage(chatId, text) {
  fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Message sent:', data);
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
