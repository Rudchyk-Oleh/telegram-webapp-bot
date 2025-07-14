import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.RENDER_EXTERNAL_URL;

// Прив’язуємо Webhook
bot.setWebHook(`${url}/bot${token}`);

// Middleware
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Група та WebApp
const groupId = process.env.GROUP_ID;
const webAppUrl = process.env.WEBAPP_URL;

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Обери дію нижче:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📩 Залишити звернення', web_app: { url: webAppUrl } }]
      ]
    }
  });
});

// WebApp Data
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  try {
    const data = JSON.parse(msg.web_app_data.data);
    const message = `📨 Нова заявка від ${msg.from.first_name}:\nПричина звернення: ${data.reason}`;
    bot.sendMessage(groupId, message);
    bot.sendMessage(chatId, '✅ Дякуємо! Ваше звернення надіслано.');
  } catch (err) {
    console.error('Помилка парсингу:', err);
    bot.sendMessage(chatId, '❌ Сталася помилка при обробці звернення.');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
