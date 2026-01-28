const { cmd } = require('../command')
const { fetchJson } = require('../lib/functions')

let CHATBOT_ENABLED = true // Default ON කරලා තියෙන්නෙ

cmd({ on: "body" }, async (conn, mek, m, {
    body,
    isCmd,
    reply
}) => {
    try {
        // අත්‍යවශ්‍ය නොවන අවස්ථා මගහැරීම
        if (!body || m.fromMe || isCmd || /^[./!#]/.test(body)) return

        // Chatbot ON/OFF පාලනය පමණක් තබා ගනිමු
        const textLower = body.toLowerCase().trim()
        if (textLower === 'chat bot off') {
            CHATBOT_ENABLED = false
            return reply('🤖 Chatbot is now *OFF*')
        }
        if (textLower === 'chat bot on') {
            CHATBOT_ENABLED = true
            return reply('🤖 Chatbot is now *ON*')
        }

        // Chatbot disable නම් මෙතනින් නවතින්න
        if (!CHATBOT_ENABLED) return

        // Typing indicator පෙන්වීම
        await conn.sendPresenceUpdate('composing', m.chat)

        // API CALL - මෙතනට ඔයාගේ වැඩ කරන API URL එක දාන්න
        // මම මෙතන demo එකක් විදිහට එකක් දාලා තියෙනවා
        const apiUrl = `https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(body)}`

        let res = await fetchJson(apiUrl)

        // API එකෙන් එන response එක ග්‍රහණය කරගැනීම (Result field එක බලන්න)
        let msg = res?.result || res?.response || res?.data || ''

        if (!msg) {
            await conn.sendPresenceUpdate('paused', m.chat)
            return // Response එකක් නැත්නම් reply කරන්නේ නැත
        }

        // කිසිදු branding එකක් නැතිව කෙලින්ම response එක යැවීම
        await reply(msg.trim())
        
        // Typing නවත්වන්න
        await conn.sendPresenceUpdate('paused', m.chat)

    } catch (e) {
        console.error('[CHATBOT ERROR]', e)
        await conn.sendPresenceUpdate('paused', m.chat)
    }
})
