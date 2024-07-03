const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'warn';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn the user')
		.addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true))
		.addIntegerOption(option => option.setName('severity').setDescription('warning severity, 1-3').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('reason for warning')
		.setDefaultMemeberPermissions(1 << 40),
	name
};
