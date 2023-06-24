/**  Copyright (C) 2023. 
  Licensed under the  GPL-3.0 License; 
  You may not use this file except in compliance with the License. 
  It is supplied in the hope that it may be useful. 
  * @project_name : Blue_Lion_Bot 
  * @author : nipuna rangana
  * @description : Blue-Lion,A Multi-functional whatsapp bot. 
  * @version 0.0.6 **/

const { tlang, ringtone, cmd,fetchJson, sleep, botpic,ffmpeg, getBuffer, pinterest, prefix, Config } = require('../lib')
const { mediafire } = require("../lib/mediafire.js");
const cheerio = require('cheerio');
const fbInfoVideo = require('fb-info-video');
const request = require('request');
const axios= require('axios');
const googleTTS = require("google-tts-api");
const ytdl = require('ytdl-secktor')
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
var dlsize = 1000 // 1000mb
//---------------------------------------------------------------------------
async function tiktokdl (url) {
    const gettoken = await axios.get("https://tikdown.org/id");
    const $ = cheerio.load(gettoken.data);
    const token = $("#download-form > input[type=hidden]:nth-child(2)").attr("value");
    const param = {
        url: url,
        _token: token,
    };
    const { data } = await axios.request("https://tikdown.org/getAjax?", {
        method: "post",
        data: new URLSearchParams(Object.entries(param)),
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "user-agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
        },
    });
    var getdata = cheerio.load(data.html);
    if (data.status) {
        return {
            status: true,
            thumbnail: getdata("img").attr("src"),
            video: getdata("div.download-links > div:nth-child(1) > a").attr("href"),
            audio: getdata("div.download-links > div:nth-child(2) > a").attr("href"),
        };
    } else return { status: false };
};

//---------------------------------------------------------------------------

cmd({
            pattern: "facebook",
	    alias :  ['fb','fbdl'],
            desc: "Downloads fb videos  .",
            category: "downloader",
            filename: __filename,
            use: '<add fb url.>'
        },

        async(Void, citel, text) => {
if(!text) return citel.reply(`*_Please Give me Facebook Video Url_*`);
fbInfoVideo.getInfo(text)
  .then(info =>{
let vurl=info.video.url_video;

      let data  ="*Video Name     :* "+  info.video.title;
          data +="\n*Video Views    :* "+  info.video.view;
          data +="\n*Video Comments :* "+  info.video.comment;
          data +="\n*Video Likes    :* "+info.video.reaction.Like ;
  
                        let buttonMessage = {
                        video: {url:vurl},
                        mimetype: 'video/mp4',
                        fileName: info.video.title+`.mp4`,
                        caption :"     *FACEBOOK DOWNLOADER*  \n"+data
                        
                    }
                 Void.sendMessage(citel.chat, buttonMessage, { quoted: citel });



})
  .catch(err =>{
            citel.reply("Error, Video Not Found\n *Please Give Me A Valid Url*");
            console.error(err);
          })
 })

//---------------------------------------------------------------------------

cmd({
            pattern: "tiktok",
	          alias :  ['tt','ttdl'],
            desc: "Downloads Tiktok Videos Via Url.",
            category: "downloader",
            filename: __filename,
            use: '<add tiktok url.>'
        },

        async(Void, citel, text) => {
 if(!text) return await citel.reply(`*Uhh Please, Provide me tiktok Video Url*\n*_Ex .tiktok https://www.tiktok.com/@dakwahmuezza/video/7150544062221749531_*`);
 let txt = text ? text.split(" ")[0]:'';
 if (!/tiktok/.test(txt)) return await citel.reply(`*Uhh Please, Give me Valid Tiktok Video Url!*`);
 const { status ,thumbnail, video, audio } = await tiktokdl(txt)
 //console.log("url : " , video  ,"\nThumbnail : " , thumbnail ,"\n Audio url : " , audio )
 if (status) return await Void.sendMessage(citel.chat, {video : {url : video } ,  } , {quoted : citel });
 else return await citel.reply("Error While Downloading Your Video") 
})
    //---------------------------------------------------------------------------
