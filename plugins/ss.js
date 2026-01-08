const { fetchJson } = require('../lib/functions')
const { cmd } = require('../command')
const axios = require('axios')

const yourName = "> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*"

cmd({
    pattern: "ss",
    alias: ["screenshot", "ssweb"],
    desc: "Take website screenshot",
    category: "download",
    react: "🗿",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("http"))
            return reply("Please provide a valid URL\n\nExample: .ss https://google.com")

        reply("*Capturing Screenshot...*")

        let data = await fetchJson(
            `https://api.princetechn.com/api/tools/ssweb?apikey=prince&url=${encodeURIComponent(q)}`
        )

        if (!data || !data.result || !data.result.screenshot)
            return reply("Unable to capture screenshot ❌")

        const imageUrl = data.result.screenshot;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        await conn.sendMessage(from, {
            image: buffer,
            caption: `🖼️ *Screenshot of:* ${q}\n\n${yourName}`
        }, { quoted: mek })

    } catch (e) {
        console.error(e)
        reply("An error occurred while processing the screenshot ❌")
    }
})
