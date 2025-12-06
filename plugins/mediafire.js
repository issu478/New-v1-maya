// file: mediafire.js
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "mediafire",
  alias: ["mf", "mfire"],
  desc: "Download files from MediaFire link",
  react: "📚",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!args[0]) {
      return reply("📌 *Use:* .mediafire <mediafire link>");
    }

    let url = args[0];

    // API Call
    const api = `https://danuz-mediafire-api.vercel.app/api/mediafire?url=${url}`;

    const res = await fetch(api);
    const json = await res.json();

    if (!json.urlDownload) {
      return reply("Failed to get download link ❌");
    }

    const fileUrl = json.urlDownload;
    const fileName = json.filename || "mediafire_file";

    reply(`📥 *Downloading...*\n📄 File: ${fileName}\n\n> Powered by Sandes Isuranda `);

    // Send file
    await conn.sendMessage(from, { 
      document: { url: fileUrl },
      mimetype: 'application/octet-stream',
      fileName: fileName
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply("❌ Error while downloading!");
  }
});
