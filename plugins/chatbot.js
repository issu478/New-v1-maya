const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

const OWNER = "94716717099"

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

        // commands skip
        if (isCmd) return
        if (/^[./!#]/.test(body)) return

        // API text
        let text = body

        // owner respect prompt (API level)
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
