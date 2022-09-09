const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'help';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Sends a help page with all the bot commands.')
	name
};