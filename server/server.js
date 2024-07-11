const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const TELEGRAM_API_TOKEN = '7301096593:AAH9Jcvg6ucTK8txyMB1xiNlhuPa6SRw0GA';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}`;

app.post('/webhook', (req, res) => {
  const message = req.body.message;

  if (message && message.text) {
    handleMessage(message);
  }

  res.sendStatus(200);
});

function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === '/start') {
    sendMessage(chatId, 'Welcome to the Crypto Clicker!');
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
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
