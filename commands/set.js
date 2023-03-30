const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'set';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Admin command for setting user time, and messages')
		.addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true))
		.addStringOption(option => option.setName('time').setDescription('time spent in vcs'))
		.addStringOption(option => option.setName('messages').setDescription('messages sent')),
	name
};