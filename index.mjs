import { createRequire } from "module";
//import { addServ, ownerTicket } from "./js/chanSend.cjs";
const require = createRequire(import.meta.url);


const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits,EmbedBuilder } = require('discord.js');

const send = require("./data/mainModules/chanSend.cjs");
const embed = require("./data/mainModules/embedMaker.cjs");


const { clientId, guildId, token } = require('./config.json');

const client = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
]})




send.client = client;
embed.EmbedBuilder = EmbedBuilder;

client.on("ready", () =>{
    embed.EmbedBuilder = EmbedBuilder;
    console.log("KimikoRp lancée !");
    //send.info("");


});


client.on('messageCreate', async (message) => {
   
    var text = message.content;

    var rpData = {
        firstname: 'Hope',
        lastname: 'Starfall',
        color: 0x0099FF,
        message: 'Bonjour je suis Hope',
        //body: "https://cdn.discordapp.com/attachments/539713961784770570/612269668480188416/file.jpg",
        head: "",
      };
   
    if (text == "!test")send.rp(message,await embed.rp(rpData));

    if (text == "!tdev")send.ownerTicket(await embed.rp(rpData));
    
    if (text == "!tserv")send.addServ(await embed.rp(rpData));
       //client.channels.cache.get('540154188009832449').send("Hello!");
       
      
    
     
});

client.login(token);