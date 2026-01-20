const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers
} = require('@whiskeysockets/baileys')

const { getBuffer, getGroupAdmins, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const { sms } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const express = require("express")

const prefix = '.'
const ownerNumber = ['94716717099'] // 👾 react ONLY this number

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add SESSION_ID env !!')
    const filer = File.fromURL(`https://mega.nz/file/${config.SESSION_ID}`)
    filer.download((err, data) => {
        if (err) throw err
        fs.writeFileSync(__dirname + '/auth_info_baileys/creds.json', data)
        console.log("Session downloaded ✅")
    })
}

const app = express()
const port = process.env.PORT || 8000

//==========================================================
async function connectToWA() {
    console.log("🧬 Connecting QUEEN-MAYA-MD ...")

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
    const { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    })

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'connecting') {
            console.log("⏳ Connecting to WhatsApp servers...")
        }

        if (connection === 'close') {
            console.log("❌ Connection closed, reconnecting...")
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                connectToWA()
            }
        }

        if (connection === 'open') {
            console.log("✅ QUEEN-MAYA-MD CONNECTED SUCCESSFULLY")

            // load plugins
            const path = require('path')
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require("./plugins/" + plugin)
                }
            })
            console.log("🔌 Plugins installed successfully")

            // send connect message to owner
            const up = `🪀 *QUEEN-MAYA-MD CONNECTED* 🔥

✒️ PREFIX : ${prefix}
👨‍💻 OWNER : Sandes Isuranda
⚙️ VERSION : 1.0.0

> Powered by Sandes Isuranda ㋡`
            await conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", { text: up })
        }
    })

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0]
        if (!mek.message) return

        mek.message = (getContentType(mek.message) === 'ephemeralMessage')
            ? mek.message.ephemeralMessage.message
            : mek.message

        const m = sms(conn, mek)
        const type = getContentType(mek.message)
        const from = mek.key.remoteJid

        const body =
            (type === 'conversation') ? mek.message.conversation :
            (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
            (type === 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption :
            (type === 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : ''

        const isCmd = body.startsWith(prefix)
        const args = body.trim().split(/ +/).slice(1)
        const q = args.join(' ')

        const sender = mek.key.fromMe
            ? conn.user.id.split(':')[0] + '@s.whatsapp.net'
            : (mek.key.participant || mek.key.remoteJid)

        const senderNumber = sender.split('@')[0]

        //=========== AUTO 👾 REACT (ONLY 94716717099) ===========
        if (
            !mek.key.fromMe &&
            !mek.message?.reactionMessage &&
            senderNumber === '94716717099'
        ) {
            try {
                await conn.sendMessage(from, {
                    react: { key: mek.key, text: "👾" }
                })
            } catch (e) {
                console.log("React error:", e)
            }
        }
        //=======================================================

        const events = require('./command')
        if (isCmd) {
            const cmdName = body.slice(prefix.length).trim().split(" ")[0].toLowerCase()
            const cmd = events.commands.find(
                c => c.pattern === cmdName || (c.alias && c.alias.includes(cmdName))
            )
            if (cmd) {
                if (cmd.react) {
                    await conn.sendMessage(from, {
                        react: { text: cmd.react, key: mek.key }
                    })
                }
                try {
                    cmd.function(conn, mek, m, { from, body, args, q, sender, senderNumber })
                } catch (err) {
                    console.log("PLUGIN ERROR:", err)
                }
            }
        }
    })
}

app.get("/", (req, res) => res.send("Bot started ✅"))
app.listen(port, () => console.log(`🌐 Server running on http://localhost:${port}`))

setTimeout(connectToWA, 4000)
