const { cmd } = require('../command')
const axios = require('axios')
const FormData = require('form-data')

cmd({
    pattern: 'tourl',
    desc: 'Upload media to catbox and get URL',
    category: 'tools',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // must reply to a media
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage
        if (!quoted) return reply('❌ Reply to an image / video / audio')

        // detect media type
        let mediaType
        if (quoted.imageMessage) mediaType = 'image'
        else if (quoted.videoMessage) mediaType = 'video'
        else if (quoted.audioMessage) mediaType = 'audio'
        else if (quoted.documentMessage) mediaType = 'document'
        else return reply('❌ Unsupported media type')

        // download media
        const buffer = await conn.downloadMediaMessage(
            {
                message: quoted,
                key: {
                    remoteJid: from,
                    id: mek.key.id
                }
            }
        )

        if (!buffer) return reply('❌ Failed to download media')

        // prepare form
        const form = new FormData()
        form.append('reqtype', 'fileupload')
        form.append('fileToUpload', buffer, {
            filename:
                mediaType === 'image' ? 'image.jpg' :
                mediaType === 'video' ? 'video.mp4' :
                mediaType === 'audio' ? 'audio.mp3' :
                'file.bin'
        })

        // upload to catbox
        const res = await axios.post(
            'https://catbox.moe/user/api.php',
            form,
            { headers: form.getHeaders() }
        )

        const url = res.data?.trim()
        if (!url.startsWith('http'))
            return reply('❌ Upload failed')

        // reply with url
        await reply(
`File Upload success !
🔗 URL: 
${url}
> Powered By Sandes Isuranda `
        )

    } catch (e) {
        console.error(e)
        reply('❌ Error while uploading')
    }
})
