const { cmd } = require('../command')
const axios = require('axios')

// temp memory (per user)
const movieSearchCache = {}


// ===================== MOVIE SEARCH COMMAND =====================
cmd({
  pattern: 'movie',
  desc: 'Search Sinhala Dub Movies',
  react: '🎬',
  category: 'movie',
  filename: __filename
},
async (conn, mek, m, { from, reply, q, sender }) => {
  try {
    if (!q) return reply('*Movie name එකක් දාන්න!*')

    const url = `https://sinhaladubsearch.vercel.app/api/search?text=${encodeURIComponent(q)}`
    const { data } = await axios.get(url)

    if (!data || data.length === 0) {
      return reply('❌ Movie හමු නොවුණා')
    }

    // save results for reply step
    movieSearchCache[sender] = data

    let text = `*🎬 Movie Results For:* _${q}_\n\n`

    data.slice(0, 5).forEach((movie, i) => {
      text += `*${i + 1}. ${movie.title}*\n`
      text += `⭐ ${movie.rating || 'N/A'} | 📅 ${movie.year || 'N/A'}\n\n> Powered By Sandes Isuranda ㋡`
    })

    text += `*Reply with number (1-${data.slice(0,5).length}) to get details*`

    await conn.sendMessage(from, { text }, { quoted: mek })

  } catch (e) {
    console.error(e)
    reply('*Error searching movies!*')
  }
})


// ===================== REPLY HANDLER (1 ➜ DETAILS) =====================
cmd(
{
  on: 'body'
},
async (conn, mek, m, { body, sender, from }) => {
  try {
    // no cached search
    if (!movieSearchCache[sender]) return

    // only accept numbers
    if (!/^[1-5]$/.test(body)) return

    const index = Number(body) - 1
    const movie = movieSearchCache[sender][index]
    if (!movie) return

    // clear cache after selection
    delete movieSearchCache[sender]

    let caption = `*🎬 ${movie.title}*\n\n`
    caption += `📅 Year: ${movie.year || 'N/A'}\n`
    caption += `⭐ Rating: ${movie.rating || 'N/A'}\n\n`
    caption += `📝 ${movie.description || 'No description available'}\n\n`
    caption += `🔗 ${movie.link || 'N/A'} \n\n> Powered By Sandes Isuranda ㋡`

    await conn.sendMessage(
      from,
      {
        image: { url: movie.image },
        caption
      },
      { quoted: mek }
    )

  } catch (e) {
    console.error(e)
  }
})
