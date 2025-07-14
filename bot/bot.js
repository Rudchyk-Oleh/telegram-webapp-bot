import express from 'express';
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token);

// Express-сервер для Webhook
const app = express();
const port = process.env.PORT || 3000;
const renderUrl = process.env.RENDER_EXTERNAL_URL; // Автоматично додається Render

// Встановлення Webhook
bot.setWebHook(`${renderUrl}/bot${token}`);

// Дозволяє читати JSON з тіла запитів
app.use(express.json());

// Обробка вхідних оновлень від Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ID групи і URL на WebApp
const groupId = process.env.GROUP_ID;
const webAppUrl = process.env.WEBAPP_URL;

// Обробка /start
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

// Обробка отриманих даних із WebApp
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data?.data;

  try {
    const parsed = JSON.parse(data);
    const message = `📨 Нова заявка від користувача ${msg.from.first_name}:\nПричина звернення: ${parsed.reason}`;

    // Надсилання в групу
    bot.sendMessage(groupId, message);

    // Підтвердження користувачу
    bot.sendMessage(chatId, '✅ Дякуємо! Ваше звернення надіслано.');
  } catch (err) {
    console.error('Помилка парсингу:', err);
    bot.sendMessage(chatId, '❌ Сталася помилка при обробці звернення.');
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
