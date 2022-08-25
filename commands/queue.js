const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'queue';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Lists all songs in queue.'),
	name
};