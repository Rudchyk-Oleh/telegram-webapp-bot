import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

// 1. Ініціалізація токена
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);

// 2. Ініціалізація Express + Webhook
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.RENDER_EXTERNAL_URL; // Render сам додає це

bot.setWebHook(`${url}/bot${token}`);
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// 3. ID групи, WebApp URL
const groupId = process.env.GROUP_ID;
const webAppUrl = process.env.WEBAPP_URL;

// 4. Обробка /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Обери дію нижче:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '📩 Залишити звернення',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
});

// 5. Обробка WebApp даних
bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  const chatId = msg.chat.id;

  try {
    const parsed = JSON.parse(data);
    const message = `📨 Нова заявка від користувача ${msg.from.first_name}:\nПричина звернення: ${parsed.reason}`;

    // Надсилання в групу
    bot.sendMessage(groupId, message);

    // Підтвердження користувачу
    bot.sendMessage(chatId, '✅ Дякуємо! Ваше звернення надіслано.');
  } catch (error) {
    console.error('JSON parse error:', error);
    bot.sendMessage(chatId, '❌ Сталася помилка при обробці звернення.');
  }
});

// 6. Запуск Express сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
