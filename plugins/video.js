const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require('axios')

cmd({
    pattern: "video",
    desc: "Download YouTube video 360p",
    react: "🎥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❌ *YouTube link or search query ekak denna*")

        // 🔍 Search video
        const search = await yts(q)
        const video = search.videos[0]
        if (!video) return reply("❌ *Video not found*")

        const url = video.url

        // ⏳ Downloading message
        await reply("⬇️ *Downloading your video... Please wait*")

        // 🎥 MP4 API (360p)
        const apiUrl = `https://ominisave.vercel.app/api/ytmp4?url=${url}`
        const res = await axios.get(apiUrl)
        const data = res.data

        if (!data || !data.download) {
            return reply("❌ *Video download failed*")
        }

        const caption = ` 🔥 * SANDES MD YOUTUBE VIDEO DOWNLOADER*

📌 *Title* : ${video.title}
👤 *Author* : ${video.author.name}
👁️ *Views* : ${video.views}
❤️ *Likes* : ${video.likes || "N/A"}
⏱️ *Duration* : ${video.timestamp}

> *Powered By Sandes Isuranda ツ*`

        // 📤 Send video
        await conn.sendMessage(from, {
            video: { url: data.download },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply("❌ *Error while downloading video*")
    }
})
