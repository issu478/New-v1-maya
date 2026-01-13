const { cmd } = require('../command')
const axios = require('axios')

cmd({
    pattern: 'npm',
    desc: 'NPM package search',
    react: '📦',
    category: 'search',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('❌ Package name missing ')

        const res = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(q)}&size=1`)
        const pkg = res.data.objects[0]?.package
        if (!pkg) return reply('❌ Package not found')

        const menu = `*📦 NPM PACKAGE SEARCH*

📦 *Name*     : ${pkg.name}
🧑‍💻 *Author* : ${pkg.author?.name || 'Unknown'}
📅 *Version*  : ${pkg.version}
📝 *Desc*     : ${pkg.description}
🔗 *NPM URL*  : ${pkg.links.npm}

*Reply with number 👇*

1️⃣ Open NPM Page  
2️⃣ Open GitHub Repo  

> Powered by Sandes Isuranda`

        const sent = await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/4pmdgt.jpeg' },
            caption: menu
        }, { quoted: mek })

        const handler = async (up) => {
            const msg = up.messages[0]
            if (!msg.message?.extendedTextMessage) return

            const text = msg.message.extendedTextMessage.text.trim()
            const ctx = msg.message.extendedTextMessage.contextInfo
            if (!ctx || ctx.stanzaId !== sent.key.id) return

            conn.ev.off('messages.upsert', handler)

            if (text === '1') {
                reply(`🔗 ${pkg.links.npm}`)
            } 
            else if (text === '2') {
                if (!pkg.links.repository) return reply('❌ GitHub repo not available')
                reply(`🐙 ${pkg.links.repository}`)
            } 
            else {
                reply('❌ 1 / 2 කියලා reply කරන්න')
            }
        }

        conn.ev.on('messages.upsert', handler)

    } catch (e) {
        console.error(e)
        reply('❌ NPM search error')
    }
})
