const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "mediafire",
  alias: ["mf", "mfire"],
  desc: "Download files from MediaFire link",
  react: "📥",
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
    const api = `https://danuz-mediafire-api.vercel.app/api/mediafire?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const json = await res.json();

    // Check if API response is successful
    if (!json.status || !json.urlDownload) {
      return reply("❌ Failed to get download link! Please check the MediaFire URL.");
    }

    const fileUrl = json.urlDownload;
    const fileName = json.fileName || "mediafire_file"; // Fixed: was 'filename', should be 'fileName'
    const fileSize = json.fileSize || "Unknown size";

    await reply(`📥 *Downloading...*\n\n📄 *File:* ${fileName}\n📦 *Size:* ${fileSize}`);

    // Send file
    await conn.sendMessage(from, { 
      document: { url: fileUrl },
      mimetype: 'application/octet-stream',
      fileName: fileName
    }, { quoted: mek });

    await reply("✅ Download complete!");

  } catch (e) {
    console.log(e);
    reply(`❌ Error while downloading!\n\n${e.message}`);
  }
});
