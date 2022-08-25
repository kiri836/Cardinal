const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'leave';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Makes the bot leave the voice chat'),
	name
};