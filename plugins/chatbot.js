const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
let CHATBOT_ON = false // Bot toggle status

// ON/OFF Command
cmd({
    pattern: "chatbot",
    desc: "Enable or disable the AI chatbot",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (args[0] === 'on') {
        CHATBOT_ON = true
        return reply("🤖 AI Chatbot is now *ON*")
    } else if (args[0] === 'off') {
        CHATBOT_ON = false
        return reply("🤖 AI Chatbot is now *OFF*")
    } else {
        return reply("Use: .chatbot on | off")
    }
})

// Main AI Logic
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
        if (!CHATBOT_ON || !body || m.fromMe || isCmd) return 
        if (/^[./!#]/.test(body)) return

        let text = body
        if (senderNumber === OWNER) {
            text = `This message is from my creator Sandes Isuranda. Reply with extra respect.\n\n${body}`
        }

        let res = await fetchJson(
            `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(text)}`
        )

        // ඔබ එවපු Screenshot එක අනුව මෙතන 'message' තිබිය යුතුයි
        let msg = res.message || res.result || res.response || res.data || null

        if (msg) {
            return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek })
        }

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
    }
})
