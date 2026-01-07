const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- 1. THE WEB SERVER (Required for Render/Uptime) ---
app.get('/', (req, res) => {
  res.send('Aternos AFK Bot is Online!');
});

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});

// --- 2. BOT CONFIGURATION ---
const botArgs = {
  host: 'NPGurkhas.aternos.me', // Replace with your server IP
  port: 42609,                      // Usually 25565
  username: '24_7_Bot',             // The name of your bot
  version: '1.21.11'                 // IMPORTANT: Change to your server version
};

// --- 3. THE BOT LOGIC ---
function initBot() {
  const bot = mineflayer.createBot(botArgs);

  // When the bot joins the server
  bot.on('login', () => {
    console.log('✅ Success: Bot is now in the server!');
  });

  // Anti-AFK: The bot will jump every 2 minutes to fool Aternos
  bot.on('spawn', () => {
    console.log('Bot spawned. Starting Anti-AFK...');
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 120000); // 120000ms = 2 minutes
  });

  // Auto-Reconnect: If the bot is kicked or the server restarts
  bot.on('end', (reason) => {
    console.log(`❌ Disconnected: ${reason}. Retrying in 40 seconds...`);
    setTimeout(initBot, 40000); // Wait 40s before trying again
  });

  // Error handling to prevent the code from crashing
  bot.on('error', (err) => {
    console.log('⚠️ Error occurred:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('Server is offline. Retrying in 1 minute...');
    }
    setTimeout(initBot, 60000);
  });
}

// Start the bot
initBot();
