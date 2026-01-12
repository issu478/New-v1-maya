const config = require('../config')
const { cmd, commands } = require('../command')
const os = require("os")
const { runtime, sleep } = require('../lib/functions')

//================ ALIVE =================
cmd({
    pattern: "alive",
    desc: "Check bot online status",
    react: "👋",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
try {

    let aliveText = `
👋 Hello *${pushname}*  

🤖 *QUEEN MAYA-MD*  
━━━━━━━━━━━━━━━
✅ Status : *Online*
⏱ Uptime : *${runtime(process.uptime())}*
⚙ Mode   : *Public*
🧠 RAM    : *${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB*
🖥 Host   : *${os.hostname()}*
━━━━━━━━━━━━━━━

_Type *.menu* to see commands_

> © Powered by *Sandes Isuranda*
`

    await conn.sendMessage(from, {
        image: { url: config.ALIVE_IMG }, // alive image
        caption: aliveText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
})


//================ PING =================
cmd({
    pattern: "ping",
    react: "🚀",
    alias: ["speed"],
    desc: "Check bot response speed",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
try {
    let start = new Date().getTime()
    let msg = await conn.sendMessage(from, { text: "```Pinging...```" }, { quoted: mek })
    let end = new Date().getTime()
    await conn.edit(msg, `*Pong!* 🚀 ${end - start} ms`)
} catch (e) {
    console.log(e)
}
})


//================ MENU (ROUND VIDEO + IMAGE + NUMBER) =================
cmd({
    pattern: "menu",
    desc: "Show menu",
    react: "📂",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
try {

    // 🔵 Round video
    await conn.sendMessage(from, {
        video: { url: "https://files.catbox.moe/03o57r.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(700)

    // 🖼 Menu image + numbers
    let menuText = `
👋 Hello *${pushname}*

🤖 *QUEEN MAYA-MD*
━━━━━━━━━━━━━━━
⏱ Uptime : ${runtime(process.uptime())}
👑 Owner  : Sandes Isuranda
⚙ Mode   : Public
━━━━━━━━━━━━━━━

Reply with a number 👇

1️⃣ Download Menu  
2️⃣ Group Menu  
3️⃣ Owner Menu  
4️⃣ Search Menu  
5️⃣ Other Menu  

_Reply only the number (Ex: 1)_
`

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/4bc81k.png" },
        caption: menuText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
})


//================ NUMBER REPLY HANDLER =================
cmd({
    pattern: "^[1-5]$",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, reply }) => {
try {

    if (body === "1") {
        return reply(`
⬇️ *DOWNLOAD MENU*
.tiktok
.mp43
.song3
.mediafire
`)
    }

    if (body === "2") {
        return reply(`
👥 *GROUP MENU*
.add
.kick
.mute
.unmute
.tagall
`)
    }

    if (body === "3") {
        return reply(`
👤 *OWNER MENU*
.jid
.gjid
.block
.ban
.setpp
`)
    }

    if (body === "4") {
        return reply(`
🔍 *SEARCH MENU*
.yts
.tiktoksearch
`)
    }

    if (body === "5") {
        return reply(`
✨ *OTHER MENU*
.ping
.menu
.system
`)
    }

} catch (e) {
    console.log(e)
}
})
