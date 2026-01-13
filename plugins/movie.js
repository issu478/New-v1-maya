const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { Buffer } = require('buffer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fileType = require("file-type")
const l = console.log
//=============================

cmd({
    pattern: "sinhala",
    desc: "Search and show top Sinhala subtitles for films.",
    react: "🎬",
    category: "movie",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || q.trim() === "") {
            return reply("*⚠️කරුණාකර නමක් ලබා දෙන්න⚠️,(E.g .sinhala spider man)*");
        }

        const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(q)}`;

        const fetchData = async (url, retries = 5) => {
            try {
                const { data } = await axios.get(url);
                return data;
            } catch (error) {
                if (retries === 0) throw error;
                return await fetchData(url, retries - 1);
            }
        };

        const data = await fetchData(searchUrl);

        if (!data || !data.result || data.result.data.length === 0) {
            return reply("⚠️Film එකක් හමු නොවීය, අවුරුද්දත් try කරන්න⚠️");
        }

        const topFilms = data.result.data.slice(0, 20);
        const filmsList = topFilms.map((film, index) =>
            `${index + 1}. 🎬 *${film.title} (${film.year})*`
        ).join("\n\n");

        const msg = `🎥 *MOVIE SINHALA SUB SEARCH*

🔍 *Search:* *${q}*

${filmsList}

> Reply with a number to select movie`;

        const sentMsg = await conn.sendMessage(from, { text: msg }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const newMsg = msgUpdate.messages[0];
            if (!newMsg.message) return;

            const userText =
                newMsg.message.conversation ||
                newMsg.message.extendedTextMessage?.text;

            const isReply =
                newMsg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

            if (!isReply || !/^[0-9]+$/.test(userText)) return;

            const index = parseInt(userText) - 1;
            if (!topFilms[index]) return reply("*❌ නිවැරදි අංකයක් Reply කරන්න*");

            const selectedFilm = topFilms[index];

            const urll = await fetchData(
                `https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${selectedFilm.link}`
            );

            if (!urll?.result?.data) {
                return reply("*❌ Film details සොයාගත නොහැක*");
            }

            const d = urll.result.data;

            // ================= LINKS =================
            const quality1080 = d.dl_links[0]?.link;
            const quality720 = d.dl_links[1]?.link;
            const quality480 = d.dl_links[2]?.link;

            let pp = quality1080?.replace("/u/", "/api/file/");
            let pp1 = quality720?.replace("/u/", "/api/file/");
            let pp2 = quality480?.replace("/u/", "/api/file/");

            // ✅ AUTO 360p (structure unchanged)
            const auto360 =
                d.dl_links.find(v => v.quality?.includes("360")) ||
                d.dl_links[d.dl_links.length - 1];

            let auto360Link = auto360?.link?.replace("/u/", "/api/file/");

            // ================= DETAILS CARD =================
            let detailCard = `╭━━━〔 🎬 *FILM MASTER* 〕━━━╮
┃ 🎥 *Title* : ${d.title}
┃ 📆 *Release* : ${d.date}
┃ ⭐ *IMDb* : ${d.imdbRate}
┃ 🌍 *Country* : ${d.country}
┃ ⏱ *Runtime* : ${d.runtime}
╰━━━━━━━━━━━━━━━━━━╯

📁 *Auto 360p Document Sending…*

> Powered by Sandes MD 🎬✨
> Dev : Sandes-ofc  🐉🍀`;

            await conn.sendMessage(from, {
                image: { url: d.images[0] },
                caption: detailCard
            }, { quoted: mek });

            // ✅ AUTO SEND 360p DOCUMENT (EXTRA)
            if (auto360Link) {
                await conn.sendMessage(from, {
                    document: { url: auto360Link },
                    mimetype: "video/mp4",
                    fileName: `${d.title} - 360p.mp4`,
                    caption: `🎬 *${d.title}*\n📽 Quality : 360p\n\n> Auto Download`
                }, { quoted: mek });
            }

            // ================= MENU (UNCHANGED) =================
            let downloadOptions = `
╭━─━─━─≪✠≫─━─━─━╮  
│ 📌 *Reply with a Number*  
│  
│ 🔹 *Detail Card:*  🏷️ *1.1*  
│ 🔹 *All Images:*  🖼️ *1.2*  
│  
│ 🎥 *Movie Download Options:*  
│   🎬 *2.1* | 🎖️ *480p*  
│   🎬 *2.2* | 🏅 *720p*  
│   🎬 *2.3* | 🏆 *1080p*  
│  
│ ✨ *Powered by Sandes MD* 🎥  
╰━─━─━─≪✠≫─━─━─━╯`;

            const optMsg = await conn.sendMessage(from, { text: downloadOptions }, { quoted: mek });

            conn.ev.on("messages.upsert", async (up) => {
                const mm = up.messages[0];
                if (!mm.message) return;

                const txt =
                    mm.message.conversation ||
                    mm.message.extendedTextMessage?.text;

                const isOptReply =
                    mm.message.extendedTextMessage?.contextInfo?.stanzaId === optMsg.key.id;

                if (!isOptReply) return;

                await conn.sendMessage(from, { react: { text: '⬆️', key: mm.key } });

                if (txt === "2.1" && pp2) {
                    await conn.sendMessage(from, {
                        document: { url: pp2 },
                        mimetype: "video/mp4",
                        fileName: d.title
                    }, { quoted: mm });
                }

                if (txt === "2.2" && pp1) {
                    await conn.sendMessage(from, {
                        document: { url: pp1 },
                        mimetype: "video/mp4",
                        fileName: d.title
                    }, { quoted: mm });
                }

                if (txt === "2.3" && pp) {
                    await conn.sendMessage(from, {
                        document: { url: pp },
                        mimetype: "video/mp4",
                        fileName: d.title
                    }, { quoted: mm });
                }

                if (txt === "1.1") {
                    await conn.sendMessage(from, {
                        image: { url: d.images[0] },
                        caption: d.description
                    }, { quoted: mm });
                }

                if (txt === "1.2") {
                    for (let img of d.images) {
                        await conn.sendMessage(from, { image: { url: img } });
                    }
                }

                await conn.sendMessage(from, { react: { text: '✅', key: mm.key } });
            });
        });

    } catch (e) {
        console.log(e);
        reply("❌ Error occurred");
    }
});