cmd({
            pattern: "tts",
            desc: "text to speech.",
            category: "downloader",
            filename: __filename,
            use: '<Hii,this is Secktor>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply('Please give me Sentence to change into audio.')
            let texttts = text
            const ttsurl = googleTTS.getAudioUrl(texttts, {
                lang: "en",
                slow: false,
                host: "https://translate.google.com",
            });
            return Void.sendMessage(citel.chat, {
                audio: {
                    url: ttsurl,
                },
                mimetype: "audio/mpeg",
                fileName: `ttsCitelVoid.m4a`,
            }, {
                quoted: citel,
            });
        }

    )
//---------------------------------------------------------------------------
cmd({
            pattern: "apk",
            desc: "Downloads apk.",
            category: "downloader",
            filename: __filename,
            use: '<app id>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Example: ${prefix}apk com.whatsapp`)
          const appname = getRandom(".apk");
          const appurl = 'https://d.apkpure.com/b/apk/'+text+'?version=latest'
          const stream = fs.createWriteStream(`./${appname}`);
          request(appurl).pipe(stream);
	  citel.reply('*Downloadig:* '+text+'.apk')
            await new Promise((resolve, reject) => {
                    stream.on("error", reject);
                    stream.on("finish", resolve);
                });
                let stats = fs.statSync(`./${appname}`);
                let fileSizeInBytes = stats.size;
                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                if (fileSizeInMegabytes <= dlsize) {
                 Void.sendMessage(citel.chat, {document : fs.statSync(`./${appname}`), { quoted: citel })
                 return fs.unlinkSync(`./${appname}`);
                } else {
                    citel.reply(`❌ File size bigger than 1000mb.`);
                }
                return fs.unlinkSync(`./${appname}`);      


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "video",
            desc: "Downloads video from yt.",
            category: "downloader",
            filename: __filename,
            use: '<faded-Alan Walker>',
        },
        async(Void, citel, text) => {
            let yts = require("secktor-pack");
            let search = await yts(text);
            let anu = search.videos[0];
            let urlYt = anu.url
            const getRandom = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
                let infoYt = await ytdl.getInfo(urlYt);
                if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`❌ Video file too big!`);
                let titleYt = infoYt.videoDetails.title;
                let randomName = getRandom(".mp4");
                citel.reply('*Downloadig:* '+text+'Mp4')
                const stream = ytdl(urlYt, {
                        filter: (info) => info.itag == 22 || info.itag == 18,
                    })
                    .pipe(fs.createWriteStream(`./${randomName}`));
                await new Promise((resolve, reject) => {
                    stream.on("error", reject);
                    stream.on("finish", resolve);
                });
                let stats = fs.statSync(`./${randomName}`);
                let fileSizeInBytes = stats.size;
                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                if (fileSizeInMegabytes <= dlsize) {
                    let buttonMessage = {
                        video: fs.readFileSync(`./${randomName}`),
                        jpegThumbnail: log0,
                        mimetype: 'video/mp4',
                        fileName: `${titleYt}.mp4`,
                        caption: ` ⿻ Title : ${titleYt}\n ⿻ File Size : ${fileSizeInMegabytes} MB`,
                        headerType: 4,
                        contextInfo: {
                            externalAdReply: {
                                title: titleYt,
                                body: citel.pushName,
                                thumbnail: await getBuffer(search.all[0].thumbnail),
                                renderLargerThumbnail: true,
                                mediaType: 2,
                                mediaUrl: search.all[0].thumbnail,
                                sourceUrl: search.all[0].thumbnail
                            }
                        }
                    }
                 Void.sendMessage(citel.chat, buttonMessage, { quoted: citel })
                 return fs.unlinkSync(`./${randomName}`);
                } else {
                    citel.reply(`❌ File size bigger than 100mb.`);
                }
                return fs.unlinkSync(`./${randomName}`);      


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "play",
            desc: "Sends info about the query(of youtube video/audio).",
            category: "downloader",
            filename: __filename,
            use: '<faded-Alan walker.>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Use ${command} Back in Black`);
            let yts = require("secktor-pack");
            let search = await yts(text);
            let anu = search.videos[0];
            let buttonMessage = {
                image: {
                    url: anu.thumbnail,
                },
                caption: `
╭───────────────◆
│⿻ ${tlang().title} 
│  *Youtube Player* ✨
│⿻ *Title:* ${anu.title}
│⿻ *Duration:* ${anu.timestamp}
│⿻ *Viewers:* ${anu.views}
│⿻ *Uploaded:* ${anu.ago}
│⿻ *Author:* ${anu.author.name}
╰────────────────◆
⦿ *Url* : ${anu.url}
`,
                footer: tlang().footer,
                headerType: 4,
            };
            return Void.sendMessage(citel.chat, buttonMessage, {
                quoted: citel,
            });

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "ringtone",
            desc: "Downloads ringtone.",
            category: "downloader",
            filename: __filename,
            use: '<ringtone name>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Example: ${prefix}ringtone back in black`)
            let anu = await ringtone(text)
            let result = anu[Math.floor(Math.random() * anu.length)]
            return Void.sendMessage(citel.chat, { audio: { url: result.audio }, fileName: result.title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: citel })
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "pint",
            desc: "Downloads image from pinterest.",
            category: "downloader",
            filename: __filename,
            use: '<text|image name>',
        },
        async(Void, citel, text) => {
            if (!text) return reply("What picture are you looking for?") && Void.sendMessage(citel.chat, {
                react: {
                    text: '❌',
                    key: citel.key
                }
            })
            try {
                anu = await pinterest(text)
                result = anu[Math.floor(Math.random() * anu.length)]
                let buttonMessage = {
                    image: {
                        url: result
                    },
                    caption: ` `,
                    footer: tlang().footer,
                    headerType: 4,
                    contextInfo: {
                        externalAdReply: {
                            title: `Here it is✨`,
                            body: `${Config.ownername}`,
                            thumbnail: log0,
                            mediaType: 2,
                            mediaUrl: ``,
                            sourceUrl: ``
                        }
                    }
                }
                return Void.sendMessage(citel.chat, buttonMessage, {
                    quoted: citel
                })
            } catch (e) {
                console.log(e)
            }
        })
    //---------------------------------------------------------------------------
