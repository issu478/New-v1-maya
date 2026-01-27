const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
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

        // 1. Chatbot පාලනය
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Chat bot is now *OFF*')
        }
        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Chat bot is now *ON*')
        }

        if (!CHATBOT_ENABLED || isCmd || /^[./!#]/.test(body)) return

        // 2. ඩවුන්ලෝඩ් ඉල්ලීම් සඳහා ස්වයංක්‍රීය පිළිතුර
        const downloadKeywords = ['download', 'ඩවුන්ලෝඩ්', 'සින්දුවක්', 'video', 'song', 'mp3']
        if (downloadKeywords.some(keyword => textLower.includes(keyword))) {
            return reply("අයියෝ, මට කෙලින්ම ඩවුන්ලෝඩ් කරන්න බැහැ. 😅\n\nකරුණාකර *.menu* කියලා type කරලා බලන්න. ඒ හරහා ඔබට අවශ්‍ය දේ ලබා ගන්න පුළුවන්.")
        }

        // 3. Custom Prompt සැකසීම
        let customPrompt = "ඔබේ නම Sands AI. ඔබ සුහදශීලී සහ සහායකයෙක් විය යුතුය."
        
        // 4. නිර්මාණකරු (Creator) හඳුනාගැනීම සහ විශේෂ පිළිතුර
        if (senderNumber === OWNER) {
            // නිර්මාණකරුට විශේෂ ආචාරයක් ඇතුළත් කිරීම
            customPrompt += " දැන් පණිවිඩය එවන්නේ ඔබේ නිර්මාණකරු වන Sandes Isuranda  ය. 'හායි මචන් කොහොමද?' වැනි ඉතා ගෞරවනීය සහ සුහදශීලී ආචාරයකින් පිළිතුර ආරම්භ කරන්න."
        } else {
            customPrompt += " සාමාන්‍ය පරිශීලකයින්ට කෙටි සහ පැහැදිලි පිළිතුරු ලබා දෙන්න."
        }

        // 5. AI API එකට පණිවිඩය යැවීම
        // මෙහි Grok AI API එක භාවිතා කර ඇත
        const apiUrl = `https://api.nekolabs.web.id/text.gen/grok/3-mini?prompt=${encodeURIComponent(customPrompt)}&text=${encodeURIComponent(body)}`
        
        let res = await fetchJson(apiUrl)
        let msg = res?.result || res?.response || res?.data || null

        if (msg) return reply(msg)

    } catch (e) {
        console.log('[SANDS-AI ERROR]', e)
    }
})
