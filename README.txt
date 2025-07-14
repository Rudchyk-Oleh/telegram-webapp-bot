# Telegram WebApp Bot

## 🔧 Інструкція

1. Залий вміст папки `chatingtg/` на свій хостинг:
   → наприклад, https://yourdomain.com/chatingtg/index.html

2. У файлі `bot/bot.js` заміни:
   - `YOUR_BOT_TOKEN` на свій токен
   - `GROUP_ID` на chat_id твоєї групи
   - `WEBAPP_URL` на твій лінк до WebApp

3. Встанови Node.js (якщо ще не встановлено):
   ```bash
   npm install
   npm start
   ```

4. Готово! Бот приймає `/start`, відкриває форму, отримує дані та надсилає повідомлення в групу.

