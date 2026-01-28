const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
let CHATBOT_STATUS = false // Bot එකේ තත්වය තබා ගැනීමට

// --- AI පාලන මෙනුව (With Image) ---
cmd({
    pattern: "chatbot",
    desc: "Manage AI chatbot status and modes",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    // සෘජුවම On/Off කිරීමට (Example: .chatbot on)
    if (args[0] === 'on') {
        CHATBOT_STATUS = true
        return reply("🤖 Sandes AI Chatbot is now *ENABLED* ✅")
    }
    if (args[0] === 'off') {
        CHATBOT_STATUS = false
        return reply("🤖 Sandes AI Chatbot is now *DISABLED* ❌")
    }

    // මෙනුව පෙන්වීම
    const menuText = ` 
*🤖 SANDES MD AI CONTROL PANEL*
╭───────────────────────◆◆►
┇Status: ${CHATBOT_STATUS ? "✅ *ACTIVE*" : "❌ *OFF*"}
┇Current Mode: *${global.AI_MODE || "NORMAL"}*
╰─────────────────────◆◆►
📌 *Reply with a number:*
1️⃣ *Girl AI Mode*
2️⃣ *Normal AI Mode*
3️⃣ *Kid AI Mode*
4️⃣ *Turn OFF Chatbot*
5️⃣ *Turn ON Chatbot*

_Settings update instantly._
> Powered By Sandes Isuranda `

    const imageUrl = 'https://upld.zone.id/uploads/d4i0x5iq/logo.webp' // ඔබේ image link එක මෙතනට දාන්න

    return await conn.sendMessage(from, {
        image: { url: imageUrl },
        caption: menuText
    }, { quoted: mek })
})

// --- ප්‍රධාන AI Logic එක ---
cmd({
    on: "body"
},
async (conn, mek, m, {
    body,
    isCmd,
    senderNumber,
    reply
}) => {
    try {
        if (!body || m.fromMe) return

        // --- Menu එකට රිප්ලයි කිරීමේ Logic එක ---
        if (m.quoted && m.quoted.caption && m.quoted.caption.includes("SANDES AI CONTROL PANEL")) {
            if (body === '1') {
                global.AI_MODE = "girl";
                return reply("🌸 *Girl AI Mode Activated!*");
            }
            if (body === '2') {
                global.AI_MODE = "normal";
                return reply("🤖 *Normal AI Mode Activated!*");
            }
            if (body === '3') {
                global.AI_MODE = "kid";
                return reply("👶 *Kid AI Mode Activated!*");
            }
            if (body === '4') {
                CHATBOT_STATUS = false;
                return reply("❌ *Chatbot Turned OFF!*");
            }
            if (body === '5') {
                CHATBOT_STATUS = true;
                return reply("✅ *Chatbot Turned ON!*");
            }
        }

        // Bot off නම් හෝ Command එකක් නම් නතර කරන්න
        if (!CHATBOT_STATUS || isCmd || /^[./!#]/.test(body)) return

        await conn.sendPresenceUpdate('composing', m.chat)

        let promptBase = ""
        let currentMode = global.AI_MODE || "normal"

        if (currentMode === "girl") {
            promptBase = "Act as a friendly, cheerful Sri Lankan girl. Use emojis. Speak in friendly Sinhala."
        } else if (currentMode === "kid") {
            promptBase = "Act as a very small innocent kid. Use cute Sinhala words."
        } else {
            promptBase = "Act as Sandes AI, a helpful assistant created by Sandes Isuranda."
        }

        let systemPrompt = `${promptBase} Always reply in Sinhala. Question: ${body}`
        
        if (senderNumber === OWNER) {
            systemPrompt = `Owner Sandes Isuranda is talking. Be extra respectful. Mode: ${currentMode}. Question: ${body}`
        }

        let res = await fetchJson(
            `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(systemPrompt)}`
        )

        let msg = res.message || res.result || res.response || res.data || null

        if (msg) {
            let finalMsg = msg.replace(/GPT|ChatGPT|OpenAI/gi, "Sandes AI")
            await conn.sendPresenceUpdate('paused', m.chat)
            return await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: mek })
        }

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
        await conn.sendPresenceUpdate('paused', m.chat)
    }
})
