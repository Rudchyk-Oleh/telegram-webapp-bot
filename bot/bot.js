const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '7895773734:AAHKWROWiJ3eW6JmR4tp8caMDOb9K1ObzOU';
const GROUP_ID = -1002689346007;
const WEBAPP_URL = 'https://yourdomain.com/chatingtg/index.html'; // 🔁 Встав сюди свій домен

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Оберіть дію:", {
    reply_markup: {
      keyboard: [[{
        text: "🧾 Відкрити меню",
        web_app: { url: WEBAPP_URL }
      }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.on('web_app_data', (msg) => {
  const username = msg.from.username || msg.from.first_name;
  const reason = msg.web_app_data.data;
  const text = `🔔 Нове звернення:\n👤 @${username}\n📌 Причина: ${reason}`;
  bot.sendMessage(GROUP_ID, text);
});
