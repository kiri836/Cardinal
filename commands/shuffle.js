const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'shuffle';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffle the current playlist.'),
	name
};