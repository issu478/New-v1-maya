const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: 'song3',
    desc: 'Download songs using Sadas API',
    react: "🎧",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('*කරුණාකර ගීත නමක් හෝ YouTube link එකක් ලබා දෙන්න!*');

        // ===============================
        // 1. YouTube Search (yt-search)
        // ===============================
        const search = await yts(q.trim());

        if (!search.videos || search.videos.length === 0) {
            return reply("❌ Video එකක් හමුවුණේ නැහැ!");
        }

        const data = search.videos[0];
        const ytUrl = data.url; // ✅ YouTube URL

        // ===============================
        // 2. Sadas API (MP3 Download)
        // ===============================
        const apiUrl = `https://sadaslk-apis.vercel.app/api/v1/download/youtube?q=${encodeURIComponent(ytUrl)}&format=mp3&apiKey=55d63a64ef4f1b7a1fffeb551054e768`;

        const res = await axios.get(apiUrl);
        const downloadUrl = res.data?.result?.download_url || res.data?.result?.url;

        if (!downloadUrl) {
            return reply("❌ Download link එක ලබා ගැනීමට නොහැකි විය!");
        }

        // ===============================
        // 3. Message Caption
        // ===============================
        let caption = `*🎼 QUEEN-MAYA-MD SONG DOWNLOADER ⚙️*

🎵 *TITLE* : ${data.title}
👁️ *VIEWS* : ${data.views}
⏱️ *TIME*  : ${data.timestamp}
📅 *AGO*   : ${data.ago}

*Reply the number bellow👇*

*1️⃣ Audio (Normal)*
*2️⃣ Audio (Document)*

> © Powered by Sandes Isuranda ツ`;

        // ===============================
        // 4. Send Thumbnail + Details
        // ===============================
        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: caption,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363416065371245@newsletter',
                    newsletterName: "QUEEN-MAYA-MD",
                    serverMessageId: 110,
                }
            }
        }, { quoted: mek });

        // ===============================
        // 5. Listen for Reply (1 or 2)
        // ===============================
        const listener = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message?.extendedTextMessage) return;

                const text = msg.message.extendedTextMessage.text.trim();
                const ctx = msg.message.extendedTextMessage.contextInfo;

                if (!ctx || ctx.stanzaId !== sentMsg.key.id) return;

                // Remove listener after use
                conn.ev.off('messages.upsert', listener);

                if (text === '1') {
                    await conn.sendMessage(from, {
                        audio: { url: downloadUrl },
                        mimetype: 'audio/mpeg'
                    }, { quoted: msg });

                } else if (text === '2') {
                    await conn.sendMessage(from, {
                        document: { url: downloadUrl },
                        mimetype: 'audio/mpeg',
                        fileName: `${data.title}.mp3`
                    }, { quoted: msg });

                } else {
                    reply("❌ 1 හෝ 2 කියලා reply කරන්න!");
                }

            } catch (err) {
                console.error(err);
            }
        };

        conn.ev.on('messages.upsert', listener);

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key }});
        reply('දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    }
});
