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
        video: { url: "https://https://saviya-kolla-database.vercel.app/VIDEO/1768384369287_2rlpi.mp4/03o57r.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(500)

    // 2️⃣ VOICE MESSAGE
    await conn.sendMessage(from, {
        audio: { url: "https://www.movanest.xyz/Jr0juj.mpeg" },
        mimetype: "audio/opus",
        ptt: true
    }, { quoted: mek })

    await sleep(500)

    // 3️⃣ ALIVE MESSAGE
    let aliveText = `
👋 Hello *${pushname}* 🌸  

*HEELO USER I'M ALIVE NOW🔥* 

╔══════════════════════❏
║🟢 Status : *Online & Stable*
║⏱ Uptime : *${runtime(process.uptime())}*
║⚙ Mode   : *Public*
║🧠 RAM    : *${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB*
║🖥 Host   : *${os.hostname()}*
║👨‍💻 Developer : Sandes Isuranda 
╚══════════════════════❏

✨ _I'm alive & ready to serve you_


Type *.menu* to view commands 📂  


> © Powered by Sandes Isuranda
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
        video: { url: "https://saviya-kolla-database.vercel.app/VIDEO/1768383621686_yl221.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(600)

    // 🖼 MENU IMAGE + NUMBERS
    let menuText = `
👋 Hello *${pushname}*🔥

*Welcome to SANDES MD🔥* 

*╭─「 ʙᴏᴛ ᴅᴇᴛᴀɪʟꜱ  ──●●►*
*│* 🙋 *𝘜𝘴𝘦𝘳 =* ${pushname} 
*│* ⏰ *𝘙𝘶𝘯 𝘵𝘪𝘮𝘦 =* ${runtime(process.uptime())}
*│* 💬 *𝘝𝘦𝘳𝘴𝘪𝘰𝘯 =* V 02
*│* 👾 *𝘉𝘰𝘵 = SANDES MD*
*│* ☎️ *𝘖𝘸𝘯𝘦𝘳 = 94716717099*
*│* ✒️ *𝘗𝘳𝘦𝘧𝘪𝘹 = .*
*╰──────────●●►*

*-Reply The Number Bellow_* 🔥

🔶  01 ▏Download Menu 
🔶  02 ▏Group Menu  
🔶  03 ▏Owner Menu  
🔶  04 ▏Search Menu  
🔶  05 ▏Other Menu   
🔶  06 ▏Main Menu 


*Main Site -* sandes-ofc.zone.id 

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
async (conn, mek, m, { from, body, isCmd }) => {
try {

    // ❌ ignore commands
    if (isCmd) return

    let menuImage = "https://upld.zone.id/uploads/d4i0x5iq/logo.webp"

    if (body === "1") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
⬇️ *DOWNLOAD MENU*

.tiktok
.video 
.song
.mediafire 
.apk 

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
.npm 
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
    
    if (body === "6") {
        await conn.sendMessage(from, { react: { text: "🧬", key: mek.key } })
        return conn.sendMessage(from, {
            image: { url: menuImage },
            caption: `
🔥 *MAIN MENU*

.owner
.system
.menu
.ping 
.alive

`
        }, { quoted: mek })
    }


} catch (e) {
    console.log(e)
}
})
