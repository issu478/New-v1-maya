const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: 'gdrive',
    desc: 'Google Drive downloader (Download + Details)',
    react: '📥',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('❌ Google Drive link එකක් දාන්න')

        // 🔑 API
        const apiUrl = `https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${encodeURIComponent(q)}`
        const res = await axios.get(apiUrl)
        const result = res.data?.result
        if (!result) return reply('❌ File data ගන්න බැරි වුණා')

        // 🖼 Custom thumbnail URL (මෙතන change කරගන්න)
        const CUSTOM_THUMB =
            'https://files.catbox.moe/4pmdgt.jpeg' // 👈 custom thumbnail url

        // 📩 Menu caption
        const menu = `*📥 GDRIVE FILE DOWNLOADER*

📄 *Name* : ${result.name}
📦 *Size* : ${result.size}
🗂 *Type* : ${result.ext}

*Reply with number 👇*

1️⃣ Download File  
2️⃣ File Details  

> © Powered by Sandes Isuranda`

        // 📤 Send menu
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: CUSTOM_THUMB },
                caption: menu
            },
            { quoted: mek }
        )

        // 🔢 Reply handler (FIXED)
        const handler = async (update) => {
            const msg = update.messages[0]
            if (!msg.message?.extendedTextMessage) return

            const text = msg.message.extendedTextMessage.text.trim()
            const ctx = msg.message.extendedTextMessage.contextInfo
            if (!ctx || ctx.stanzaId !== sentMsg.key.id) return

            // remove listener after reply
            conn.ev.off('messages.upsert', handler)

            if (text === '1') {
                // ⬇ Download
                await conn.sendMessage(
                    from,
                    {
                        document: { url: result.download },
                        fileName: result.name,
                        mimetype: result.mime
                    },
                    { quoted: msg }
                )

            } else if (text === '2') {
                // 📋 Details
                const details = `*📄 FILE DETAILS*

📄 Name : ${result.name}
🗂 Type : ${result.ext}
📦 Size : ${result.size}
🔗 Source :
${q}

⬇ Download :
${result.download}

> QUEEN-MAYA-MD`

                reply(details)

            } else {
                reply('❌ 1 හෝ 2 reply කරන්න')
            }
        }

        conn.ev.on('messages.upsert', handler)

    } catch (e) {
        console.error(e)
        reply('❌ GDrive command error')
    }
})
