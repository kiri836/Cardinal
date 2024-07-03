const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'warnings';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('see all warnings for a user')
		.addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),
	name
};
