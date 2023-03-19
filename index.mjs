import { createRequire } from "module";
//import { addServ, ownerTicket } from "./js/chanSend.cjs";
const require = createRequire(import.meta.url);


const fs = require('node:fs');
const path = require('node:path');

const { Client,intents, Collection, Events, GatewayIntentBits,EmbedBuilder,Guild } = require('discord.js');
const client = new Client ({intents:[3276799]})

const send = require("./data/mainModules/chanSend.cjs");
const embed = require("./data/mainModules/embedMaker.cjs");

const { PermissionFlagsBits } = require('discord-api-types/v10');

const { clientId, guildId, token } = require('./config.json');

	send.client = client;
	embed.EmbedBuilder = EmbedBuilder;
	embed.PermissionFlagsBits = PermissionFlagsBits;


client.on("ready", () =>{

    console.log("KimikoRp lancée !");
    //send.info("");


});


client.on('messageCreate', async (message) => {
   
	try{
 
		var mContent = message.content;

		var rpData = {
			firstname: 'Hope',
			lastname: 'Starfall',
			color: 0x0099FF,
			message: 'Bonjour je suis Hope',
			//body: "https://cdn.discordapp.com/attachments/539713961784770570/612269668480188416/file.jpg",
			head: "",
		};
	
		if (mContent == "!test")send.rp(message,await embed.rp(rpData));

		if (mContent.startsWith("!ticket "))send.ticket(await embed.ticket(message,false));
		
		if (mContent.startsWith("!ask "))send.askTicket(await embed.ticket(message,true));
		
       
    
	}catch (error) { console.error(error);};
    
     
});

client.login(token);