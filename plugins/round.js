const { cmd } = require('../command')

/* =======================
   HIDETAG
======================= */
cmd({
    pattern: 'hidetag',
    desc: 'Tag all members silently',
    category: 'group',
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmins, isOwner, q, participants }) => {
    try {
        if (!isGroup) return reply('❌ Group only command')
        if (!isAdmins && !isOwner) return reply('❌ Admin only command')

        const text = q && q.length > 0 ? q : '📢 Attention everyone'
        const members = participants.map(u => u.id)

        await conn.sendMessage(
            from,
            {
                text: text,
                mentions: members
            },
            { quoted: mek }
        )

        if (isOwner) {
            await conn.sendMessage(from, {
                react: { text: '👑', key: mek.key }
            })
        }

    } catch (e) {
        console.error(e)
        reply('❌ Error in hidetag')
    }
})

/* =======================
   PROMOTE
======================= */
cmd({
    pattern: 'promote',
    desc: 'Promote member to admin',
    category: 'group',
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmins, isOwner, mentionedJid }) => {
    try {
        if (!isGroup) return reply('❌ Group only command')
        if (!isAdmins && !isOwner) return reply('❌ Admin only command')

        const user = mentionedJid[0]
        if (!user) return reply('❌ Mention a user')

        await conn.groupParticipantsUpdate(from, [user], 'promote')

        await conn.sendMessage(
            from,
            {
                text: `✅ @${user.split('@')[0]} promoted to admin`,
                mentions: [user]
            },
            { quoted: mek }
        )

        if (isOwner) {
            await conn.sendMessage(from, {
                react: { text: '👑', key: mek.key }
            })
        }

    } catch (e) {
        console.error(e)
        reply('❌ Error in promote')
    }
})

/* =======================
   DEMOTE
======================= */
cmd({
    pattern: 'demote',
    desc: 'Demote admin to member',
    category: 'group',
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmins, isOwner, mentionedJid }) => {
    try {
        if (!isGroup) return reply('❌ Group only command')
        if (!isAdmins && !isOwner) return reply('❌ Admin only command')

        const user = mentionedJid[0]
        if (!user) return reply('❌ Mention a user')

        await conn.groupParticipantsUpdate(from, [user], 'demote')

        await conn.sendMessage(
            from,
            {
                text: `❌ @${user.split('@')[0]} demoted from admin`,
                mentions: [user]
            },
            { quoted: mek }
        )

        if (isOwner) {
            await conn.sendMessage(from, {
                react: { text: '👑', key: mek.key }
            })
        }

    } catch (e) {
        console.error(e)
        reply('❌ Error in demote')
    }
})
