const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER_NUMBER = "94716717099" // ඔබගේ අංකය මෙහි ඇත
let CHATBOT_ENABLED = true

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
        const textLower = body.toLowerCase().trim()

        // 1. Chatbot ON/OFF Control
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Chat bot is now *OFF*')
        }
        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Chat bot is now *ON*')
        }

        if (!CHATBOT_ENABLED || isCmd || /^[./!#]/.test(body)) return

        // 2. Download requests filter
        const downloadKeywords = ['download', 'ඩවුන්ලෝඩ්', 'සින්දුවක්', 'video', 'song', 'mp3', 'ගහලා']
        if (downloadKeywords.some(keyword => textLower.includes(keyword))) {
            return reply("අයියෝ, මට කෙලින්ම ඩවුන්ලෝඩ් කරන්න බැහැ. 😅\n\nකරුණාකර *.menu* කියලා type කරන්න. ඒ හරහා ඔබට ඕනෑම දෙයක් ලබා ගන්න පුළුවන්.")
        }

        // 3. AI Identity - සම්පූර්ණයෙන්ම Sands AI ලෙස සකසා ඇත
        let systemPrompt = "Your name is Sands AI. You are a smart and friendly AI assistant created by Sandes Isuranda. You must always answer in Sinhala or English as requested. If someone asks who you are, say I'm Sands AI."

        // 4. Owner detection (Fixing the ID issue)
        // senderNumber එකේ අංක පමණක් ගෙන පරීක්ෂා කරයි
        const cleanSender = senderNumber.replace(/\D/g, '')
        const isOwner = cleanSender.includes(OWNER_NUMBER)

        if (isOwner) {
            systemPrompt += " Critical Instruction: The person talking to you now is your Boss/Creator, Sandes Isuranda. Start your reply with a very respectful greeting like 'හායි sandes අයියේ...' or 'අඩෝ suddha ...' and be extremely helpful to him."
        }

        // 5. API Call (Grok engine එක භාවිතා කළත් පෙනුම Sands AI ලෙස)
        // අපි prompt එක ඇතුළත Identity එක දෙන නිසා AI එක Sands AI ලෙස පිළිතුරු දෙයි
        const apiUrl = `https://api.nekolabs.web.id/text.gen/grok/3-mini?prompt=${encodeURIComponent(systemPrompt)}&text=${encodeURIComponent(body)}`
        
        let res = await fetchJson(apiUrl)
        let msg = res?.result || res?.response || res?.data || null

        if (msg) {
            return reply(msg)
        }

    } catch (e) {
        console.log('[SANDS-AI ERROR]', e)
    }
})
