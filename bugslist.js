const { EmbedBuilder } = require('discord.js');

const exampleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		//.setTitle('Current bugs that will be fixed in a future update:')
		.setDescription('There are currently no bugs! :)');
module.exports = {
	exampleEmbed
}