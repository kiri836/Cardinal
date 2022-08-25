const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'pause';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current song.'),
	name
}