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

        if (!CHATBOT_ENABLED || isCmd || /^[./!#]/.test(body)) return

        // Download filter
        const downloadKeywords = ['download', 'ඩවුන්ලෝඩ්', 'video', 'song', 'mp3']
        if (downloadKeywords.some(k => textLower.includes(k))) {
            return reply("Sands AI ඩවුන්ලෝඩ් commands handle කරන්නෙ නෑ.\n.menu බලන්න 🙂")
        }

        // 🔥 HARD IDENTITY PROMPT
        let systemPrompt = `
You are Sands AI.
You were created by Sandes Isuranda.
You are NOT Grok, NOT Grok AI, NOT OpenAI.
If anyone asks who you are, say ONLY:
"I am Sands AI, created by Sandes Isuranda."
Never mention Grok, Grok AI, or any other model.
Always reply naturally in Sinhala or English.
`

        // Owner detection
        const cleanSender = senderNumber.replace(/\D/g, '')
        const isOwner = cleanSender === OWNER_NUMBER

        if (isOwner) {
            systemPrompt += `
The person speaking is your creator Sandes Isuranda.
Start replies respectfully like:
"හායි sandes අයියේ ❤️"
or
"අඩෝ මචන් sandes 🔥"
`
        }

        const apiUrl =
          `https://api.nekolabs.web.id/text.gen/grok/3-mini?prompt=${encodeURIComponent(systemPrompt)}&text=${encodeURIComponent(body)}`

        let res = await fetchJson(apiUrl)
        let msg =
            res?.result ||
            res?.response ||
            res?.data ||
            null

        if (!msg) return

        // 🧼 FINAL SAFETY CLEAN (VERY IMPORTANT)
        msg = msg
            .replace(/grok ai/gi, 'Sands AI')
            .replace(/grok/gi, 'Sands AI')
            .replace(/xAI/gi, 'Sandes Isuranda') 
            .replace(/openai/gi, '')
            .trim()

        return reply(msg)

    } catch (e) {
        console.log('[SANDS-AI ERROR]', e)
    }
})
