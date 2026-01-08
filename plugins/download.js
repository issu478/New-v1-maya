const { fetchJson } = require('../lib/functions');
const { cmd } = require('../command');

const yourName = "> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*";
const devDetails = "👨‍💻 Developer : Sandes Isuranda";

/* ================= APK DOWNLOAD ================= */

cmd({
    pattern: "apk",
    alias: ["apkdl"],
    desc: "download android apps (apk)",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("කරුණාකර App එකේ නම ලබා දෙන්න\n\nඋදාහරණ: .apk whatsapp");

        // API එකෙන් දත්ත ලබා ගැනීම
        let data = await fetchJson(
            `https://api.princetechn.com/api/download/apkdl?apikey=prince&appName=${encodeURIComponent(q)}`
        );

        if (!data || !data.result || !data.result.download) {
            return reply("කණගාටුයි, එම APK එක සොයාගත නොහැකි විය ❌");
        }

        await reply("*Processing to Download ...*");

        const caption = `📦 *${data.result.name}*

🧑‍💻 Developer : ${data.result.developer || "Unknown"}
🆕 Version   : ${data.result.version || "Latest"}
📊 Size      : ${data.result.size}

${devDetails}
${yourName}`;

        // ගොනුව යැවීම
        await conn.sendMessage(from, {
            document: { url: data.result.download },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${data.result.name}.apk`,
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("*Error While Downloading*");
    }
});

/* ================= FACEBOOK DOWNLOAD ================= */

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "download facebook videos",
    category: "download",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith("http")) {
            return reply("කරුණාකර Facebook වීඩියෝ ලින්ක් එක ලබා දෙන්න");
        }

        let data = await fetchJson(
            `https://api.princetechn.com/api/download/facebookv2?apikey=prince&url=${encodeURIComponent(q)}`
        );

        if (!data || !data.result) {
            return reply("වීඩියෝව සොයාගත නොහැකි විය ❌");
        }

        await reply("*Downloading Your FB Video...*");

        // HD වීඩියෝව ඇත්නම් එය ප්‍රමුඛතාවය දීම
        let videoUrl = data.result.hd || data.result.sd;
        let quality = data.result.hd ? "HD" : "SD";

        if (videoUrl) {
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: `🎬 Facebook Video (${quality})\n\n${devDetails}\n${yourName}`
            }, { quoted: mek });
        } else {
            reply("බාගත හැකි මට්ටමේ වීඩියෝවක් හමු නොවීය ❌");
        }

    } catch (e) {
        console.error(e);
        reply("FB වීඩියෝව බාගත කිරීමේදී දෝෂයක් සිදු විය ❌");
    }
});
