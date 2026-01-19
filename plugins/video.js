const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')
cmd({
    pattern: 'video',
    desc: 'download videos',
    react: "🎥",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply('*Please enter a query or a url !*')

        const search = await yts(q)
        const data = search.videos[0]
        const ytUrl = data.url

        let desc = `
*SANDES MD VIDEO DOWNLOADER*
╭──────────────────────●●►
╎📽️ TITLE - ${data.title}
╎👀 VIEWS - ${data.views}
╎⏱️ TIME - ${data.timestamp}
╎📅 AGO - ${data.ago}
╎
╎*Reply This Message With Option*
╎
╎ 01 ❱❱● *Video Normal Fomat*
╎ 02 ❱❱● *Video Document Format*
╎
╰──────────────────────●●►

*Visit* - sandes-ofc.zone.id 

> *Powered By Sandes Isuranda*`

        const vv = await conn.sendMessage(
            from,
            { image: { url: data.thumbnail }, caption: desc },
            { quoted: mek }
        )

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0]
            if (!msg.message?.extendedTextMessage) return

            const selected = msg.message.extendedTextMessage.text.trim()
            const ctx = msg.message.extendedTextMessage.contextInfo

            if (!ctx || ctx.stanzaId !== vv.key.id) return

            // 🔗 OminiSave API
            const apiUrl = `https://ominisave.vercel.app/api/ytmp4?url=${encodeURIComponent(ytUrl)}`
            const res = await axios.get(apiUrl)

            const videoUrl =
                res.data?.url ||
                res.data?.result?.url ||
                res.data?.download_url

            if (!videoUrl) return reply('❌ Download link not found')

            // 🔥 FIX 3 START — download buffer
            const videoRes = await axios.get(videoUrl, {
                responseType: 'arraybuffer'
            })
            const videoBuffer = Buffer.from(videoRes.data)
            // 🔥 FIX 3 END

            if (selected === '1') {
                await conn.sendMessage(
                    from,
                    {
                        video: videoBuffer,
                        mimetype: 'video/mp4',
                        caption: '> *© Powered by Sandes Isuranda*'
                    },
                    { quoted: mek }
                )
            } else if (selected === '2') {
                await conn.sendMessage(
                    from,
                    {
                        document: videoBuffer,
                        mimetype: 'video/mp4',
                        fileName: `${data.title}.mp4`,
                        caption: '> *© Powered by Sandes Isuranda*'
                    },
                    { quoted: mek }
                )
            } else {
                reply('❌ Invalid option')
            }
        })

    } catch (e) {
        console.error(e)
        reply('❌ Error while downloading video')
    }
})
