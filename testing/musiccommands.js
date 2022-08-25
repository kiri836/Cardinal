const { NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  joinVoiceChannel, } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

async function cF(interaction, connection){
	
	
	console.log(stream);
	
	console.log("does this work?");
	connection.subscribe(player);
}

async function mainPlayer(connection, name){
	switch(name){
		case (name === 'play'):
			var url = interaction.options.getString('url');
			const stream = createAudioSource(ytdl(url, { filter: 'audioonly', dlChunkSize: 0 })
				.pipe(fs.createWriteStream('video.mp4')));
			player.play(stream);
			break;
		case (name === 'search'):
			var url = interaction.options.getString('searchterm');
			var foundVideos = ytsr(url, limit[3]);
			console.log(foundVideos);
			console.log(foundVideos.first);
			break;
		case (name === 'resume'):
			break;
		case (name === 'skip'):
			break;
		case (name === 'pause'):
			break;
	}
}

class audioPlayerInfo{
	constructor(GUILDID, PAUSED, QUEUE, VIDEOINFO){
		this.GUILDID = GUILDID;
		this.PAUSED = PAUSED;
		this.QUEUE = QUEUE;
		this.VIDOEI	= VIDEOINFO;
	}
}
module.exports = {
	mainPlayer
};