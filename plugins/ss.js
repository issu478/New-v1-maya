const { fetchJson } = require('../lib/functions')
const { cmd } = require('../command')

const yourName = "> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*"
const devDetails = "👨‍💻 Developer : Sandes Isuranda"

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
            return reply("give me a valid url\n\nexample: .ss https://google.com")

        reply("*Taking Screenshot...*")

        let data = await fetchJson(
            `https://api.princetechn.com/api/tools/ssweb?apikey=prince&url=${encodeURIComponent(q)}`
        )

        if (!data || !data.result || !data.result.screenshot)
            return reply("unable to take screenshot ❌")

        await conn.sendMessage(from, {
            image: { url: data.result.screenshot },
            caption:
`🖼️ Screenshot of : ${q}

${yourName}`
        }, { quoted: mek })

    } catch (e) {
        console.log(e)
        reply("error while taking screenshot ❌")
    }
})