cmd({
            pattern: "mediafire",
            desc: "Downloads zip from Mediafire.",
            category: "downloader",
            filename: __filename,
            use: '<url of mediafire>',
        },
        async(Void, citel, text) => {
            if (!text) return citel.reply(`Give link ${tlang().greet}`);
            if (!isUrl(text.split(" ")[0]) && !text.split(" ")[0].includes("mediafire.com")) return reply(`The link you provided is invalid`);
            const baby1 = await mediafire(text);
            if (baby1[0].size.split("MB")[0] >= 999) return reply("*File Over Limit* " + util.format(baby1));
            const result4 = `*Mᴇᴅɪᴀғɪʀᴇ Dᴏᴡɴʟᴏᴀᴅᴇʀ*
*Nᴀᴍᴇ* : ${baby1[0].nama}
*Sɪᴢᴇ* : ${baby1[0].size}
*Mɪᴍᴇ* : ${baby1[0].mime}
*Lɪɴᴋ* : ${baby1[0].link}`;
            reply(`${result4}`);
            return Void.sendMessage(citel.chat, {
                    document: {
                        url: baby1[0].link,
                    },
                    fileName: baby1[0].nama,
                    mimetype: baby1[0].mime,
                }, {
                    quoted: citel,
                })
                .catch((err) => reply("could not found anything"));

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "audio",
            alias :['song'],
            desc: "Downloads audio from youtube.",
            category: "downloader",
            filename: __filename,
            use: '<text>',
        },
        async(Void, citel, text) => {
            let yts = require("secktor-pack");
            let search = await yts(text);
            let anu = search.videos[0];
            const getRandom = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
            let infoYt = await ytdl.getInfo(anu.url);
            if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`❌ Video file too big!`);
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom(".mp3");
            citel.reply('*Downloadig:* '+text+'.Mp3')
            const stream = ytdl(anu.url, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./${randomName}`));
            await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let buttonMessage = {
                    audio: fs.readFileSync(`./${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + ".mp3",
                    headerType: 4,
                    contextInfo: {
                        externalAdReply: {
                            title: titleYt,
                            body: citel.pushName,
                            renderLargerThumbnail: true,
                            thumbnailUrl: search.all[0].thumbnail,
                            mediaUrl: text,
                            mediaType: 1,
                            thumbnail: await getBuffer(search.all[0].thumbnail),
                            sourceUrl: text,
                        },
                    },
                }
                await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel })
                return fs.unlinkSync(`./${randomName}`);
            } else {
                citel.reply(`❌ File size bigger than 100mb.`);
            }
            fs.unlinkSync(`./${randomName}`);
            


        }
    )
    //---------------------------------------------------------------------------

