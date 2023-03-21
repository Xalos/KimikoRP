import { createRequire } from "module";
//import { addServ, ownerTicket } from "./js/chanSend.cjs";
const require = createRequire(import.meta.url);


const { Client,intents, Collection, Events, GatewayIntentBits,EmbedBuilder,Guild } = require('discord.js');
const client = new Client ({intents:[3276799]})


const send = require("./data/mainModules/chanSend.cjs");
const embed = require("./data/mainModules/embedMaker.cjs");
const utils = require("./data/mainModules/utils.cjs");
const rpData = require("./data/mainModules/rpDataMaker.cjs");
const diceRoll = require("./data/mainModules/diceRoll.cjs");

const { PermissionFlagsBits } = require('discord-api-types/v10');

const { clientId, guildId, token } = require('./config.json');

const prefix = "!";
	
	embed.Clear = rpData.cClear = utils.cClear;	
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
			message: mContent,
			body: "https://cdn.discordapp.com/attachments/539713961784770570/612269668480188416/file.jpg",
			head: "",
		};

		var listData = [

			["Aria","Khaly",'238177806729740288'],
			["Aria","Khaly",'416326839519150080'],
			["Aria","Khaly",'416326839519150080'],
			["Aria","Khaly",'238177806729740288'],
			["Aria","Khaly",''],
			["Aria","Khaly",'238177806729740288']

		];

		var listDataStats = [

			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			

		];


			
		
		if (mContent.startsWith("!test"))send.rp(message,await embed.rp(rpData));


		if (mContent.startsWith("!des "))send.rp(message,await embed.description(rpData));

		if (mContent.startsWith("!desmj "))send.rp(message,await embed.description(rpData,"mj"));


		if (mContent.startsWith("!roll "))send.rp(message,await embed.roll(await diceRoll.classicRoll(message),message.author.username));


		if (mContent.startsWith("!statslist"))send.rp(message,await embed.statsList(listDataStats));


		if (mContent.startsWith("!see "))send.rp(message,await embed.see(rpData,"Joueur"));


		if (mContent.startsWith("!playerlist"))send.rp(message,await embed.playerlist(listData,"Joueur",message,true));

		if (mContent.startsWith("!mylist"))send.rp(message,await embed.playerlist(listData,"Joueur",message,false));


		if (mContent.startsWith("!ticket "))send.ticket(await embed.ticket(message,false));
		
		if (mContent.startsWith("!ask "))send.askTicket(await embed.ticket((message,"!ask "),true));
		
       
    
	}catch (error) { 

		try {
			if(error[0] == "ErrorReply"){
				console.error(error[1]);
				await send.error(error[2],error[1]);
			}
			else console.error(error);
		}
		catch (error){
			console.error(error)
		}
	};
		
});

client.login(token);