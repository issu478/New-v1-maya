const config = require('../config')
const { cmd } = require('../command')
const os = require("os")
const { runtime, sleep } = require('../lib/functions')

//================ ALIVE =================
cmd({
    pattern: "alive",
    desc: "Bot alive check with voice",
    react: "👨‍💻",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
try {

    // 🔊 VOICE MESSAGE
    await conn.sendMessage(from, {
        audio: { url: "https://files.catbox.moe/wj2d61.mp3" }, // alive voice
        mimetype: "audio/mpeg",
        ptt: true
    }, { quoted: mek })

    await sleep(500)

    // 💎 ALIVE MESSAGE
    let aliveText = `
👋 Hello *${pushname}* 🌸  

*QUEEN MAYA-MD Is Alive Now🔥*
_Im Redy To Assist You_🔥 
┏▰▰▰▰▰▰▰▰▰▰▰▰▰✦
┃🟢 Status : *Online & Stable*
┃⏱ Uptime : *${runtime(process.uptime())}*
┃⚙ Mode   : *Public*
┃🧠 RAM    : *${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB*
┃🖥 Host   : *${os.hostname()}*
┃👨‍💻 Developer : Sandes Isuranda 
┗▰▰▰▰▰▰▰▰▰▰▰▰▰▰✦
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
    await conn.edit(msg, `*Pong  ${end - start} ms*`)
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
        video: { url: "https://files.catbox.moe/roundvideo.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(600)

    // 🖼 MENU IMAGE + NUMBERS
    let menuText = `
👋 Hello *${pushname}*

*Wellcome to QUEEN MAYA-MD 🔥* 
              ▰▰▰▰▰▰▰▰
               ╰ʙᴏᴛ ᴅᴇᴛᴀɪʟꜱ╯
              ▰▰▰▰▰▰▰▰
 
┏▰▰▰▰▰▰▰▰▰▰▰▰▰▰✦
┃⏱Uptime : ${runtime(process.uptime())}
┃👑 Owner  : Sandes Isuranda
┃⚙ Mode   : Public
┃🔥 Owner No : 94716717099
┃💻 Type : Node.js
┃👨‍💻Total Commands : 20 +
┗▰▰▰▰▰▰▰▰▰▰▰▰▰▰✦

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
        image: { url: "https://files.catbox.moe/4bc81k.png" },
        caption: menuText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
})


//================ NUMBER REPLY SYSTEM (FIXED) =================
cmd({
    on: "text",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, isCmd, reply }) => {
try {

    // ❌ ignore commands
    if (isCmd) return

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
