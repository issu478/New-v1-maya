const {cmd , commands} = require('../command')
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: 'song3',
    desc: 'download songs using sadas api',
    react: "🎧",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply('*කරුණාකර නමක් හෝ Link එකක් ලබා දෙන්න!*');

        // 1. YouTube Search කිරීම (yt-search භාවිතයෙන් වීඩියෝව සොයාගැනීම)
        const search = await yts(q.trim());
        const data = search.videos[0];
        if (!data) return reply("❌ වීඩියෝව සොයාගත නොහැකි විය!");

        const sUrl = data.url;

        // 2. Sadas API එක භාවිතයෙන් Download Link එක ලබා ගැනීම
        // මෙහිදී encodeURIComponent භාවිත කරන්නේ URL එකේ ඇති විශේෂ අක්ෂර නිසා API එකේ දෝෂ ඇතිවීම වැළැක්වීමටයි.
        const apiUrl = `https://sadaslk-apis.vercel.app/api/v1/download/youtube?q=${encodeURIComponent(sUrl)}&format=mp3&apiKey=55d63a64ef4f1b7a1fffeb551054e768`;
        
        const response = await axios.get(apiUrl);
        
        // API එකෙන් ලැබෙන ප්‍රතිචාරය අනුව Link එක වෙන් කර ගැනීම
        const downloadUrl = response.data.result?.download_url || response.data.result?.url;

        if (!downloadUrl) return reply("❌ Download link එක ලබා ගැනීමට නොහැකි විය.");

        let desc = `*🎼 QUEEN-MAYA-MD SONG DOWNLOADER . .⚙️*

🎼⚙️ TITLE - ${data.title}
🎼⚙️ VIEWS - ${data.views}
🎼⚙️ TIME - ${data.timestamp}
🎼⚙️ AGO - ${data.ago}

*🔢Reply the number bellow🗿*

*1. Audio (Normal File)*
*2. Audio (Document File)*

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*`;

        const thumbnailBuffer = (await axios.get(data.thumbnail, { responseType: 'arraybuffer' })).data;
		
        let contextInfo = {
            externalAdReply: {
                title: 'QUEEN-MAYA-MD SONG DOWNLOADER',
                body: data.title,
                previewType: "PHOTO",
                thumbnail: thumbnailBuffer,
                sourceUrl: "https://whatsapp.com/channel/0029VbAEkzNFi8xevDsbJS1L", 
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };
		
        // මුලින්ම Thumbnail එක සහ විස්තරය යැවීම
        const vv = await conn.sendMessage(from, {
            image: { url: data.thumbnail }, 
            caption: desc,   
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

        // 3. පරිශීලකයාගේ Reply එක (1 හෝ 2) හඳුනාගෙන අදාළ ගොනුව යැවීම
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                        await conn.sendMessage(from, {
                            audio: { url: downloadUrl },
                            mimetype: 'audio/mpeg',
                            contextInfo
                        }, { quoted: msg });
                        break;

                    case '2':
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: 'audio/mpeg',
                            fileName: data.title + ".mp3",
                            contextInfo
                        }, { quoted: msg });
                        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key }});
                        break;
                }
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key }});
        reply('දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    }
});
