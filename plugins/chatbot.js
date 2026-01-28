const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"
let CHATBOT_ON = true 

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
        // මූලික පරීක්ෂාවන්
        if (!CHATBOT_ON || !body || m.fromMe || isCmd) return 
        if (/^[./!#]/.test(body)) return

        // 1. Typing effect එක start කිරීම
        await conn.sendPresenceUpdate('composing', m.chat)

        // AI එකට උපදෙස් ලබාදීම
        let customPrompt = `Your name is Sandes AI. Created by Sandes Isuranda. Always reply in Sinhala language unless asked otherwise. Question: ${body}`
        
        if (senderNumber === OWNER) {
            customPrompt = `This is from your creator Sandes Isuranda. Reply with high respect in Sinhala. Question: ${body}`
        }

        // API එකෙන් response එක ලබාගැනීම
        let res = await fetchJson(
            `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(customPrompt)}`
        )

        let msg = res.message || res.result || res.response || res.data || null

        if (msg) {
            // "GPT" වැනි වචන "Sandes AI" වලට මාරු කිරීම
            let finalMsg = msg.replace(/GPT|ChatGPT|OpenAI/gi, "Sandes AI")
            
            // 2. Typing status එක නැවත සාමාන්‍ය තත්වයට පත් කිරීම (Optional, reply එක ගිය පසු auto නැතිවේ)
            await conn.sendPresenceUpdate('paused', m.chat)

            // Reply එක යැවීම
            return await conn.sendMessage(m.chat, { text: finalMsg }, { quoted: mek })
        }

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
        // Error එකක් ආවොත් typing status එක pause කිරීම
        await conn.sendPresenceUpdate('paused', m.chat)
    }
})
