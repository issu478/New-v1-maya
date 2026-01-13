const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')

cmd({
    pattern: 'song',
    desc: 'YouTube song downloader (VN / Audio / Document)',
    react: '🎵',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('❌ *Song name or YouTube link එකක් දාන්න*')

        // 🔍 Search YouTube
        const search = await yts(q)
        const video = search.videos[0]
        if (!video) return reply('❌ *Video not found*')

        const ytUrl = video.url

        // 🔗 OminiSave API
        const apiUrl = `https://ominisave.vercel.app/api/ytmp3_v2?url=${encodeURIComponent(ytUrl)}`
        const res = await axios.get(apiUrl)

        if (!res.data || res.data.status !== true) {
            return reply('❌ *Download failed*')
        }

        const dlUrl = res.data.result.downloadLink

        const caption = `*🎧 QUEEN-MAYA-MD SONG DOWNLOADER*

🎵 *Title:* ${video.title}
⏱ *Duration:* ${video.timestamp}
👀 *Views:* ${video.views}

*Reply with a number 👇*

*1️⃣ Voice Note*
*2️⃣ Normal Audio*
*3️⃣ Document*

> © Powered by Sandes Isuranda`

        const msg = await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption
        }, { quoted: mek })

        // 🎯 Reply handler
        conn.ev.on('messages.upsert', async (update) => {
            try {
                const m2 = update.messages[0]
                if (!m2.message?.extendedTextMessage) return

                const text = m2.message.extendedTextMessage.text.trim()
                const ctx = m2.message.extendedTextMessage.contextInfo

                if (!ctx || ctx.stanzaId !== msg.key.id) return

                if (text === '1') {
                    // 🎤 Voice Note
                    await conn.sendMessage(from, {
                        audio: { url: dlUrl },
                        mimetype: 'audio/mpeg',
                        ptt: true
                    }, { quoted: m2 })

                } else if (text === '2') {
                    // 🎧 Normal Audio
                    await conn.sendMessage(from, {
                        audio: { url: dlUrl },
                        mimetype: 'audio/mpeg'
                    }, { quoted: m2 })

                } else if (text === '3') {
                    // 📁 Document
                    await conn.sendMessage(from, {
                        document: { url: dlUrl },
                        mimetype: 'audio/mpeg',
                        fileName: `${video.title}.mp3`
                    }, { quoted: m2 })

                } else {
                    reply('❌ *1 / 2 / 3 කියලා reply කරන්න*')
                }

            } catch (e) {
                console.error(e)
            }
        })

    } catch (err) {
        console.error(err)
        reply('❌ *Error occurred*')
    }
})
