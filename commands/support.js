const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'support';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Sends the link for where you can support my creator.'),
	name
};