cmd({
            pattern: "ytmp4",
            desc: "Downloads video from youtube.",
            category: "downloader",
            filename: __filename,
            use: '<yt video url>',
        },
        async(Void, citel, text) => {
            const getRandom = (ext) => {
                return `${Math.floor(Math.random() * 10000)}${ext}`;
            };
            if (!text) {
                citel.reply(`❌Please provide me a url`);
                return;
            }
            try {
                let urlYt = text;
                if (!urlYt.startsWith("http")) return citel.reply(`❌ Give youtube link!`);
                let infoYt = await ytdl.getInfo(urlYt);
                if (infoYt.videoDetails.lengthSeconds >= videotime) return citel.reply(`❌ Video file too big!`);
                let titleYt = infoYt.videoDetails.title;
                let randomName = getRandom(".mp4");

                const stream = ytdl(urlYt, {
                        filter: (info) => info.itag == 22 || info.itag == 18,
                    })
                    .pipe(fs.createWriteStream(`./${randomName}`));
                await new Promise((resolve, reject) => {
                    stream.on("error", reject);
                    stream.on("finish", resolve);
                });
                let stats = fs.statSync(`./${randomName}`);
                let fileSizeInBytes = stats.size;
                let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
                if (fileSizeInMegabytes <= dlsize) {
                    let yts = require("secktor-pack");
                    let search = await yts(text);
                    let buttonMessage = {
                        video: fs.readFileSync(`./${randomName}`),
                        jpegThumbnail: log0,
                        mimetype: 'video/mp4',
                        fileName: `${titleYt}.mp4`,
                        caption: ` ⿻ Title : ${titleYt}\n ⿻ File Size : ${fileSizeInMegabytes} MB`,
                        headerType: 4,
                        contextInfo: {
                            externalAdReply: {
                                title: titleYt,
                                body: citel.pushName,
                                thumbnail: await getBuffer(search.all[0].thumbnail),
                                renderLargerThumbnail: true,
                                mediaType: 2,
                                mediaUrl: search.all[0].thumbnail,
                                sourceUrl: search.all[0].thumbnail
                            }
                        }
                    }
                 Void.sendMessage(citel.chat, buttonMessage, { quoted: citel })
                 return fs.unlinkSync(`./${randomName}`);
                } else {
                    citel.reply(`❌ File size bigger than 100mb.`);
                }
                return fs.unlinkSync(`./${randomName}`);      
            } catch (e) {
                console.log(e)
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
        pattern: "ytmp3",
        desc: "Downloads audio by yt link.",
        category: "downloader",
        use: '<yt video url>',
    },
    async(Void, citel, text) => {
        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`;
        };

        if (text.length === 0) {
            reply(`❌ URL is empty! \nSend ${prefix}ytmp3 url`);
            return;
        }
        try {
            let urlYt = text;
            if (!urlYt.startsWith("http")) {
                citel.reply(`❌ Give youtube link!`);
                return;
            }
            let infoYt = await ytdl.getInfo(urlYt);
            //30 MIN
            if (infoYt.videoDetails.lengthSeconds >= videotime) {
                reply(`❌ I can't download that long video!`);
                return;
            }
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom(".mp3");
            const stream = ytdl(urlYt, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./${randomName}`));
            await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let yts = require("secktor-pack");
                let search = await yts(text);
                let buttonMessage = {
                    audio: fs.readFileSync(`./${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + ".mp3",
                    headerType: 4,
                    contextInfo: {
                        externalAdReply: {
                            title: titleYt,
                            body: citel.pushName,
                            renderLargerThumbnail: true,
                            thumbnailUrl: search.all[0].thumbnail,
                            mediaUrl: text,
                            mediaType: 1,
                            thumbnail: await getBuffer(search.all[0].thumbnail),
                            sourceUrl: text,
                        },
                    },
                }
                await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel })
                return fs.unlinkSync(`./${randomName}`);
            } else {
                citel.reply(`❌ File size bigger than 100mb.`);
            }
            fs.unlinkSync(`./${randomName}`);
        } catch (e) {
            console.log(e)
        }

    }
)

  //---------------------------------------------------------------------------
