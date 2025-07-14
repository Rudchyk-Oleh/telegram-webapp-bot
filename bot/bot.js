import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

// 1. Змінні середовища
const token = process.env.BOT_TOKEN;
const groupId = process.env.GROUP_ID;
const webAppUrl = process.env.WEBAPP_URL;
const renderUrl = process.env.RENDER_EXTERNAL_URL;
const port = process.env.PORT || 3000;

// 2. Ініціалізація Telegram бота без polling
const bot = new TelegramBot(token);
bot.setWebHook(`${renderUrl}/bot${token}`);

// 3. Express + Webhook
const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

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
    const parsed = JSON.parse(data); // очікуємо { reason: "..." }

    const message = `📨 Нова заявка від користувача ${msg.from.first_name}:\nПричина звернення: ${parsed.reason}`;

    bot.sendMessage(groupId, message);
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
