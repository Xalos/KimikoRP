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
	nexus.client = client;
	embed.EmbedBuilder = EmbedBuilder;
	embed.PermissionFlagsBits = PermissionFlagsBits;


client.on("ready", () =>{

    console.log("KimikoRp lancée !");
    //send.info("");


});


client.on('messageCreate', async (message) => {
   
	try{
		
		if(message.author.id == clientId)return;
		
		var mContent = message.content;
		var userName = message.author.username;

		if (sW("!bdtest")) await nexus.test();
		
		if (sW("!test"))send.embed(message,await embed.rp(rpData));


		if (sW("!des "))send.rp(message,await embed.description(mContent));

		

		if (sW("!rp ")||sW("r "))send.rp(message,await embed.rp(await nexus.character(message,mContent,"Joueur")));

		

		if (sW("!r "))send.rpRoll(message,await embed.roll(await diceRoll.classicRoll(message),userName));

		if (sW("!lock "))send.notif(message,await nexus.lockSystem(message,mContent,"lock"));

		if (sW("!unlock"))send.notif(message,await nexus.lockSystem(message,mContent,"unlock"));

		if (sW("!main "))send.notif(message,await nexus.lockSystem(message,mContent,"main"));

		if (mContent == "!del")send.notif(message,await nexus.delEdit(message,"delete"));

		if (sW("!edit "))send.notif(message,await nexus.delEdit(message,"edit"));

		if (sW("!color "))send.notif(message,await nexus.setColor(message,mContent,"Joueur"));

		if (sW("!upload "))send.notifNoDel(message,await nexus.upload(message,mContent,"Joueur"));

		//if (sW("!mystats"))send.embed(message,await nexus.statsListChar(message,mContent,"Joueur"));

		if (sW("$"))send.rpRoll(message,await embed.advRoll(await diceRoll.advanceRoll(await nexus.statsRoll(message,mContent)),userName));

		

		
		//MJ LOCK COMMAND
		if (sW("!npc ")||sW("n "))send.rp(message,await embed.rp(await nexus.character(message,mContent,"npc")));
		
		if (sW("!desmj "))send.rp(message,await embed.description(mContent,"mj"));
		
		if (sW("!statslist"))send.embed(message,await embed.statsList(await nexus.statsList(message)));

		if (sW("!channelf add"))send.notif(message,await nexus.channelf(message,"add"));
	
		if (sW("!channelf del"))send.notif(message,await nexus.channelf(message,"del"));

		if (sW("!addplayer "))send.notifChanMp(message,await nexus.addCharacter(message,mContent,"Joueur"));

		if (sW("!addnpc "))send.notifNoDel(message,await nexus.addCharacter(message,mContent,"NPC"));

		if (sW("!delplayer "))send.notifNoDel(message,await nexus.delCharacter(message,mContent,"Joueur"));

		if (sW("!delnpc "))send.notifNoDel(message,await nexus.delCharacter(message,mContent,"NPC"));

		if (sW("!uploadnpc "))send.notifNoDel(message,await nexus.upload(message,mContent,"NPC"));

		if (sW("!colornpc "))send.notifNoDel(message,await nexus.setColor(message,mContent,"NPC"));
		
		if (sW("!carac "))send.notifNoDel(message,await nexus.carac(message,mContent));

		if (sW("!setcarac "))send.notifNoDel(message,await nexus.setcarac(message,mContent));



		if (sW("!see "))send.embed(message,await embed.see(await nexus.see(message,mContent,"Joueur"),"Joueur"));

		if (sW("!seenpc "))send.embed(message,await embed.see(await nexus.see(message,mContent,"npc"),"NPC"));


		if (sW("!playerlist"))send.embed(message,await embed.playerlist(await nexus.listChar(message,"Joueur"),"Joueur",message,true));

		if (sW("!npclist"))send.embed(message,await embed.playerlist(await nexus.listChar(message,"npc"),"NPC",message,true));

		if (sW("!mylist"))send.embed(message,await embed.playerlist(await nexus.listChar(message,"Joueur"),"Joueur",message,false));


		if (sW("!ticket "))send.ticket(await embed.ticket(message,false));
		
		if (sW("!ask "))send.askTicket(await embed.ticket(message,true));

		if (!sW("!")&&!sW("/")&&!sW("r ")&&!sW("n ")&&!sW("$"))send.rp(message,await embed.rp(await nexus.lockMessage(message,mContent)));
		
       
		function sW(command){
			return mContent.toUpperCase().startsWith(command.toUpperCase());
		}

	}catch (error) { 

		try {

			//Catch if custom error
			switch (error[0]) {
			case "ErrorReply":
				console.error(error[1]);
				await send.error(error[2],error[1]);
				break;
			case "ErrorReplyMP":
				console.error(error[1]);
				await send.error(error[2],error[1]);
				await send.errorMP(error[2],error[1]);
				break;
			default :
				console.error(error);
			}

			//Display not custom error
			
		}
		catch (error){

			//Final error failsafe
			console.error(error)
		}
	};
		
});

client.login(token);