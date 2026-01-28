const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER_NUMBER = "94716717099"
let CHATBOT_ENABLED = false

cmd({ on: "body" }, async (conn, mek, m, {
    body,
    isCmd,
    senderNumber,
    reply
}) => {
    try {
        if (!body || m.fromMe) return

        const textLower = body.toLowerCase().trim()

        // Chatbot ON / OFF
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Sands AI is now *OFF*')
        }

        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Sands AI is now *ON*')
        }

        // skip if disabled or command
        if (!CHATBOT_ENABLED || isCmd || /^[./!#]/.test(body)) return

        // download related filter
        const downloadKeywords = ['download', 'ඩවුන්ලෝඩ්', 'video', 'song', 'mp3']
        if (downloadKeywords.some(k => textLower.includes(k))) {
            return reply(
                "Sands AI ඩවුන්ලෝඩ් commands handle කරන්නෙ නෑ.\n.menu බලන්න 🙂"
            )
        }

        // typing indicator
        await conn.sendPresenceUpdate('composing', m.chat)

        // SAFE sender detect (NO CRASH)
        const senderNum =
            senderNumber ||
            m.sender ||
            mek.key?.participant ||
            mek.key?.remoteJid ||
            ''

        const cleanSender = senderNum.replace(/\D/g, '')
        const isOwner = cleanSender === OWNER_NUMBER

        // system prompt
        let systemPrompt =
            "You are Sands AI, created by Sandes Isuranda. Reply naturally in Sinhala or English."

        let ownerGreeting = isOwner
            ? "The person is your creator Sandes. Be very friendly and respectful."
            : ""

        const finalQuery = `${systemPrompt}\n${ownerGreeting}\nUser: ${body}`

        // API CALL
        const apiUrl =
            `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(finalQuery)}`

        let res = await fetchJson(apiUrl)

        // SAFE response extract
        let msg =
            res?.result ||
            res?.response ||
            res?.data ||
            res?.reply ||
            ''

        if (typeof msg !== 'string' || !msg.trim()) {
            await conn.sendPresenceUpdate('paused', m.chat)
            return reply('⚠️ Sands AI response empty. Try again.')
        }

        // clean branding
        let finalMsg = msg
            .replace(/OpenAI/gi, 'Sands AI')
            .replace(/xAI/gi, 'Sandes Isuranda')
            .trim()

        // send reply FIRST
        await reply(finalMsg)

        // stop typing
        await conn.sendPresenceUpdate('paused', m.chat)

    } catch (e) {
        console.log('[SANDS-AI ERROR]', e)
        try {
            await conn.sendPresenceUpdate('paused', m.chat)
        } catch {}
    }
})
