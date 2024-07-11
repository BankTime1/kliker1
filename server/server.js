const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public'))); // Предоставление статических файлов

const TELEGRAM_API_TOKEN = '7301096593:AAH9Jcvg6ucTK8txyMB1xiNlhuPa6SRw0GA';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

let coins = 0; // Переменная для хранения количества монет

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/clicker', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/webhook', (req, res) => {
  const message = req.body.message;

  console.log('Received message:', message);

  if (message && message.text) {
    handleMessage(message);
  }

  res.sendStatus(200);
});

function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    const clickerUrl = 'https://kliker1-1p1q.vercel.app/clicker'; // Замените на фактический URL вашей веб-страницы
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
