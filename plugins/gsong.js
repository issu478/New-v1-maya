const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')
const fetch = require('node-fetch')

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

        await reply(`🎧 *Uploading song to group...*\n\n🎵 ${video.title}`)

        // get mp3
        const res = await fetch(
            `http://vpn.asitha.top:3000/api/ytmp3?url=${video.url}`
        )
        const json = await res.json()

        if (!json.result || !json.result.download) {
            return reply('❌ Download failed!')
        }

        const downloadUrl = json.result.download

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

        // send document to group
        await conn.sendMessage(
            groupJid,
            {
                document: { url: downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: video.title + '.mp3',
                jpegThumbnail: thumbBuffer,
                caption: caption,
                mentions: [requester]
            }
        )

        await reply('*Song uploaded to group successfully!* ')

    } catch (e) {
        console.error(e)
        reply('❌ Error while processing your request!')
    }
})
