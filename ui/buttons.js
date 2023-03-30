const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');


const sppq = new ActionRowBuilder()
	.addComponents(
		new ButtonBuilder()
			.setCustomId('queue')
			.setLabel('Queue')
			.setStyle(ButtonStyle.Danger)
			//.setEmoji('1082635099499139102')
	)
	.addComponents(
		new ButtonBuilder()
			.setCustomId('resume')
			.setLabel('Resume')
			.setStyle(ButtonStyle.Danger)
			//.setEmoji('1082635094579220501')
	)
	.addComponents(
		new ButtonBuilder()
			.setCustomId('pause')
			.setLabel('Pause')
			.setStyle(ButtonStyle.Danger)
			//.setEmoji('1082635096839954477')
	)
	.addComponents(
		new ButtonBuilder()
			.setCustomId('stop')
			.setLabel('Stop')
			.setStyle(ButtonStyle.Danger)
			//.setEmoji('1082635096277930075')
	)
	.addComponents(
		new ButtonBuilder()
			.setCustomId('skip')
			.setLabel('Skip')
			.setStyle(ButtonStyle.Danger)
			//.setEmoji('1082635098123415593')
	);
	// .addComponents(
	// 	new ButtonBuilder()
	// 		.setCustomId('LOOP')
	// 		.setLabel('LOOP')
	// 		.setStyle(ButtonStyle.Danger)
	// 		//.setEmoji('1082635098123415593')
	// );


module.exports = {
	sppq
}