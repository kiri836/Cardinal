const { SlashCommandBuilder } = require('@discordjs/builders');

var name = 'leaderboard';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows the leaderboard.'),
	name
}