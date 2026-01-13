const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: 'gdrive',
    desc: 'Google Drive downloader (Auto Download + Details)',
    react: '📥',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('❌ Google Drive link එකක් දෙන්න')

        // 🔑 API
        const apiUrl = `https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${encodeURIComponent(q)}`
        const res = await axios.get(apiUrl)
        const result = res.data?.result
        if (!result) return reply('❌ File data ගන්න බැරි වුණා')

        // 🖼 Custom thumbnail URL (document thumbnail ලෙස)
        const CUSTOM_THUMB =
            'https://files.catbox.moe/4pmdgt.jpeg' // 👈 custom thumbnail url

        // 📋 File details
        const details = `*📄 FILE DETAILS*

📄 Name : ${result.name}
🗂 Type : ${result.ext}
📦 Size : ${result.size}
🔗 Source :
${q}

> Powered by Sandes MD`

        // 📤 Auto send document with details as caption
        await conn.sendMessage(
            from,
            {
                document: { url: result.download },
                fileName: result.name,
                mimetype: result.mime,
                caption: details,
                thumbnail: await (await axios.get(CUSTOM_THUMB, { responseType: 'arraybuffer' })).data
            },
            { quoted: mek }
        )

    } catch (e) {
        console.error(e)
        reply('❌ GDrive command error')
    }
})
