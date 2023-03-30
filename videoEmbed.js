const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const moment = require('moment');
const { format } = require('moment-duration-format');

// this file contains all the currently used embeds

async function playingQueueingEmbed(current, embedType) {
	var date = new Date(current.UPLOADDATE);
	const exampleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.setTitle(current.TITLE)
		.setURL(current.VIDEOID)
		.setAuthor({name: 'Currently playing:'})
		.setDescription(`[ ${current.AUTHOR} ](${current.AUTHORID})` + '\n\n**Views: **' + `[ ${parseInt(current.VIEWS).toLocaleString()} ]`
			+ '\n**Likes: **' + `[ ${parseInt(current.LIKES).toLocaleString()} ]`  + '\n**Length: **' + `[ ${moment.duration(current.LENGTH).format('HH:mm:ss', {trim: false})} ]`
			+ '\n**Upload Date: **' + `[ ${date.toLocaleString()} ]`)
		.setImage(current.IMAGEURL)
		.setTimestamp();
	if (embedType === true){
		exampleEmbed.setAuthor({ name: 'Added: ' });
	}
	return exampleEmbed;
}

async function songQueueEmbed(mainQueue){
	const exampleEmbed = new EmbedBuilder()
		.setColor('#ffffff')
		.setTitle('**Queue: **')
		.setDescription('Currently playing: \n' + `[${mainQueue.CURRENT.TITLE}](${mainQueue.CURRENT.VIDEOID}) **---** [${mainQueue.CURRENT.AUTHOR}](${mainQueue.CURRENT.AUTHORID})`)
		.setTimestamp();
	switch (mainQueue.QUEUE.length){
		case 0:
			break;
		case 1:
			exampleEmbed.addFields({ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`});
			break;
		case 2:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`});
			break;
		case 3:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`});
			break;
		case 4:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`},
				{ name: '\u200B', value: '**4. **' + `[${mainQueue.QUEUE[3].TITLE}](${mainQueue.QUEUE[3].VIDEOID}) **---** [${mainQueue.QUEUE[3].AUTHOR}](${mainQueue.QUEUE[3].AUTHORID})`});
			break;
		case 5:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`},
				{ name: '\u200B', value: '**4. **' + `[${mainQueue.QUEUE[3].TITLE}](${mainQueue.QUEUE[3].VIDEOID}) **---** [${mainQueue.QUEUE[3].AUTHOR}](${mainQueue.QUEUE[3].AUTHORID})`},
				{ name: '\u200B', value: '**5. **' + `[${mainQueue.QUEUE[4].TITLE}](${mainQueue.QUEUE[4].VIDEOID}) **---** [${mainQueue.QUEUE[4].AUTHOR}](${mainQueue.QUEUE[4].AUTHORID})`});
			break;
		case 6:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`},
				{ name: '\u200B', value: '**4. **' + `[${mainQueue.QUEUE[3].TITLE}](${mainQueue.QUEUE[3].VIDEOID}) **---** [${mainQueue.QUEUE[3].AUTHOR}](${mainQueue.QUEUE[3].AUTHORID})`},
				{ name: '\u200B', value: '**5. **' + `[${mainQueue.QUEUE[4].TITLE}](${mainQueue.QUEUE[4].VIDEOID}) **---** [${mainQueue.QUEUE[4].AUTHOR}](${mainQueue.QUEUE[4].AUTHORID})`},
				{ name: '\u200B', value: '**6. **' + `[${mainQueue.QUEUE[5].TITLE}](${mainQueue.QUEUE[5].VIDEOID}) **---** [${mainQueue.QUEUE[5].AUTHOR}](${mainQueue.QUEUE[5].AUTHORID})`});
			break;
		case 7:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`},
				{ name: '\u200B', value: '**4. **' + `[${mainQueue.QUEUE[3].TITLE}](${mainQueue.QUEUE[3].VIDEOID}) **---** [${mainQueue.QUEUE[3].AUTHOR}](${mainQueue.QUEUE[3].AUTHORID})`},
				{ name: '\u200B', value: '**5. **' + `[${mainQueue.QUEUE[4].TITLE}](${mainQueue.QUEUE[4].VIDEOID}) **---** [${mainQueue.QUEUE[4].AUTHOR}](${mainQueue.QUEUE[4].AUTHORID})`},
				{ name: '\u200B', value: '**6. **' + `[${mainQueue.QUEUE[5].TITLE}](${mainQueue.QUEUE[5].VIDEOID}) **---** [${mainQueue.QUEUE[5].AUTHOR}](${mainQueue.QUEUE[5].AUTHORID})`},
				{ name: '\u200B', value: '**7. **' + `[${mainQueue.QUEUE[6].TITLE}](${mainQueue.QUEUE[6].VIDEOID}) **---** [${mainQueue.QUEUE[6].AUTHOR}](${mainQueue.QUEUE[6].AUTHORID})`});
			break;
		default:
			exampleEmbed.addFields(
				{ name: '\u200B', value: '**1. **' + `[${mainQueue.QUEUE[0].TITLE}](${mainQueue.QUEUE[0].VIDEOID}) **---** [${mainQueue.QUEUE[0].AUTHOR}](${mainQueue.QUEUE[0].AUTHORID})`},
				{ name: '\u200B', value: '**2. **' + `[${mainQueue.QUEUE[1].TITLE}](${mainQueue.QUEUE[1].VIDEOID}) **---** [${mainQueue.QUEUE[1].AUTHOR}](${mainQueue.QUEUE[1].AUTHORID})`},
				{ name: '\u200B', value: '**3. **' + `[${mainQueue.QUEUE[2].TITLE}](${mainQueue.QUEUE[2].VIDEOID}) **---** [${mainQueue.QUEUE[2].AUTHOR}](${mainQueue.QUEUE[2].AUTHORID})`},
				{ name: '\u200B', value: '**4. **' + `[${mainQueue.QUEUE[3].TITLE}](${mainQueue.QUEUE[3].VIDEOID}) **---** [${mainQueue.QUEUE[3].AUTHOR}](${mainQueue.QUEUE[3].AUTHORID})`},
				{ name: '\u200B', value: '**5. **' + `[${mainQueue.QUEUE[4].TITLE}](${mainQueue.QUEUE[4].VIDEOID}) **---** [${mainQueue.QUEUE[4].AUTHOR}](${mainQueue.QUEUE[4].AUTHORID})`},
				{ name: '\u200B', value: '**6. **' + `[${mainQueue.QUEUE[5].TITLE}](${mainQueue.QUEUE[5].VIDEOID}) **---** [${mainQueue.QUEUE[5].AUTHOR}](${mainQueue.QUEUE[5].AUTHORID})`},
				{ name: '\u200B', value: '**7. **' + `[${mainQueue.QUEUE[6].TITLE}](${mainQueue.QUEUE[6].VIDEOID}) **---** [${mainQueue.QUEUE[6].AUTHOR}](${mainQueue.QUEUE[6].AUTHORID})`});
			exampleEmbed.setFooter({ text: `+${mainQueue.QUEUE.length - 7} more in queue` });
	}
	return exampleEmbed;
}

module.exports = {
	playingQueueingEmbed, songQueueEmbed
}