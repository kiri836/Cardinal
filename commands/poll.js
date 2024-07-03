const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'poll';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('create a poll')
		.addStringOption(option => option.setName('question').setDescription('poll question').setRequired(true))
		.addStringOption(option => option.setName('a').setDescription('option a'))
		.addStringOption(option => option.setName('b').setDescription('option b'))
		.addStringOption(option => option.setName('c').setDescription('option c'))
		.addStringOption(option => option.setName('d').setDescription('option d'))
		.addStringOption(option => option.setName('e').setDescription('option e'))
		.addStringOption(option => option.setName('f').setDescription('option f'))
		.addStringOption(option => option.setName('g').setDescription('option g'))
		.addStringOption(option => option.setName('h').setDescription('option h'))
		.addStringOption(option => option.setName('i').setDescription('option i'))
		.addStringOption(option => option.setName('i').setDescription('option j'))
		.addIntegerOption(option => option.setName('expiresin').setDescription('time in minutes for the poll to expire')),
	name
};
