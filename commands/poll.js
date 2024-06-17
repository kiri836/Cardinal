const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'poll';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('create a poll.')
		.addUserOption(option => option.setName('1stOption').setDescription('1st option of the poll.'))
		.addUserOption(option => option.setName('2ndOption').setDescription('2nd option of the poll.'))
		.addUserOption(option => option.setName('3rdOption').setDescription('3rd option of the poll.'))
		.addUserOption(option => option.setName('4thOption').setDescription('4th option of the poll.'))
		.addUserOption(option => option.setName('5thOption').setDescription('5th option of the poll.'))
		.addUserOption(option => option.setName('6thOption').setDescription('6th option of the poll.')),
	name
};