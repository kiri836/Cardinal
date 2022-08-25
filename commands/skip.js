const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'skip';

module.exports = {
	data: new SlashCommandBuilder()
			.setName('skip')
			.setDescription('Skips the current song.'),
	name
};