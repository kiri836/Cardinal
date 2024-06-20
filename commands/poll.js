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
		.addStringOption(option => option.setName('j').setDescription('option j'))
		.addStringOption(option => option.setName('k').setDescription('option k'))
		.addStringOption(option => option.setName('l').setDescription('option l'))
		.addStringOption(option => option.setName('m').setDescription('option m'))
		.addStringOption(option => option.setName('n').setDescription('option n'))
		.addStringOption(option => option.setName('o').setDescription('option o'))
		.addStringOption(option => option.setName('p').setDescription('option p'))
		.addStringOption(option => option.setName('q').setDescription('option q'))
		.addStringOption(option => option.setName('r').setDescription('option r'))
		.addStringOption(option => option.setName('s').setDescription('option s'))
		.addStringOption(option => option.setName('t').setDescription('option t'))
		.addStringOption(option => option.setName('u').setDescription('option u'))
		.addStringOption(option => option.setName('v').setDescription('option v'))
		.addStringOption(option => option.setName('w').setDescription('option w'))
		.addIntegerOption(option => option.setName('expiresin').setDescription('time in minutes for the poll to expire')),
	name
};
