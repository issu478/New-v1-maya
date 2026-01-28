const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
let ATTA_AI_STATUS = true // මෙය default 'on' ලෙස ඇත. 

// --- Bot එක On/Off කරන Command එක ---
cmd({
    pattern: "chatbot",
    desc: "Turn Auto AI on or off",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (args[0] === 'on') {
        ATTA_AI_STATUS = true
        return reply("🤖 Auto AI Chatbot is now *ON*")
    } else if (args[0] === 'off') {
        ATTA_AI_STATUS = false
        return reply("🤖 Auto AI Chatbot is now *OFF*")
    } else {
        return reply("Usage: .chatbot on | off")
    }
})

// --- ප්‍රධාන AI logic එක ---
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
        // පරීක්ෂා කිරීම්
        if (!ATTA_AI_STATUS) return // Bot off නම් කිසිවක් කරන්නේ නැත
        if (!body || m.fromMe || isCmd) return 
        if (/^[./!#]/.test(body)) return // වෙනත් command එකක් නම් skip කරයි

        let text = body
        if (senderNumber === OWNER) {
            text = `This message is from my creator Sandes Isuranda. Please respond accordingly.\n\n${body}`
        }

        // API Call
        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(text)}`
        let res = await fetchJson(apiUrl)

        // API එකෙන් එන response එක හරියටම අල්ලගන්න
        let msg = res.result || res.response || res.data || (res.reply ? res.reply : null)

        if (msg) {
            return reply(msg)
        } else {
            // කිසිම response එකක් නැත්නම් console එකේ බලන්න API එක වැඩද කියා
            console.log("AI API returned empty response:", res)
        }

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
    }
})
