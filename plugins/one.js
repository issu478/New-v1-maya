const { cmd } = require('../command')

//================ PING =================
cmd({
    pattern: "ping",
    desc: "Check bot response speed",
    react: "🚀",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
try {

    const start = new Date().getTime()
    const msg = await conn.sendMessage(
        from,
        { text: "```Pinging...```" },
        { quoted: mek }
    )
    const end = new Date().getTime()

    await conn.edit(
        msg,
        `*Pong! ${end - start} ms*`
    )

} catch (e) {
    console.log(e)
}
})


//================ OWNER =================
cmd({
    pattern: "owner",
    desc: "Get bot owner contact",
    react: "🔥",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
try {

    // 📇 OWNER CONTACT
    await conn.sendMessage(from, {
        contacts: {
            displayName: "Sandes Isuranda",
            contacts: [{
                vcard: `BEGIN:VCARD
VERSION:3.0
FN:Sandes Isuranda
ORG:SANDES MD OWNER;
TEL;type=CELL;type=VOICE;waid=94716717099:+94 71 671 7099
END:VCARD`
            }]
        }
    }, { quoted: mek })

    // 🖼 OWNER DETAILS CARD
    let ownerText = `
👑 *BOT OWNER DETAILS*
╔═══════════════════✦
║
║ ✭ Name   : *Sandes Isuranda*
║ ✭ Number : *+94 71 671 7099*
║ ✭ Role   : *Developer / Owner*
║ ✭ Bot    : *SANDES MD*
║ ✭ Official web : https://www.movanest.xyz/2dXLMY.html
║
╚═════════════════════✦
`

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/6ib761.png" }, // owner image
        caption: ownerText
    }, { quoted: mek })

} catch (e) {
    console.log(e)
}
})
