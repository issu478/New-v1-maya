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

    await conn.sendMessage(from, {
        video: { url: "https://saviya-kolla-database.vercel.app/VIDEO/1768384369287_2rlpi.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(500)

    await conn.sendMessage(from, {
        audio: { url: "https://www.movanest.xyz/Jr0juj.mpeg" },
        mimetype: "audio/mpeg",
        ptt: false
    }, { quoted: mek })

    await sleep(500)

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

    await conn.sendMessage(from, {
        video: { url: "https://saviya-kolla-database.vercel.app/VIDEO/1768383621686_yl221.mp4" },
        ptv: true
    }, { quoted: mek })

    await sleep(600)

    let menuText = `
👋 Hello *${pushname}*🔥

 🫟 *Welcome to SANDES MD* 

*╭─「 ʙᴏᴛ ᴅᴇᴛᴀɪʟꜱ 」──●●►*
*│* 👤 User = ${pushname} 
*│* ⏰ Run time = ${runtime(process.uptime())}
*│* 🧬 Version = V 02
*│* 📟 Ram Usage = ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
*│* 👾 Bot = SANDES MD
*│* ☎️ Owner = 94716717099
*│* ✒️ Prefix = .
*╰──────────●●►*

🔢 *_Reply The Number Below_* 🔥

*🔶 01* ❱❱⦁ Download Menu
*🔶 02* ❱❱⦁ Group Menu 
*🔶 03* ❱❱⦁ Owner Menu 
*🔶 04* ❱❱⦁ Search Menu
*🔶 05* ❱❱⦁ Main Menu
*🔶 06* ❱❱⦁ Fun Menu

> Powered by Sandes Isuranda ㋡
`

    const sentMenu = await conn.sendMessage(from, {
        image: { url: "https://upld.zone.id/uploads/d4i0x5iq/logo.webp" },
        caption: menuText
    }, { quoted: mek })

    const menuMsgId = sentMenu.key.id

    //================ NUMBER REPLY HANDLER =================
    const handler = async (msgData) => {
        try {
            const msg = msgData.messages[0]
            if (!msg?.message) return

            const replyId =
                msg.message.extendedTextMessage?.contextInfo?.stanzaId
            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text

            if (!text || replyId !== menuMsgId) return

            const fromUser = msg.key.remoteJid
            const menuImage = "https://upld.zone.id/uploads/d4i0x5iq/logo.webp"

            // 🧬 REACT TO NUMBER REPLY
            await conn.sendMessage(fromUser, {
                react: { text: "🧬", key: msg.key }
            })

            if (text === "1" || text === "01") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption: `
👋 𝙷𝙴𝙻𝙻𝙾𝚆 ${pushname} 
 
🎀 *Commands Menu* 🎀

*╭───「 Main Commands 」──●●►* 
*╎* 
*╎*   🫟 Command - .song 
*╎* 🔖 Usage - Download a Song
*╎*   🫟 Command - .video 
*╎* 🔖 Usage - Download a Video 
*╎*   🫟 Command - .mediafire 
*╎* 🔖 Usage - download mediafire files 
*╎*   🫟 Command - .csong 
*╎* 🔖 Usage - Chanel Song 
*╎*   🫟 Command - .fb 
*╎* 🔖 Usage - Download Facebook Videos 
*╎*   🫟 Command - .apk
*╎* 🔖 Usage - Download Apk
*╎* 
*╎* Total Commands - 7
*╰───────────────────●●►* 


> *Powered By Sandes Isuranda ㋡* 
`
                }, { quoted: msg })
            }

            if (text === "2" || text === "02") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption:`
👋 𝙷𝙴𝙻𝙻𝙾𝚆 ${pushname} 
 
🎀 *Commands Menu* 🎀

*╭───「 Group Commands 」──●●►* 
*╎* 
*╎*   🫟 Command - .tagall 
*╎* 🔖 Usage - Mention All memebers
*╎*   🫟 Command - .hidetag
*╎* 🔖 Usage - Mention All members 
*╎*   🫟 Command - .add
*╎* 🔖 Usage - Add some one 
*╎*   🫟 Command - .kick
*╎* 🔖 Usage - Remove some one
*╎*   🫟 Command - .promote
*╎* 🔖 Usage - Make As Admin 
*╎*   🫟 Command - .demote
*╎* 🔖 Usage - Remove Admin
*╎*   🫟 Command - .mute
*╎* 🔖 Usage - Admin Only massage  
*╎*   🫟 Command - .unmute
*╎* 🔖 Usage - All member massage 
*╎*  
*╎* Total Commands - 7
*╰───────────────────●●►* 


> *Powered By Sandes Isuranda ㋡* 
`
                }, { quoted: msg })
            }

            if (text === "3" || text === "03") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption: `
👋 𝙷𝙴𝙻𝙻𝙾𝚆 ${pushname} 
 
🎀 *Commands Menu* 🎀

*╭───「 Main Commands 」──●●►* 
*╎* 
*╎*   🫟 Command - .jid
*╎* 🔖 Usage - Check Available JID 
*╎*   🫟 Command - .shutdown
*╎* 🔖 Usage - Shutting Down System
*╎*   🫟 Command - .block
*╎* 🔖 Usage - Block some one
*╎*   🫟 Command - .unblock 
*╎* 🔖 Usage - Unblock some one
*╎*   🫟 Command - .gjid
*╎* 🔖 Usage - Group JIDS 
*╎*  
*╎* Total Commands - 5
*╰───────────────────●●►* 


> *Powered By Sandes Isuranda ㋡* 
`
                }, { quoted: msg })
            }

            if (text === "4" || text === "04") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption: `  
                    👋 𝙷𝙴𝙻𝙻𝙾𝚆 ${pushname} 
 
🎀 *Commands Menu* 🎀

*╭───「 Search Commands  」──●●►* 
*╎* 
*╎*   🫟 Command - .yts
*╎* 🔖 Usage - You Tube Search  
*╎*   🫟 Command - .npm
*╎* 🔖 Usage - Search For NPM packages 
*╎*   🫟 Command - .github 
*╎* 🔖 Usage - Search Github Repo 
*╎*   🫟 Command - .tiks
*╎* 🔖 Usage - Tik Tok Search
*╎*  
*╎*  Total Commands - 5
*╰───────────────────●●►* 

> *Powered By Sandes Isuranda ㋡* 
`
                }, { quoted: msg })
            }

            if (text === "5" || text === "05") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption: `
 👋 𝙷𝙴𝙻𝙻𝙾𝚆 ${pushname} 
 
🎀 *Commands Menu* 🎀

*╭───「 Main Commands 」──●●►* 
*╎* 
*╎*   🫟 Command - .ping 
*╎* 🔖 Usage - Check Bot Speed 
*╎*   🫟 Command - .menu
*╎* 🔖 Usage - Show Available Commands 
*╎*   🫟 Command - .alive 
*╎* 🔖 Usage - Check bot alive 
*╎*   🫟 Command - .owner
*╎* 🔖 Usage - Contact Owner
*╎*   🫟 Command - .system
*╎* 🔖 Usage - Check System 
*╎*  
*╎* Total Commands - 5
*╰───────────────────●●►* 

> *Powered By Sandes Isuranda ㋡* 
`
                }, { quoted: msg })
            }

            if (text === "6" || text === "06") {
                return conn.sendMessage(fromUser, {
                    image: { url: menuImage },
                    caption: `
🔥 *MAIN MENU*

.owner
.system
.menu
.ping
.alive
`
                }, { quoted: msg })
            }

            await conn.sendMessage(fromUser, {
                text: "❌ Invalid option! Reply only 01 - 06"
            }, { quoted: msg })

        } catch (err) {
            console.log("Number reply error:", err)
        }
    }

    conn.ev.on("messages.upsert", handler)

    setTimeout(() => {
        conn.ev.off("messages.upsert", handler)
    }, 300000)

} catch (e) {
    console.log(e)
}
})
