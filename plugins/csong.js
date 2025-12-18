const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')
const fetch = require('node-fetch')

cmd({
    pattern: 'csong',
    desc: 'Send song to WhatsApp Channel (details card + mp3)',
    react: '🎧',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { reply, q }) => {
    try {
        if (!q || !q.includes(',')) {
            return reply(
`❌ Usage wrong!

Usage:
.csong song name , channel_jid`
            )
        }

        let [songName, channelJid] = q.split(',').map(v => v.trim())

        if (!songName || !channelJid)
            return reply('❌ Song name or channel jid missing!')

        if (!channelJid.endsWith('@newsletter'))
            return reply('❌ Invalid channel JID!')

        // 🔍 Search song
        const search = await yts(songName)
        if (!search.videos.length)
            return reply('❌ Song not found!')

        const video = search.videos[0]

        await reply(`🎧 *Uploading song to channel...*\n\n🎵 ${video.title}`)

        // 🎵 Asitha API MP3
        const res = await fetch(
            `http://vpn.asitha.top:3000/api/ytmp3?url=${video.url}`
        )
        const json = await res.json()

        if (!json.result || !json.result.download)
            return reply('❌ Download failed!')

        const mp3Url = json.result.download

        // 🖼️ Thumbnail buffer
        const thumb = await axios.get(video.thumbnail, {
            responseType: 'arraybuffer'
        }).then(res => res.data)

        // 📋 Details card caption
        const detailsCaption =
`🎵 *${video.title}*

👤 *Artist:* ${video.author.name}
⏱️ *Duration:* ${video.timestamp}
👁️ *Views:* ${video.views}

📢 *Channel Music Upload*

> © Powered by Sandes Isuranda`

        // 1️⃣ Send details card (image + caption)
        await conn.sendMessage(
            channelJid,
            {
                image: thumb,
                caption: detailsCaption
            }
        )

        // 2️⃣ Send MP3 audio
        await conn.sendMessage(
            channelJid,
            {
                audio: { url: mp3Url },
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }
        )

        await reply('✅ *Song + details card sent successfully!*')

    } catch (e) {
        console.error(e)
        reply('❌ Error while processing your request!')
    }
})
