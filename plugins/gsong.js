const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')
const fetch = require('node-fetch')

const API_KEY = 'd7d14f1bba24e3b13fb93227ed49cfba0dcbc1305e09e43387195015e4111d07'

cmd({
    pattern: 'gsong',
    desc: 'Auto send song to group as document with details',
    react: '🎧',
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q || !q.includes(',')) {
            return reply(
`❌ Usage wrong!

Usage:
.gsong song name , group link`
            )
        }

        // split input
        let [songName, groupLink] = q.split(',').map(v => v.trim())

        if (!songName || !groupLink) {
            return reply('❌ Song name or group link missing!')
        }

        if (!groupLink.includes('chat.whatsapp.com/')) {
            return reply('❌ Invalid group link!')
        }

        // requester
        const requester = mek.key.participant || mek.key.remoteJid

        // get group jid
        const inviteCode = groupLink.split('chat.whatsapp.com/')[1]
        const groupInfo = await conn.groupGetInviteInfo(inviteCode)
        const groupJid = groupInfo.id

        // search song (yt-search)
        const search = await yts(songName)
        if (!search.videos || !search.videos.length) {
            return reply('❌ Song not found!')
        }

        const video = search.videos[0]

        await reply(`🎧 *Uploading song to group...*\n\n🎵 ${video.title}`)

        // NEW YT → MP3 API
        const apiUrl =
`https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/ytapi?apiKey=${API_KEY}&url=${encodeURIComponent(video.url)}&fo=mp3&qu=128`

        const res = await fetch(apiUrl)
        const json = await res.json()

        // SAFE download url detection (FIX)
        let downloadUrl =
            json?.result?.download ||
            json?.result?.url ||
            json?.download ||
            json?.url ||
            json?.data?.download ||
            json?.data?.url

        if (!downloadUrl) {
            console.log('API RESPONSE:', json)
            return reply('❌ Download failed! API response changed.')
        }

        // thumbnail buffer
        const thumbBuffer = await axios.get(video.thumbnail, {
            responseType: 'arraybuffer'
        }).then(res => res.data)

        // caption
        const caption =
`🙋 Requested by @${requester.split('@')[0]}

🎵 *${video.title}*

👤 *Author:* ${video.author.name}
⏱️ *Duration:* ${video.timestamp}
👁️ *Views:* ${video.views}

> © Powered by Sandes Isuranda`

        // send MP3 as DOCUMENT
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

        await reply('✅ *Song uploaded to group successfully!*')

    } catch (e) {
        console.error(e)
        reply('❌ Error while processing your request!')
    }
})
