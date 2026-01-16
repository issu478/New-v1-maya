const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ecE3FZSD#Zsy6O5r6Ps0xYXUHkr2E_ERdqawifS8Yppz_KtauKUs",
ALIVE_IMG : process.env.ALIVE_IMG || "https://upld.zone.id/uploads/d4i0x5iq/logo.webp",
ALIVE_MSG : process.env.ALIVE_MSG || "👋 *Hello, ${pushname}\n I'm alive now 😼 \n Pleace type .menu to see full cammand list . \n © QUEEN-MAYA-MD Is a third party program to improve Your WhatsApp expireance fun and useful.\n 😼 I was created by Sandes isuranda . A talented developer with different inovations . \n QUEEN-MAYA-MD 2025 ♠ All rights ricived ♠ \n > Powered by Sndes isuranda ツ",
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
};
