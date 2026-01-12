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

        // search
        const search = await yts(q)
        const video = search.videos[0]
        if (!video) return reply('❌ *Video not found*')

        const ytUrl = video.url

        // API
        const apiUrl = `https://api.srihub.store/download/ytmp3?apikey=dew_6cdpQmzH2tGrfXiK3TFoBFxmN7xKV8KzdeHRxbqN&url=${encodeURIComponent(ytUrl)}`
        const res = await axios.get(apiUrl)
        const dlUrl = res.data.result.download

        const caption = `╭▰▰▰▰▰▰▰▰▰▰▰▰▰▰✦
▕🎧 *QUEEN-MAYA-MD SONG DOWNLOADER* 
▕🎵 *Title:* ${video.title}
▕⏱ *Duration:* ${video.timestamp}
▕👀 *Views:* ${video.views}
▕
▕  _🔢Reply with a number_
▕
▕  1️⃣ *Voice Note*
▕  2️⃣ *Normal Audio*
▕  3️⃣ *Document*
▕
*╰*▰▰▰▰▰▰▰▰▰▰▰▰▰▰✦

> © Powered by Sandes Isuranda`

        const msg = await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption
        }, { quoted: mek })

        // reply listener
        conn.ev.on('messages.upsert', async (update) => {
            const m2 = update.messages[0]
            if (!m2.message?.extendedTextMessage) return

            const text = m2.message.extendedTextMessage.text.trim()
            const ctx = m2.message.extendedTextMessage.contextInfo

            if (!ctx || ctx.stanzaId !== msg.key.id) return

            if (text === '1') {
                // Voice Note
                await conn.sendMessage(from, {
                    audio: { url: dlUrl },
                    mimetype: 'audio/mpeg',
                    ptt: true
                }, { quoted: m2 })

            } else if (text === '2') {
                // Normal Audio
                await conn.sendMessage(from, {
                    audio: { url: dlUrl },
                    mimetype: 'audio/mpeg'
                }, { quoted: m2 })

            } else if (text === '3') {
                // Document
                await conn.sendMessage(from, {
                    document: { url: dlUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${video.title}.mp3`
                }, { quoted: m2 })

            } else {
                reply('❌ *1 / 2 / 3 කියලා reply කරන්න*')
            }
        })

    } catch (err) {
        console.error(err)
        reply('❌ *Error occurred*')
    }
})
