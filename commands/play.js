const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'play';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song by using its url.')
		.addStringOption(option => option.setName('song').setDescription('Input for the term to search for').setRequired(true)),
	name
};