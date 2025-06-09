const makeWASocket = require('@whiskeysockets/baileys').default;
const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Boom = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');
require('dotenv').config();
const express = require('express');



const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
});

const generateResponse = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `
                        ask customer: "What's your business? Build efficient bot for you?"

                        You're a bot for a company (JiheeyeBots) that makes AI bots for businesses:
                        1. Services:
                        - We build efficient and advanced AI bots to improve customer service.
                        2. Billing:
                        - Monthly: $30 (basic), $45 (more trained)
                        - Yearly: $300 (advanced)
                        3. Benefits:
                        - 24/7 availability
                        - Better customer service
                        4. Location:
                        - Virtually online
                        5. Real person:
                        - We'll call you or you can reach us at +252611430930
                        6. If they agree or want a bot:
                        - Thank them, let them know we’ll call to confirm, ask more about their business.

                        Respond in Somali for each question appropriately.
                    `,
                },
                { role: 'user', content: prompt },
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI error:', error);
        return 'Sorry, there was an issue generating a response.';
    }
};

const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect =
                Boom.isBoom(lastDisconnect?.error) &&
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Reconnecting...');
                connectToWhatsApp();
            } else {
                console.log('Logged out.');
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connected.');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const userId = msg.key.remoteJid;
        const prompt =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            '';

        const aiResponse = await generateResponse(prompt);
        await sock.sendMessage(userId, { text: aiResponse });
    });
};

connectToWhatsApp();

const app = express();
const PORT = process.env.PORT || 3000;



// Health check endpoint to verify the bot server is running
app.get('/', (req, res) => {
    res.send('🤖 Baileys WhatsApp bot is up and running!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
