const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'rank';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Pulls up the user rank info.')
		.addUserOption(option => option.setName('user').setDescription('Target user')),
	name
};