cmd({
        pattern: "ytdoc",
        desc: "Downloads audio by yt link as document.",
        category: "downloader",
        use: '<ytdoc video url>',
    },
    async(Void, citel, text) => {
        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${ext}`;
        };

        if (text.length === 0) {
            reply(`❌ URL is empty! \nSend ${prefix}ytmp3 url`);
            return;
        }
        try {
            let urlYt = text;
            if (!urlYt.startsWith("http")) {
                citel.reply(`❌ Give youtube link!`);
                return;
            }
            let infoYt = await ytdl.getInfo(urlYt);
            //30 MIN
            if (infoYt.videoDetails.lengthSeconds >= videotime) {
                reply(`❌ I can't download that long video!`);
                return;
            }
            let titleYt = infoYt.videoDetails.title;
            let randomName = getRandom(".mp3");
            const stream = ytdl(urlYt, {
                    filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
                })
                .pipe(fs.createWriteStream(`./${randomName}`));
            await new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.on("finish", resolve);
            });

            let stats = fs.statSync(`./${randomName}`);
            let fileSizeInBytes = stats.size;
            let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            if (fileSizeInMegabytes <= dlsize) {
                let yts = require("secktor-pack");
                let search = await yts(text);
                let buttonMessage = {
                    document: fs.readFileSync(`./${randomName}`),
                    mimetype: 'audio/mpeg',
                    fileName: titleYt + ".mp3",
                    headerType: 4,
                    contextInfo: {
                        externalAdReply: {
                            title: titleYt,
                            body: citel.pushName,
                            renderLargerThumbnail: true,
                            thumbnailUrl: search.all[0].thumbnail,
                            mediaUrl: text,
                            mediaType: 1,
                            thumbnail: await getBuffer(search.all[0].thumbnail),
                            sourceUrl: text,
                        },
                    },
                }
                await Void.sendMessage(citel.chat, buttonMessage, { quoted: citel })
                return fs.unlinkSync(`./${randomName}`);
            } else {
                citel.reply(`❌ File size bigger than 100mb.`);
            }
            fs.unlinkSync(`./${randomName}`);
        } catch (e) {
            console.log(e)
        }

    }
)
