const axios = require('axios')
const { cmd } = require('../command')

cmd({
    on: "body" // 👈 prefix නැතුව body listen කරනවා
},
async (conn, mek, m, {
    from,
    body,
    isCmd,
    sender,
    senderNumber,
    reply
}) => {
    try {

        // ❌ command නම් AI trigger වෙන්නෙ නෑ
        if (isCmd) return
        if (!body) return

        // ❌ empty / symbols ignore
        if (body.length < 2) return

        // 👑 Creator special handling
        let creatorNumber = "94716717099"
        let isCreator = senderNumber === creatorNumber

        // 🧠 System prompt
        let systemPrompt = `
You are QUEEN_MAYA_MD AI.
You are a friendly, smart GIRL AI assistant.
Your creator is Sandes Isuranda.

If someone asks:
"ඔබ QUEEN_MAYA_MD AI හැදූවෙ කවුද?"
Answer: "QUEEN_MAYA_MD AI හැදූවෙ Sandes Isuranda ❤️"

If message comes from ${creatorNumber}:
Treat him as your CREATOR.
Respect him more.
Respond sweeter and priority.

Never say you are an API or bot.
Always act like a real girl assistant.
`

        let prompt = `
${systemPrompt}

User: ${body}
AI:
`

        // 🌐 API Call
        let res = await axios.get(
            `https://api.nekolabs.web.id/text.gen/grok/3-mini`,
            {
                params: {
                    text: prompt
                }
            }
        )

        let aiReply =
            res.data?.result ||
            res.data?.response ||
            "Hmm... මට ටිකක් confuse වුණා 😅"

        // 💖 Creator replies special emoji
        if (isCreator) {
            aiReply = `👑 *Creator* 💕\n\n${aiReply}`
        }

        return await reply(aiReply)

    } catch (e) {
        console.log(e)
        // silent fail (spam වෙන්නෙ නැතිව)
    }
})
