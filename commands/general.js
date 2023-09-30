/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/

const { tlang, botpic, cmd, prefix, runtime, Config , sleep } = require('../lib')
const axios = require('axios')
const speed = require('performance-now')
const fetch = require('node-fetch');

   
//---------------------------------------------------------------------------

cmd({
    pattern: "chat",
    alias :['gpt','ai'],
    desc: "chat with an AI(GPT)",
    category: "AI",
    use: '<Hii,Secktor>',
    filename: __filename,
},
async(Void, citel,text) => {
 try {
 var res = await axios.get(`https://vihangayt.me/tools/chatgpt?q=${text}`)
citel.reply(`${res.data}`);
} catch (error) {
console.log(error);
citel.reply("Sorry, there seems to be an error.");
}
}
)
//---------------------------------------------------------------------------
cmd({
    pattern: 'art',
    alias :['gptart','aiart'],
    desc: 'create a ai art',
    category: 'AI',
    use:'<does this>',
  }, async(Void,citel,text) => {
    let uu = text.replace(/ /g, "%20");
  await Void.sendMessage(citel.chat,{image:{url: `https://vihangayt.me/tools/midjourney?q=${uu}`}, caption: `${text}`}) 
  });
//---------------------------------------------------------------------------
cmd({
        pattern: "repo",
        alias: ["git", "sc", "script"],
        desc: "Sends info about repo.",
        category: "general",
        filename: __filename,
    },
    async(Void, citel) => {
        let { data } = await axios.get('https://api.github.com/repos/nipuna15/Blue-Lion-V2')
        let cap = `Hey ${citel.pushName}\n
*⭐ Total Stars:* ${data.stargazers_count} stars

*🍽️ Forks:* ${data.forks_count} forks

*🍁 Repo:* https://github.com/nipuna15/Blue-Lion-V2

*Group1:* https://chat.whatsapp.com/JBjM2yRpqJD5rGUEKQOpHi

*Group2:* https://chat.whatsapp.com/GkYZvcVSUSR1WBvl6rBpiw

*Deploy Your Own:*-
https://nipuna15.github.io/blue-lion-web/`
                let buttonMessaged = { 
             image: { url: 'https://raw.githubusercontent.com/nipuna15/nipuna15/main/IMG-20230613-WA0008.jpg' }, 
             caption: cap, 
         };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });

    }
)
//---------------------------------------------------------------------------
cmd({
        pattern: "status",
        alias: ["about"],
        desc: "To check bot status",
        category: "general",
        filename: __filename,
    },
    async(Void, citel) => {
        const uptime = process.uptime();
        timestampe = speed();
        latensie = speed() - timestampe;
        let ter = `
🔰 *${tlang().title}* 🔰
*🌟Description:* A WhatsApp bot with rich features, build in NodeJs to make your WhatsApp enjoyable.
*⚡Speed:* ${latensie.toFixed(4)} ms
*🚦Uptime:* ${runtime(process.uptime())}
*🕸Version:* 0.0.7
*👤Owner:*  ${Config.ownername}
*Powered by ${tlang().title}*
`;
        let buttonMessaged = {
            image: {
                url: THUMB_IMAGE ,
            },
            caption: ter,
            footer: tlang().footer,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: tlang().title,
                    body: `Bot-Status`,
                    thumbnail: log0,
                    mediaType: 2,
                    mediaUrl: ``,
                    sourceUrl: ``,
                },
            },
        };
        return await Void.sendMessage(citel.chat, buttonMessaged, {
            quoted: citel,
        });

    }
)
//-----------------------------------
