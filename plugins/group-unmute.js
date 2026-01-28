const { cmd } = require('../command')

// Typing Status පෙන්වීමට
cmd({
    pattern: "typing",
    desc: "Show typing status",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendPresenceUpdate('composing', from)
        return reply("Sands AI: Typing status එක On කළා. ✅")
    } catch (e) {
        console.log(e)
    }
})

// Recording Status පෙන්වීමට
cmd({
    pattern: "recording",
    desc: "Show recording status",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendPresenceUpdate('recording', from)
        return reply("Sands AI: Recording status එක On කළා. 🎤")
    } catch (e) {
        console.log(e)
    }
})

// Status එක නතර කිරීමට (Stop)
cmd({
    pattern: "stopstatus",
    desc: "Stop status updates",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendPresenceUpdate('paused', from)
        return reply("Sands AI: සියලුම status නතර කළා. 🛑")
    } catch (e) {
        console.log(e)
    }
})

