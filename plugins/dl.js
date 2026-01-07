const { fetchJson } = require('../lib/functions')
const { cmd } = require('../command')

const yourName = "> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*"
const devDetails = "👨‍💻 *Developer* : Sandes Isuranda"

/* ================= APK DOWNLOAD ================= */

cmd({
    pattern: "apk",
    alias: ["apkdl"],
    desc: "download android apps (apk)",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("give me app name\n\nexample: .apk whatsapp")

        let data = await fetchJson(
            `https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(q)}`
        )

        if (!data || !data.result) return reply("apk not found ❌")

        const caption =
`📦 *${data.result.name}*

🧑‍💻 Developer : ${data.result.developer || "Unknown"}
🆕 Version   : ${data.result.version || "Latest"}
📊 Size      : ${data.result.size}

${devDetails}
${yourName}`

        const buttons = [
            {
                buttonId: `.apk ${q}`,
                buttonText: { displayText: "⬇ Download APK" },
                type: 1
            },
            {
                buttonId: `.apk`,
                buttonText: { displayText: "🔍 Search Another App" },
                type: 1
            }
        ]

        await conn.sendMessage(from, {
            text: caption,
            buttons,
            headerType: 1
        }, { quoted: mek })

        await conn.sendMessage(from, {
            document: { url: data.result.download },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${data.result.name}.apk`,
            caption: `${yourName}`
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply("error while downloading apk ❌")
    }
})

/* ================= FACEBOOK DOWNLOAD ================= */

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "download facebook videos",
    category: "download",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("http"))
            return reply("give me facebook video url")

        let data = await fetchJson(
            `https://api.princetechn.com/api/download/facebookv2?apikey=prince&url=${encodeURIComponent(q)}`
        )

        if (!data || !data.result)
            return reply("video not found ❌")

        const caption =
`📥 *Facebook Video Downloader*

🎬 Choose Quality 👇

👨‍💻 Bot Dev : Sandes Isuranda
🌐 API      : Sandes-ofc.free.nf 

${yourName}`

        const buttons = [
            {
                buttonId: `fb_hd`,
                buttonText: { displayText: "🎬 HD Video" },
                type: 1
            },
            {
                buttonId: `fb_sd`,
                buttonText: { displayText: "📹 SD Video" },
                type: 1
            }
        ]

        await conn.sendMessage(from, {
            text: caption,
            buttons,
            headerType: 1
        }, { quoted: mek })

        if (data.result.hd) {
            await conn.sendMessage(from, {
                video: { url: data.result.hd },
                mimetype: "video/mp4",
                caption: `- HD\n\n${yourName}`
            }, { quoted: mek })
        }

        if (data.result.sd) {
            await conn.sendMessage(from, {
                video: { url: data.result.sd },
                mimetype: "video/mp4",
                caption: `- SD\n\n${yourName}`
            }, { quoted: mek })
        }

    } catch (e) {
        console.log(e)
        reply("error while downloading fb video ❌")
    }
})
