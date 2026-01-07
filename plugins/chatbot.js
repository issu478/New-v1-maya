const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

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

        // ❌ empty
        if (!body) return

        // ❌ commands ignore
        if (isCmd) return
        if (body.startsWith('.') || body.startsWith('!') || body.startsWith('/')) return

        // 🌐 API call (DIRECT MESSAGE → DIRECT RESPONSE)
        let data = await fetchJson(
            `https://api.nekolabs.web.id/text.gen/grok/3-mini?text=${encodeURIComponent(body)}`
        )

        let result =
            data?.result ||
            data?.response ||
            data?.message ||
            data?.data ||
            null

        if (!result) return

        // ✅ PURE API RESPONSE ONLY
        return await reply(result)

    } catch (e) {
        console.log(e)
    }
})
