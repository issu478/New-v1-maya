const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')
const fetch = require('node-fetch')

cmd({
    pattern: 'gsong',
    desc: 'Send song to group as document with full details',
    react: '🎧',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q || !q.includes(',')) {
            return reply(
`❌ *Wrong usage!*

✅ Usage:
.gsong song name , group link`
            )
        }

        // split input
        let [songName, groupLink] = q.split(',').map(v => v.trim())

        if (!songName || !groupLink) {
            return reply('❌ Song name or group link missing!')
        }

        if (!groupLink.includes('chat.whatsapp.com/')) {
            return reply('❌ Invalid WhatsApp group link!')
        }

        // requester
        const requester = mek.key.participant || mek.key.remoteJid

        // group jid
        const inviteCode = groupLink.split('chat.whatsapp.com/')[1]
        const groupInfo = await conn.groupGetInviteInfo(inviteCode)
        const groupJid = groupInfo.id

        // search song
        const search = await yts(songName)
        if (!search.videos.length) {
            return reply('❌ Song not found!')
        }

        const video = search.videos[0]
        const ytUrl = video.url

        await reply(`🎧 *Uploading song to group...*\n\n🎵 ${video.title}`)

        // API call (ominisave)
        const apiUrl = `https://ominisave.vercel.app/api/ytmp3_v2?url=${encodeURIComponent(ytUrl)}`
        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json || !json.download) {
            return reply('❌ Download failed from API!')
        }

        const downloadUrl = json.download
        const quality = json.quality || '128kbps'
        const size = json.size || 'Unknown'

        // thumbnail buffer
        const thumbBuffer = await axios.get(video.thumbnail, {
            responseType: 'arraybuffer'
        }).then(res => res.data)

        // caption
        const caption =
`🙋 *Requested by:* @${requester.split('@')[0]}

🎵 *Title:* ${video.title}
👤 *Artist:* ${video.author.name}
⏱️ *Duration:* ${video.timestamp}
👁️ *Views:* ${video.views}

🎚️ *Quality:* 128 kbps
📦 *File Size:* ${size}

🔗 *YouTube:* ${ytUrl}

> © Powered by Sandes Isuranda`

        // send document to group
        await conn.sendMessage(
            groupJid,
            {
                document: { url: downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`,
                jpegThumbnail: thumbBuffer,
                caption: caption,
                mentions: [requester]
            }
        )

        await reply('✅ *Song uploaded to group successfully!* 🎶')

    } catch (e) {
        console.error(e)
        reply('❌ Error while processing your request!')
    }
})
