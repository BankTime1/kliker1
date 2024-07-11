const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;
const distributionDataFile = './secure_data/distributionData.json';
const usersFile = './secure_data/users.json';
const TIME_DECIMALS = 9;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let distributionData = {
  firstClickTimestamp: null,
  totalDistributedClicks: 0,
  totalDistributedAutoclickers: 0,
  dailyDistributed: 0,
  dailyAutoclickersDistributed: 0,
  dailyLimits: {
    "1": 8333.33 * Math.pow(10, TIME_DECIMALS),
    "2": 8333.33 * Math.pow(10, TIME_DECIMALS),
    "3": 8333.33 * Math.pow(10, TIME_DECIMALS),
    "4": 8333.33 * Math.pow(10, TIME_DECIMALS),
  },
  autoclickerLimits: 65000 * Math.pow(10, TIME_DECIMALS),
};

if (fs.existsSync(usersFile)) {
  const usersData = fs.readFileSync(usersFile);
  users = JSON.parse(usersData);
}

if (fs.existsSync(distributionDataFile)) {
  const distributionDataContent = fs.readFileSync(distributionDataFile);
  distributionData = JSON.parse(distributionDataContent);
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users));
  res.status(200).json({ message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  res.status(200).json({ message: 'Login successful' });
});

app.post('/api/click', (req, res) => {
  const { username } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  const now = new Date().getTime();
  if (!distributionData.firstClickTimestamp) {
    distributionData.firstClickTimestamp = now;
  }

  const timeElapsed = (now - distributionData.firstClickTimestamp) / (1000 * 60 * 60 * 24 * 30);
  const month = Math.ceil(timeElapsed);

  if (month > 8 || distributionData.totalDistributedClicks >= 2000000 * Math.pow(10, TIME_DECIMALS)) {
    return res.status(400).json({ message: 'Distribution limit reached' });
  }

  const dailyLimit = distributionData.dailyLimits[Math.min(month, 4)] || 8333.33 * Math.pow(10, TIME_DECIMALS);

  if (distributionData.dailyDistributed >= dailyLimit) {
    return res.status(400).json({ message: 'Daily limit reached' });
  }

  const amountToDistribute = Math.min(1.6667 * Math.pow(10, TIME_DECIMALS), dailyLimit - distributionData.dailyDistributed);
  distributionData.dailyDistributed += amountToDistribute;
  distributionData.totalDistributedClicks += amountToDistribute;

  fs.writeFileSync(distributionDataFile, JSON.stringify(distributionData));

  res.status(200).json({ message: 'Click registered', amount: amountToDistribute });
});

app.post('/api/buy-autoclicker', (req, res) => {
  const { username } = req.body;
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  if (distributionData.totalDistributedAutoclickers >= 520000 * Math.pow(10, TIME_DECIMALS)) {
    return res.status(400).json({ message: 'Autoclicker limit reached' });
  }

  const amountToDistribute = Math.min(2166 * Math.pow(10, TIME_DECIMALS), 520000 * Math.pow(10, TIME_DECIMALS) - distributionData.totalDistributedAutoclickers);
  distributionData.totalDistributedAutoclickers += amountToDistribute;

  fs.writeFileSync(distributionDataFile, JSON.stringify(distributionData));

  res.status(200).json({ message: 'Autoclicker purchased', amount: amountToDistribute });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
