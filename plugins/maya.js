const { cmd } = require('../command');
const axios = require("axios");

const GEMINI_API_KEY = 'AIzaSyBdBivCo6jWSchTb8meP7VyxbHpoNY_qfQ';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

cmd({
    pattern: "mayaai",
    alias: ["queenai", "ai"],
    desc: "Talk with Queen-Maya-MD AI",
    category: "AI",
    react: "🫣",
    filename: __filename
},
async (
    conn, mek, m, 
    { reply, args }
) => {

    try {
        // Get user message
        const q =
            args.join(" ") ||
            (m.mtype === "imageMessage" && m.message?.imageMessage?.caption) ||
            (m.mtype === "videoMessage" && m.message?.videoMessage?.caption) ||
            "";

        if (!q.trim()) {
            return reply("📌 *Queen-Maya-MD AI එකෙන් අහන්න තියෙන දේක් කියන්න*");
        }

        // Custom prompt
        const prompt = `
ඔබ සැබෑ ගැහැණු ළමයෙකු සේ හැසිරෙන්න.  
User emoji දාලා ඇනුවොත් ඔයාවත් emoji වලින් පමණක් reply කරන්න.  
Emoji නැත්නම් සාමාන්‍ය Sinhala text.  
ඔබේ reply 100 අකුරකින් අඩු විය යුතුය.  

*Reply කරන්න එපා:*  
ආයුබෝවන්, කොහොමද?, කතාවන්?, ද, ?  

ඔයාගේ නම: Queen-Maya-MD AI  
Developer: Sandes Isuranda  

User Message: ${q}
`;

        // Send to Gemini API
        const response = await axios.post(
            GEMINI_API_URL,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { "Content-Type": "application/json" } }
        );

        const ai =
            response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            null;

        if (!ai) return reply("⚠️ *AI Error — Try Again!*");

        return reply(ai);

    } catch (err) {
        console.error("Gemini Error:", err?.response?.data || err);
        return reply("❌ *AI Connection Error*");
    }
});
