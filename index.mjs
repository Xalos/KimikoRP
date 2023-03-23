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
const nexus = require("./data/mainModules/dataBaseNexus.cjs");

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
		var userName = message.author.username;


		//OBJET DE TEST UNIQUEMENT
		var rpDataOLD = {
			firstname: 'Hope',
			lastname: 'Starfall',
			color: 0x0099FF,
			message: mContent,
			body: "https://cdn.discordapp.com/attachments/539713961784770570/612269668480188416/file.jpg",
			head: "",
		};

		//OBJET DE TEST UNIQUEMENT
		var listData = [

			["Aria","Khaly",'238177806729740288'],
			["Aria","Khaly",'416326839519150080'],
			["Aria","Khaly",'416326839519150080'],
			["Aria","Khaly",'238177806729740288'],
			["Aria","Khaly",''],
			["Aria","Khaly",'238177806729740288']

		];

		//OBJET DE TEST UNIQUEMENT
		var listDataStats = [

			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			["Force","$for",'1d100'],
			

		];


		if (sW("!bdtest")) await nexus.test();
		
		if (sW("!test"))send.rp(message,await embed.rp(rpData));


		if (sW("!des "))send.rp(message,await embed.description(rpData));

		if (sW("!desmj "))send.rp(message,await embed.description(rpData,"mj"));

		if (sW("!rp ")||sW("r "))send.rp(message,await embed.rp(await nexus.character(message,mContent)));


		if (sW("!r "))send.rp(message,await embed.roll(await diceRoll.classicRoll(message),userName));


		if (sW("!statslist"))send.rp(message,await embed.statsList(listDataStats));


		if (sW("!see "))send.rp(message,await embed.see(rpData,"Joueur"));


		if (sW("!playerlist"))send.rp(message,await embed.playerlist(listData,"Joueur",message,true));

		if (sW("!mylist"))send.rp(message,await embed.playerlist(listData,"Joueur",message,false));


		if (sW("!ticket "))send.ticket(await embed.ticket(message,false));
		
		if (sW("!ask "))send.askTicket(await embed.ticket((message,"!ask "),true));
		
       
		function sW(command){
			return mContent.toUpperCase().startsWith(command.toUpperCase());
		}

	}catch (error) { 

		try {

			//Catch if custom error
			if(error[0] == "ErrorReply"){
				console.error(error[1]);
				await send.error(error[2],error[1]);
			}

			//Display not custom error
			else console.error(error);
		}
		catch (error){

			//Final error failsafe
			console.error(error)
		}
	};
		
});

client.login(token);