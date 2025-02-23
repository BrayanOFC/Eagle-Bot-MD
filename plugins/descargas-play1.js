import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error('⚠️ Formato no soportado. Usa /play (audio) o /play2 (video).');
    }

    const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    
    try {
      const response = await axios.get(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });

      if (response.data?.success) {
        const { id, title, info } = response.data;
        return {
          id,
          title,
          image: info.image,
          downloadUrl: await ddownr.cekProgress(id),
        };
      } else {
        throw new Error('⚠️ No se pudo obtener los detalles del video.');
      }
    } catch (error) {
      console.error('❌ Error en la descarga:', error.message);
      throw error;
    }
  },
  cekProgress: async (id) => {
    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    try {
      while (true) {
        const response = await axios.get(progressUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });

        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('❌ Error en el progreso de descarga:', error.message);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '⚠️ Ingresa el nombre de la música a descargar.', m);
    }

    const search = await yts(text);
    if (!search.all?.length) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const formattedViews = formatViews(views);

    const infoMessage = `🎶 *Descargando:* *${title}*\n\n📌 *Canal:* ${videoInfo.author.name || 'Desconocido'}\n👀 *Vistas:* ${formattedViews}\n⏳ *Duración:* ${timestamp}\n📅 *Publicado:* ${ago}\n🔗 *Link:* ${url}`;
    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: 'Kirito-Bot',
          body: 'By Deylin',
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (command === 'play' || command === 'yta' || command === 'ytmp3') {
      try {
        const api = await ddownr.download(url, 'mp3');
        if (!api.downloadUrl) throw new Error('No se encontró un enlace de descarga válido.');

        await conn.sendMessage(m.chat, { 
          audio: { url: api.downloadUrl }, 
          mimetype: "audio/mpeg" 
        }, { quoted: m });
      } catch (error) {
        console.error('❌ Error en descarga MP3:', error.message);
        return conn.reply(m.chat, '⚠️ No se pudo descargar el audio.', m);
      }

    } else if (command === 'play2' || command === 'ytv' || command === 'ytmp4') {
      try {
        const apiUrl = `https://exonity.tech/api/dl/ytmp4?url=${url}&apikey=ex-290e8d524d`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.result?.dl) throw new Error('No se encontró un enlace de descarga válido.');

        await conn.sendMessage(m.chat, {
          video: { url: json.result.dl },
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
          caption: '',
          thumbnail: thumb
        }, { quoted: m });

      } catch (error) {
        console.error('❌ Error en descarga MP4:', error.message);
        return conn.reply(m.chat, '⚠️ No se pudo descargar el video.', m);
      }
    } else {
      throw "⚠️ Comando no reconocido.";
    }
  } catch (error) {
    console.error('❌ Error general:', error.message);
    return conn.reply(m.chat, `⚠️ Ocurrió un error: ${error.message}`, m);
  }
};

handler.command = ['ytmp3', 'yta', 'ytmp4', 'ytv'];
handler.tags = ['downloader'];
handler.group = true;
handler.register = true;

export default handler;

function formatViews(views) {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + 'M (' + views.toLocaleString() + ')';
  if (views >= 1_000) return (views / 1_000).toFixed(1) + 'k (' + views.toLocaleString() + ')';
  return views.toString();
}



///////////////////////////////////////////



import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠ Formato no soportado, elige uno de la lista disponible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data?.success) {
        const { id, title, info } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return { id, title, image: info.image, downloadUrl };
      } else {
        throw new Error("⛔ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data?.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      throw error;
    }
  }
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, "⚔️ *Kirito-Bot* | Ingresa el nombre de la canción que deseas buscar.", m);
    }

    const search = await yts(text);
    if (!search.all.length) {
      return m.reply("⚠ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail))?.data;

    const infoMessage = `🖤 *Kirito-Bot - Descargas* 🖤\n\n` +
      `🎶 *Título:* ${title}\n` +
      `⏳ *Duración:* ${timestamp}\n` +
      `👁 *Vistas:* ${vistas}\n` +
      `📺 *Canal:* ${videoInfo.author.name || "Desconocido"}\n` +
      `📅 *Publicado:* ${ago}\n` +
      `🔗 *Enlace:* ${url}`;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: "Kirito-Bot",
          body: "Tu asistente en el mundo virtual",
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, { audio: { url: api.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });

    } else if (["play2", "ytv", "ytmp4"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "⚔ Aquí tienes tu video descargado por *Kirito-Bot* ⚔",
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`⚠ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply("⛔ *Error:* No se encontró un enlace de descarga válido.");
      }
    } else {
      throw "❌ Comando no reconocido.";
    }
  } catch (error) {
    return m.reply(`⚠ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  return views >= 1000 ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")" : views.toString();
}