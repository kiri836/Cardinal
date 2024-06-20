const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { format } = require('moment-duration-format');

const exampleEmbed = new EmbedBuilder()
	.setColor('#ffffff')
	.setTitle('All Commands:')
	.setDescription(`/play - search for a video with the title or url from YouTube, supports YouTube playlists up to 250 songs
		\n/skip - skips the currently playing video
		\n/queue - lists all the queued up videos
		\n/loop - sets the current video to loop
		\n/pause - pauses the current video
		\n/resume - resumes the currently paused video
		\n/stop - clears the queue and stops playing the current video
		\n/shuffle - randomizes the queue
		\n/bugs - lists all the currently known bugs
		\n/help - sends the message you are looking at now
		\n/support - link to the patreon of the developer`)
	.setTimestamp();

module.exports = {
	exampleEmbed
}