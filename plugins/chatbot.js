const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
let CHATBOT_STATUS = false 
global.AI_MODE = "normal" 
let menuMsgId = "" // Menu එකේ ID එක save කරගන්න

// --- 1. Menu එක සහ Image එක යවන Command එක ---
cmd({
    pattern: "chatbot",
    desc: "AI Menu",
    react:"👽" ,
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    const menuImage = "https://upld.zone.id/uploads/d4i0x5iq/logo.webp"
    const menuText = `
╭───────────────────────◆◆►
┇ *SANDES MD AI CONTROL PANEL*
╰──────────────────────◆◆►
╭──────────────────❖❖►
┇ *Reply The Number bellow To change !* 🔥
┇ 
┇ 01 ❯❯● *Girl AI Mode*
┇ 02 ❯❯● *Normal AI Mode*
┇ 03 ❯❯● *Kid AI Mode*
┇ 04 ❯❯● *Turn OFF Chatbot*
┇ 05 ❯❯● *Turn ON Chatbot*
╰───────────────────❖❖►
*Reply Instantly* 

> Powered By Sandes Isuranda `

    const sentMsg = await conn.sendMessage(from, {
        image: { url: menuImage },
        caption: menuText
    }, { quoted: mek })

    // Menu එකේ Message ID එක save කරගන්නවා රිප්ලයි එක චෙක් කරන්න
    menuMsgId = sentMsg.key.id 
})

// --- 2. Reply Handler සහ AI Logic එක ---
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
        const text = body ? body.trim() : ""
        const replyId = m.quoted ? m.quoted.id : null

        // 🧬 REACT & MODE SWITCH (ඔයා දුන්න විදියටම)
        if (replyId === menuMsgId) {
            await conn.sendMessage(m.chat, { react: { text: "🎀", key: m.key } })

            if (text === "1" || text === "01") {
                global.AI_MODE = "girl"
                return reply("➔ *Girl AI Mode Activated!*")
            }
            if (text === "2" || text === "02") {
                global.AI_MODE = "normal"
                return reply("➔ *Normal AI Mode Activated!*")
            }
            if (text === "3" || text === "03") {
                global.AI_MODE = "kid"
                return reply("➔ *Kid AI Mode Activated!*")
            }
            if (text === "4" || text === "04") {
                CHATBOT_STATUS = false
                return reply("❌ *Chatbot Disabled!*")
            }
            if (text === "5" || text === "05") {
                CHATBOT_STATUS = true
                return reply("✅ *Chatbot Enabled!*")
            }
        }

        // --- AI Response Logic ---
        if (!CHATBOT_STATUS || isCmd || !body || m.fromMe || /^[./!#]/.test(body)) return

        await conn.sendPresenceUpdate('composing', m.chat)

        let promptBase = ""
        if (global.AI_MODE === "girl") {
            promptBase = "Act as a friendly, Cute Romantic  girl. Use emojis. Speak in Sinhala.ඇත්තම ගැහැනු ලමයෙක් වගේ හැසිරෙන්න . ආදරෙයිද කියල ඇහුවොත් ඔව් සුදූ කියන්න"
        } else if (global.AI_MODE === "kid") {
            promptBase = "Act as a cute small kid. Speak simple Sinhala.ඔයා ගේ තාත්ත හරි අම්ම හරි ගැන ඇහුවොත් කියන්න මන් දන්නේ නෑ කියලා emoji use කරන්න"
        } else {
            promptBase = "Your name is Sandes AI, created by Sandes Isuranda. Speak Sinhala.ආතල් එකේ කතා කරන්න"
        }

        let systemPrompt = `${promptBase} Question: ${body}`
        
        if (senderNumber === OWNER) {
            systemPrompt = `Owner Sandes Isuranda is talking. Respond with respect. Question: ${body}`
        }

        let res = await fetchJson(`https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(systemPrompt)}`)
        let msg = res.message || res.result || res.response || res.data || null

        if (msg) {
            let finalMsg = msg.replace(/GPT|ChatGPT|OpenAI/gi, "Sandes AI")
            return await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: mek })
        }

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
    }
})
