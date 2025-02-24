import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `${emoji} Por favor ingresa la música que deseas descargar.`;

  const isVideo = /vid|2|mp4|v$/.test(command);
  const search = await yts(text);

  if (!search.all || search.all.length === 0) {
    throw "No se encontraron resultados para tu búsqueda.";
  }

  const videoInfo = search.all[0];
  const body = `「✦」ძᥱsᥴᥲrgᥲᥒძ᥆ *<${videoInfo.title}>*\n\n> ✦ ᥴᥲᥒᥲᥣ » *${videoInfo.author.name || 'Desconocido'}*\n*◆━━━━━━◆✰◆━━━━━━◆*\n> ✰ ᥎іs𝗍ᥲs » *${videoInfo.views}*\n*◆━━━━━━◆✰◆━━━━━━◆*\n> ⴵ ძᥙrᥲᥴі᥆ᥒ » *${videoInfo.timestamp}*\n*◆━━━━━━◆✰◆━━━━━━◆*\n> ✐ ⍴ᥙᑲᥣіᥴᥲძ᥆ » *${videoInfo.ago}*\n*◆━━━━━━◆✰◆━━━━━━◆*\n> 🜸 ᥣіᥒk » ${videoInfo.url}\n`;

  if (command === 'play' || command === 'play2' || command === 'playvid') {
    await conn.sendMessage(m.chat, {
      image: { url: videoInfo.thumbnail },
      caption: body,
      footer: dev,  // Verifica si la variable 'dev' está definida correctamente
      viewOnce: true,
      headerType: 4,
    }, { quoted: fkontak });  // Asegúrate de que 'fkontak' esté definido
    m.react('🕒');

  } else if (command === 'yta' || command === 'ytmp3') {
    m.react(rwait);  // Asegúrate de que 'rwait' esté definido
    let audio;
    try {
      audio = await (await fetch(`https://api.alyachan.dev/api/youtube?url=${videoInfo.url}&type=mp3&apikey=Gata-Dios`)).json();
    } catch (error) {
      console.log("Error en API Alyachan:", error);
      try {
        audio = await (await fetch(`https://delirius-apiofc.vercel.app/download/ytmp3?url=${videoInfo.url}`)).json();
      } catch (error) {
        console.log("Error en API Delirius:", error);
        audio = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${videoInfo.url}`)).json();
      }
    }

    if (!audio.data || !audio.data.url) throw "No se pudo obtener el audio.";
    conn.sendFile(m.chat, audio.data.url, videoInfo.title, '', m, null, { mimetype: "audio/mpeg", asDocument: false });
    m.react(done);  // Asegúrate de que 'done' esté definido

  } else if (command === 'ytv' || command === 'ytmp4') {
    m.react(rwait);
    let video;
    try {
      video = await (await fetch(`https://api.alyachan.dev/api/youtube?url=${videoInfo.url}&type=mp4&apikey=Gata-Dios`)).json();
    } catch (error) {
      console.log("Error en API Alyachan:", error);
      try {
        video = await (await fetch(`https://delirius-apiofc.vercel.app/download/ytmp4?url=${videoInfo.url}`)).json();
      } catch (error) {
        console.log("Error en API Delirius:", error);
        video = await (await fetch(`https://api.vreden.my.id/api/ytmp4?url=${videoInfo.url}`)).json();
      }
    }

    if (!video.data || !video.data.url) throw "No se pudo obtener el video.";
    await conn.sendMessage(m.chat, {
      video: { url: video.data.url },
      mimetype: "video/mp4",
      caption: ``,
    }, { quoted: m });
    m.react(done);  // Asegúrate de que 'done' esté definido

  } else {
    throw "Comando no reconocido.";
  }
};

handler.help = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'play2', 'ytmp3'];
handler.command = ['play', 'playvid', 'ytv', 'ytmp4', 'yta', 'play2', 'ytmp3'];
handler.tags = ['dl'];
handler.register = true;

export default handler;