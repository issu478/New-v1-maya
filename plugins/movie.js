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
            return reply('*❌ SinhalaSub Movie URL එකක් ලබා දෙන්න*\n\nExample:\n.movie https://sinhalasub.lk/movies/xxxxx')
        }

        const apiUrl = `https://sadaslk-apis.vercel.app/api/v1/movie/sinhalasub/infodl?q=${encodeURIComponent(q)}&apiKey=55d63a64ef4f1b7a1fffeb551054e768`
        const res = await axios.get(apiUrl)
        
        // API response එක ලැබෙනවාදැයි පරීක්ෂාව
        if (!res.data || !res.data.result) {
            return reply('❌ දත්ත සොයාගත නොහැක. කරුණාකර පසුව උත්සාහ කරන්න.')
        }

        const data = res.data.result

        // Download link එක පරීක්ෂා කිරීම
        if (!data.download || data.download.length === 0) {
            return reply('❌ මෙම චිත්‍රපටය සඳහා Download Links සොයාගත නොහැක.')
        }

        const download = data.download.find(v => v.quality?.includes('360')) || data.download[0]

        if (!download?.url) return reply('❌ Download link එක ක්‍රියා විරහිතයි.')

        const caption = `╭━━━〔 🎬 *QUEEN MAYA MD* 〕━━━╮
┃ 🎥 *Movie* : ${data.title}
┃ ⭐ *IMDb* : ${data.imdb || 'N/A'}
┃ 📅 *Year* : ${data.year || 'N/A'}
┃ ⏱ *Duration* : ${data.runtime || 'N/A'}
┃ 🎭 *Genre* : ${data.genre || 'N/A'}
┃ 🌐 *Language* : Sinhala Sub
┃ 📽 *Quality* : ${download.quality || '360p'}
╰━━━━━━━━━━━━━━━━━━╯

📁 *ඔබේ චිත්‍රපටය Upload වෙමින් පවතී...*

> © Powered by Sandes Isuranda ツ`

        await conn.sendMessage(from, {
            image: { url: data.image || data.pix },
            caption: caption
        }, { quoted: mek })

        await conn.sendMessage(from, {
            document: { url: download.url },
            mimetype: 'video/mp4',
            fileName: `${data.title}.mp4`
        }, { quoted: mek })

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } })

    } catch (e) {
        console.error(e)
        reply('❌ Error: සම්බන්ධතාවය බිඳ වැටුණි. නැවත උත්සාහ කරන්න.')
    }
})
