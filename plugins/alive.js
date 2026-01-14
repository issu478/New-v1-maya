const config = require('../config')
const { cmd } = require('../command')
const os = require("os")
const { runtime, sleep } = require('../lib/functions')

//================ ALIVE =================
cmd({
    pattern: "alive",
    desc: "Bot alive check with round video, voice & text",
    react: "👨‍💻",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
try {

    // 1️⃣ ROUND VIDEO
    await conn.sendMessage(from, {
        video: { url: "https://files.catbox.moe/03o57r.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(500)

    // 2️⃣ VOICE MESSAGE
    await conn.sendMessage(from, {
        audio: { url: "https://www.movanest.xyz/Jr0juj.mpeg" }, // alive voice
        mimetype: "audio/mpeg",
        ptt: false 
    }, { quoted: mek })

    await sleep(500)

    // 3️⃣ ALIVE MESSAGE
    let aliveText = `
👋 Hello *${pushname}* 🌸  

*QUEEN MAYA-MD Is Alive Now🔥*
_I'm Ready To Assist You_🔥 
┏▰▰▰▰▰▰▰▰▰▰▰▰▰✦
┃🟢 Status : *Online & Stable*
┃⏱ Uptime : *${runtime(process.uptime())}*
┃⚙ Mode   : *Public*
┃🧠 RAM    : *${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB*
┃🖥 Host   : *${os.hostname()}*
┃👨‍💻 Developer : Sandes Isuranda 
┗▰▰▰▰▰▰▰▰▰▰▰▰▰✦
✨ _I'm alive & ready to serve you_

Type *.menu* to view commands 📂  

> © Powered by *Sandes Isuranda*
`

    await conn.sendMessage(from, {
        image: { url: config.ALIVE_IMG },
        caption: aliveText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
}) 


//================ MENU =================
cmd({
    pattern: "menu",
    desc: "Menu with round video + image + number reply",
    react: "📂",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
try {

    // 🔵 ROUND VIDEO
    await conn.sendMessage(from, {
        video: { url: "https://files.catbox.moe/03o57r.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(600)

    // 🖼 MENU IMAGE + NUMBERS
    let menuText = `
👋 Hello *${pushname}*🔥

*Welcome to SANDES-MD 🔥* 
❰ ❏ *Status Details* ❏ ❱
╔════════════════════✦
║ ⏱Uptime : ${runtime(process.uptime())}
║ 👑 Owner  : Sandes Isuranda
║ ⚙ Mode   : Public
║ 🔥 Owner No : 94716717099
║ 💻 Type : Node.js
║ 👨‍💻Total Commands : 20 + 
║ 🧬 Visit Us : sandes-ofc.zone.id 
╚════════════════════✦

Reply with a number 👇

1️⃣ Download Menu  
2️⃣ Group Menu  
3️⃣ Owner Menu  
4️⃣ Search Menu  
5️⃣ Other Menu  

_Reply only the number (1 - 5)_

> Powered by Sandes Isuranda ㋡
`

    await conn.sendMessage(from, {
        image: { url: "https://upld.zone.id/uploads/d4i0x5iq/logo.webp" },
        caption: menuText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
})


//================ NUMBER REPLY SYSTEM =================
cmd({
    on: "text",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, isCmd, reply }) => {
try {

    // ❌ ignore commands
    if (isCmd) return

    let menuImage = "https://upld.zone.id/uploads/d4i0x5iq/logo.webp" // same image for all

    if (body === "1") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
⬇️ *DOWNLOAD MENU*
.tiktok
.mp43
.song3
.mediafire
`
        }, { quoted: mek })
    }

    if (body === "2") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
👥 *GROUP MENU*
.add
.kick
.mute
.unmute
.tagall
`
        }, { quoted: mek })
    }

    if (body === "3") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
👤 *OWNER MENU*
.jid
.gjid
.block
.ban
.setpp
`
        }, { quoted: mek })
    }

    if (body === "4") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
🔍 *SEARCH MENU*
.yts
.tiktoksearch
`
        }, { quoted: mek })
    }

    if (body === "5") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
✨ *OTHER MENU*
.ping
.menu
.system
`
        }, { quoted: mek })
    }

} catch (e) {
    console.log(e)
}
})
