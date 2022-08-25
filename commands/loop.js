const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'loop';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop the current song.'),
	name
};