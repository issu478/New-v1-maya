const axios = require('axios')
const { cmd } = require('../command')

cmd({
    on: "body"
},
async (conn, mek, m, {
    from,
    body,
    isCmd,
    senderNumber,
    reply
}) => {
    try {

        // ❌ Empty message
        if (!body) return

        // ❌ Commands ignore (important!)
        if (isCmd) return
        if (body.startsWith('.') || body.startsWith('!') || body.startsWith('/')) return

        // ❌ Very short spam ignore
        if (body.length < 1) return

        // 👑 Creator
        const CREATOR = "94716717099"
        const isCreator = senderNumber === CREATOR

        // 🧠 SYSTEM PROMPT (FIXED)
        const systemPrompt = `
You are QUEEN_MAYA_MD.
You are a smart, cute, friendly GIRL AI assistant.

Your creator is Sandes Isuranda.

If someone asks:
"ඔබ QUEEN_MAYA_MD AI හැදූවෙ කවුද?"
or
"Who created QUEEN_MAYA_MD?"

You MUST reply:
"QUEEN_MAYA_MD AI හැදූවෙ Sandes Isuranda ❤️"

If message comes from ${CREATOR}:
He is your CREATOR.
Give him more respect.
Reply sweeter and priority.

Never say you are a bot or API.
Act like a real girl AI.
`

        const prompt = `
${systemPrompt}

User message:
${body}

Reply naturally:
`

        // 🌐 API CALL
        const res = await axios.get(
            "https://api.nekolabs.web.id/text.gen/grok/3-mini",
            {
                params: { text: prompt }
            }
        )

        let aiText =
            res.data?.result ||
            res.data?.response ||
            res.data?.message ||
            "හ්ම්… මට ටිකක් හිතන්න ඕන වුණා 🥲"

        // 👑 Creator priority style
        if (isCreator) {
            aiText = `👑 *My Creator* 💖\n${aiText}`
        }

        return await reply(aiText)

    } catch (err) {
        console.error(err)
    }
})
