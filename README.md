# 🤖 Baileys WhatsApp Bot

This is a Node.js-based WhatsApp bot built using **@whiskeysockets/baileys** and **OpenAI GPT-4o** to handle customer interactions with Somali language support! 🚀

---

## 💡 How It Works

1. **Authentication**

   - Uses Baileys' `useMultiFileAuthState` to store authentication data **locally** in a folder called `auth_info`.
   - This means the WhatsApp session is saved on your file system, making it easier to reconnect without scanning the QR every time.

2. **Connecting to WhatsApp**

   - Generates a QR code in the terminal for linking your WhatsApp account.
   - Listens for new messages using Baileys’ `messages.upsert` event.
   - When a new message is received, it grabs the message text and sends it to the OpenAI API for a smart reply.

3. **AI Responses**

   - Uses OpenAI’s GPT-4o to generate Somali-language responses tailored to business inquiries.
   - Responses are designed to guide customers through bot-building services offered by **JiheeyeBots** (you can customize this pitch).

4. **Express Server**
   - Runs a lightweight web server on port `3000` (or whatever `PORT` is set in `.env`).
   - Provides a basic GET endpoint at `/` to confirm the bot is running.

---

## 📂 Data Storage

| Data          | Where Stored?                                 |
| ------------- | --------------------------------------------- |
| WhatsApp Auth | `./auth_info` folder (JSON)                   |
| Messages      | Not saved anywhere—just processed on the fly. |
| API Key       | Stored in `.env` file.                        |

**Important:**

- **No user messages or data are stored permanently**. Everything except WhatsApp auth is processed in-memory.
- Make sure `.env` and `auth_info` are secure and not committed to version control!

---

## 🔑 Setup

1. Clone this repo & Change into the project directory:
   ```bash
   git clone https://github.com/Alaaja8899/baileys-bot.git
   ```
   ```bash
      cd baileys-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your OpenAI API key in a `.env` file:
   ```env
   OPENAI_API_KEY=sk-xxxxxx
   ```
   (In the code provided, the key is hardcoded—consider moving it to `.env` for security.)
4. Run the bot:
   ```bash
   node app.js
   ```
5. Scan the QR code in the terminal to connect your WhatsApp.

---

## 🗂️ File Structure

```
.
├── index.js        # Main bot logic
├── auth_info/      # Stores WhatsApp session credentials
├── .env            # API keys and other environment variables
└── package.json    # Project metadata
```

---

## 🚨 Notes

- **Security:** Never share your `auth_info` folder or `.env` file publicly—this contains sensitive credentials!
- **OpenAI Key:** For best practices, store the API key in `.env` instead of hardcoding it. (I can help refactor that if you’d like.)
- **Bots & AI:** This bot is designed to respond in Somali and can be customized with different prompts to match your business style.

---

## ✨ Features

- 📱 WhatsApp integration via Baileys
- 🧠 AI-powered responses using GPT-4o
- 🌐 Easy deployment with Node.js & Express
- 🔒 Local session persistence (no cloud storage)

---
