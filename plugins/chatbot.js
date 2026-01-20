const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"

// chatbot state
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

        if (!body) return
        if (m.fromMe) return

        const textLower = body.toLowerCase().trim()

        // ================= CHATBOT ON / OFF =================
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Chat bot is now *OFF*')
        }

        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Chat bot is now *ON*')
        }
        // ====================================================

        // chatbot off = do nothing (silent)
        if (!CHATBOT_ENABLED) return

        // commands skip
        if (isCmd) return
        if (/^[./!#]/.test(body)) return

        let text = body

        // owner respect prompt
        if (senderNumber === OWNER) {
            text = `This message is from my creator Sandes Isuranda. Reply with extra respect.\n\n${body}`
        }

        let res = await fetchJson(
            `https://api.nekolabs.web.id/text.gen/grok/3-mini?text=${encodeURIComponent(text)}`
        )

        let msg =
            res?.result ||
            res?.response ||
            res?.data ||
            null

        if (!msg) return

        return reply(msg)

    } catch (e) {
        console.log('[AUTO-AI ERROR]', e)
    }
})
