const { SlashCommandBuilder } = require('discord.js');

const send = require("../mainModules/chanSend.cjs");
const embed = require("../mainModules/embedMaker.cjs");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rp')
		.setDescription('send a rp message')
		.addStringOption((option) => option.setName('perso').setDescription('Nom du personnage').setRequired(true))
		.addStringOption((option) => option.setName('message').setDescription('Message RP').setRequired(true)),
		
	async execute(interaction) {

		var perso = await interaction.options.getString('perso');
		var message = await interaction.options.getString('message');
		

		var rpData = {
			firstname: perso,
			lastname: perso,
			color: 0x0099FF,
			message: message,
			//body: "https://cdn.discordapp.com/attachments/539713961784770570/612269668480188416/file.jpg",
			//head: "",
		  };
	   
		send.rp(interaction,await embed.rp(rpData));
		
		//await interaction.reply('test');
	},
};