const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "vddAwTwS#u2DNQm-3R6fzPvUYmULZ3r3hsrWJ5wWrWlM6BHv3MQk",
ALIVE_IMG : process.env.ALIVE_IMG || "https://files.catbox.moe/4bc81k.png",
ALIVE_MSG : process.env.ALIVE_MSG || "*👋 ℍ𝔼𝕃𝕃𝕆 𝕋ℍ𝔼ℝ𝔼 𝕀'𝕄 𝔸𝕃𝕀𝕍𝔼 ℕ𝕆𝕎 ,👑 ℚ𝕌𝔼𝔼ℕ 𝕄𝔸𝕐𝔸 𝕄𝔻 𝕎𝕙𝕒𝕥𝕤𝔸𝕡𝕡 𝕓𝕠𝕥 *\n*𝕋𝕐ℙ𝔼.𝕄𝔼ℕ𝕌 𝕋𝕆 𝔹𝔼𝔾𝕀ℕ𝔾 *\n*⚖️𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 - : ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
