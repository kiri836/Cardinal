const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'resume';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the paused song.'),
	name
};