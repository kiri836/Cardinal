const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'stop';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops looping and the current song then clears the queue.'),
	name
};