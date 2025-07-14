import TelegramBot from 'node-telegram-bot-api';
import http from 'http';

// Токен збережений у середовищі (Render > Environment → BOT_TOKEN)
// Перед правкою:
const token = process.env.BOT_TOKEN || '7895773734:AAHKWROWiJ3eW6JmR4tp8caMDOb9K1ObzOU';
 // fallback для локального запуску
 // ← fallback для локального запуску

// Ініціалізація бота
const bot = new TelegramBot(token, { polling: true });

// ID групи, куди надсилати звернення
const groupId = process.env.GROUP_ID || '-1002215572345'; // ← заміни на свій ID, якщо буде інший

// Посилання на Telegram WebApp
const webAppUrl = 'https://zuno-feedback.web.app'; // ← твій актуальний WebApp

// Обробка команди /start
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

// Обробка даних, отриманих з WebApp
bot.on('web_app_data', (msg) => {
  const data = msg.web_app_data.data;
  const chatId = msg.chat.id;

  try {
    const parsed = JSON.parse(data);
    const message = `📨 Нова заявка від користувача ${msg.from.first_name}:\nПричина звернення: ${parsed.reason}`;

    // Відправка в групу
    bot.sendMessage(groupId, message);

    // Відповідь користувачу
    bot.sendMessage(chatId, '✅ Дякуємо! Ваше звернення надіслано.');
  } catch (error) {
    console.error('JSON parse error:', error);
    bot.sendMessage(chatId, '❌ Сталася помилка при обробці звернення.');
  }
});

// Фейковий сервер для Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running');
}).listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
