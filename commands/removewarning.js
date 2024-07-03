const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'removewarning';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removewarning')
		.setDescription('remove a warning from the user')
		.addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true))
		.addIntegerOption(option => option.setName('id').setDescription('warning id').setRequired(true))
		.setDefaultMemeberPermissions(1 << 40),
	name
};
