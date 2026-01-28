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

        // Chatbot Control
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Sands AI is now *OFF*')
        }
        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Sands AI is now *ON*')
        }

        if (!CHATBOT_ENABLED || isCmd || /^[./!#]/.test(body)) return

        // Download filter
        const downloadKeywords = ['download', 'ඩවුන්ලෝඩ්', 'video', 'song', 'mp3']
        if (downloadKeywords.some(k => textLower.includes(k))) {
            return reply("Sands AI ඩවුන්ලෝඩ් commands handle කරන්නෙ නෑ.\n.menu බලන්න 🙂")
        }

        // Typing Status - මෙතනින් typing පෙන්නන්න පටන් ගන්නවා
        await conn.sendPresenceUpdate('composing', m.chat)

        // System Prompt logic
        let systemPrompt = `You are Sands AI, created by Sandes Isuranda. Reply naturally in Sinhala or English.`
        const cleanSender = senderNumber.replace(/\D/g, '')
        const isOwner = cleanSender === OWNER_NUMBER
        
        let ownerGreeting = isOwner ? `The person is your creator Sandes. Be very friendly and respectful.` : ""
        const finalQuery = `${systemPrompt} ${ownerGreeting} User: ${body}`

        // API Call
        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(finalQuery)}`
        let res = await fetchJson(apiUrl)
        
        let msg = res?.result || res?.response || res?.data || res?.reply || null

        if (!msg) {
            // Error එකක් වුනොත් typing status එක නතර කරන්න
            await conn.sendPresenceUpdate('paused', m.chat)
            return
        }

        // Final Cleaning
        let finalMsg = msg
            .replace(/OpenAI/gi, 'Sands AI')
            .replace(/Grok/gi, 'Sands AI')
            .replace(/xAI/gi, 'Sandes Isuranda')
            .trim()

        // Reply එක යැවීමට පෙර typing status එක නතර කරන්න
        await conn.sendPresenceUpdate('paused', m.chat)
        
        return reply(finalMsg)

    } catch (e) {
        console.log('[SANDS-AI ERROR]', e)
        await conn.sendPresenceUpdate('paused', m.chat)
    }
})
