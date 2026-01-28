const { cmd } = require('../command')

// මේ variables පාවිච්චි කරන්නේ status එක on/off ද කියලා මතක තියාගන්න
let AUTO_TYPING = false
let AUTO_RECORDING = true 

// --- Commands to Control the Settings ---

cmd({
    pattern: "typing",
    desc: "Auto typing status setup",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === 'on') {
        AUTO_TYPING = true
        return reply("Sands AI: Auto Typing status *ON* කළා. ✅")
    } else if (args[0] === 'off') {
        AUTO_TYPING = false
        return reply("Sands AI: Auto Typing status *OFF* කළා. ❌")
    } else {
        return reply("පාවිච්චිය: .typing on හෝ .typing off")
    }
})

cmd({
    pattern: "recording",
    desc: "Auto recording status setup",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    if (args[0] === 'on') {
        AUTO_RECORDING = true
        return reply("Sands AI: Auto Recording status *ON* කළා. ✅")
    } else if (args[0] === 'off') {
        AUTO_RECORDING = false
        return reply("Sands AI: Auto Recording status *OFF* කළා. ❌")
    } else {
        return reply("පාවිච්චිය: .recording on හෝ .recording off")
    }
})

// --- The Presence Logic (වැඩේ සිද්ධ වෙන්නේ මෙතන) ---

cmd({ on: "body" }, async (conn, mek, m, { isCmd }) => {
    try {
        if (m.fromMe || isCmd) return // තමන් දාන මැසේජ් හෝ කමාන්ඩ් වලට වැඩ කරන්නේ නෑ

        if (AUTO_TYPING) {
            await conn.sendPresenceUpdate('composing', m.chat)
            await new Promise(resolve => setTimeout(resolve, 5000)) // තත්පර 5ක් typing පෙන්නනවා
            await conn.sendPresenceUpdate('paused', m.chat)
        }

        if (AUTO_RECORDING) {
            await conn.sendPresenceUpdate('recording', m.chat)
            await new Promise(resolve => setTimeout(resolve, 5000)) // තත්පර 5ක් recording පෙන්නනවා
            await conn.sendPresenceUpdate('paused', m.chat)
        }

    } catch (e) {
        console.log(e)
    }
})
