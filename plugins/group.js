// file: group.js
const { cmd } = require('../command');

//
// ADD MEMBER
//
cmd({
  pattern: 'add',
  desc: 'Add member to group',
  react: '➕',
  category: 'group',
  filename: __filename
}, 
async (conn, mek, m, { from, reply, args }) => {
  try {
    if (!m.isGroup) return reply('❌ *Group command only!*');
    if (!args[0]) return reply('📌 *Enter number!* Example: .add 94771234567');

    const num = args[0].replace(/[^0-9]/g, '');
    await conn.groupParticipantsUpdate(from, [`${num}@s.whatsapp.net`], 'add');
    reply(`✅ Added: ${num}`);

  } catch (e) {
    reply('❌ Failed to add!');
  }
});

//
// KICK MEMBER
//
cmd({
  pattern: 'kick',
  desc: 'Kick member from group',
  react: '❌',
  category: 'group',
  filename: __filename
},
async (conn, mek, m, { from, reply, mention }) => {
  try {
    if (!m.isGroup) return reply('❌ *Group command only!*');
    const target = mention[0];

    if (!target) return reply('📌 *Tag user to kick!*');

    await conn.groupParticipantsUpdate(from, [target], 'remove');
    reply(`🚮 Kicked`);

  } catch (e) {
    reply('❌ Failed to kick!');
  }
});

//
// TAGALL
//
cmd({
  pattern: 'tagall',
  alias: ['tag'],
  desc: 'Tag all group members',
  react: '📢',
  category: 'group',
  filename: __filename
},
async (conn, mek, m, { from, reply, participants }) => {
  if (!m.isGroup) return reply('❌ *Group command only!*');

  let msg = `📢 *TAG ALL*\n\n`;
  let tags = [];

  participants.forEach((p) => {
    msg += `@${p.id.split('@')[0]}\n`;
    tags.push(p.id);
  });

  await conn.sendMessage(from, { text: msg, mentions: tags });
});

//
// MUTE GROUP
//
cmd({
  pattern: 'mute',
  desc: 'Mute group (admins only)',
  react: '🔒',
  category: 'group',
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    if (!m.isGroup) return reply('❌ *Group only!*');

    await conn.groupSettingUpdate(from, 'announcement');
    reply('🔒 *Group Muted (admins only)*');

  } catch (e) {
    reply('❌ Failed to mute!');
  }
});

//
// UNMUTE GROUP
//
cmd({
  pattern: 'unmute',
  desc: 'Unmute group',
  react: '🔓',
  category: 'group',
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    if (!m.isGroup) return reply('❌ *Group only!*');

    await conn.groupSettingUpdate(from, 'not_announcement');
    reply('🔓 *Group Unmuted!*');

  } catch (e) {
    reply('❌ Failed to unmute!');
  }
});
