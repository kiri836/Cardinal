const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'bugs';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bugs')
		.setDescription('List of all the currently known bugs'),
	name
};