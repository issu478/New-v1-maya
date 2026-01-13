const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: 'movie',
    desc: 'Auto download SinhalaSub movie (360p)',
    react: "🎬",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q || !q.startsWith('http')) {
            return reply('*❌ SinhalaSub Movie URL එකක් දාන්න*\n\nExample:\n.movie https://sinhalasub.lk/movies/xxxxx')
        }

        const apiUrl = `https://sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/infodl?q=${encodeURIComponent(q)}&apiKey=55d63a64ef4f1b7a1fffeb551054e768`
        const res = await axios.get(apiUrl)
        const data = res.data.result

        if (!data) return reply('❌ Movie details not found')

        // 360p link (fallback first link)
        const download =
            data.download.find(v => v.quality?.includes('360')) ||
            data.download[0]

        if (!download?.url) return reply('❌ Download link not found')

        const caption = `╭━━━〔 🎬 *QUEEN MAYA MD* 〕━━━╮
┃ 🎥 *Movie* : ${data.title}
┃ ⭐ *IMDb* : ${data.imdb || 'N/A'}
┃ 📅 *Year* : ${data.year || 'N/A'}
┃ ⏱ *Duration* : ${data.runtime || 'N/A'}
┃ 🎭 *Genre* : ${data.genre || 'N/A'}
┃ 🌐 *Language* : Sinhala Sub
┃ 📽 *Quality* : 360p
╰━━━━━━━━━━━━━━━━━━╯

📁 *Downloading...*

> © Powered by Sandes Isuranda ツ`

        // Details Card
        await conn.sendMessage(
            from,
            {
                image: { url: data.image },
                caption: caption
            },
            { quoted: mek }
        )

        // Auto send document
        await conn.sendMessage(from, {
            document: { url: download.url },
            mimetype: 'video/mp4',
            fileName: `${data.title} - 360p.mp4`
        })

        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } })

    } catch (e) {
        console.log(e)
        reply('❌ Error occurred while downloading movie')
    }
})
