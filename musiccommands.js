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
const mainEmbed = require('./videoEmbed.js');

const betterytsr = require('./YoutubeAPIstuff/quickstart.js'); // this uses the youtube api directly instead of using the method ytsr is currently using, this speeds up the searching and makes it easier to modify for future use

var playerObjList = []; 	// array that contains all playing objects
var url; 					// the search term used to search for videos
var Id; 					// the object that contains a list of videos using the url variable
var stream; 				// the newly created stream that will then be played by the player
var queue = [];				// empty array used to suppliment the QUEUE property of a audioPlayerInfo class object, on creation
var res;					// temporary variable that is used to create a new audioPlayerInfo class object
var embedObject;			// varaible for the embed generated using the basic info
var somethingElse;
var indexOfObjs;
var current;

async function mainPlayer(interaction, connection, name, client){
	await interaction.deferReply();
	url = interaction.options.getString('song');
	if (url){
		if (url.includes('&list')){url = url.slice(url.indexOf('&list'), url.length);}
		res = await betterytsr.runSample(url);
		if (res === false){
			await currentVideoInfo(res, true);
		} else {
			if (res.IFPLAYLIST === false){
				await currentVideoInfo(res.PLAYLIST, false);
			} else if (res.IFPLAYLIST === true){
				current = res.PLAYLIST[0];
				res.PLAYLIST.shift();
			}
			
		}
		
	}
	
	if (playerObjList.length != 0){
		indexOfObjs = playerObjList.findIndex(x => x.GUILDID === interaction.guildId);
		switch(name){
			case ('play'):
				if (current.FILLED != 0){
					playerObjList[indexOfObjs].CONNECTION = connection;
					if (ytdl.validateURL(current.VIDEOID) == true){
						if (playerObjList[indexOfObjs].PLAYER._state.status === 'idle' || playerObjList[indexOfObjs].PLAYER._state.status === 'autopaused'){
							playerObjList[indexOfObjs].PLAYER.play(await streamCreator(current.VIDEOID), false);
							playerObjList[indexOfObjs].CONNECTION.subscribe(playerObjList[indexOfObjs].PLAYER);
							playerObjList[indexOfObjs].CURRENT = current;
							playerObjList[indexOfObjs].INTERACTION = interaction;
							clearTimeout(playerObjList[indexOfObjs].TIMER);
							if (res.IFPLAYLIST === true){
								playerObjList[indexOfObjs].QUEUE = res.PLAYLIST;
							}
							await embedSelector(playerObjList[indexOfObjs].CURRENT, false);
							return interaction.editReply({ embeds: [embedObject] });
						} else {
							playerObjList[indexOfObjs].QUEUE.push(current);
							if (res.IFPLAYLIST === true){
								playerObjList[indexOfObjs].QUEUE = playerObjList[indexOfObjs].QUEUE.concat(res.PLAYLIST);
							}
							playerObjList[indexOfObjs].INTERACTION = interaction;
							await embedSelector(current, true);
							return interaction.editReply({ embeds: [embedObject] });
						}
					} else {
						return interaction.editReply('Could not find video, try again with a different link or search term.');
					}
				} else {
					return interaction.editReply('Could not find video, try again with a different link or search term.');
				}
				
				break;
			case ('resume'):
				playerObjList[indexOfObjs].INTERACTION = interaction;
				clearTimeout(playerObjList[indexOfObjs].TIMER);
				if (playerObjList[indexOfObjs].PLAYER == 'playing' || playerObjList[indexOfObjs].PLAYER == 'idle'){
				} else {
					playerObjList[indexOfObjs].PLAYER.unpause();
					return interaction.editReply('Resuming.');
				}
				break;
			case ('skip'):
				playerObjList[indexOfObjs].NEEDSAREPLY = true;
				playerObjList[indexOfObjs].INTERACTION = interaction;
				playerObjList[indexOfObjs].PLAYER.stop();
				break;
			case ('pause'):
				playerObjList[indexOfObjs].INTERACTION = interaction;
				playerObjList[indexOfObjs].TIMER = setTimeout(leave, 300000, audioPlayerInfo.CONNECTION);
				if (playerObjList[indexOfObjs].PLAYER == 'paused' || playerObjList[indexOfObjs].PLAYER == 'idle'){
				} else {
					playerObjList[indexOfObjs].PLAYER.pause();
					interaction.editReply('Paused.');
				}
				break;
			case ('queue'):
				playerObjList[indexOfObjs].INTERACTION = interaction;
				if ((playerObjList[indexOfObjs].QUEUE.LENGTH != 'undefined' || playerObjList[indexOfObjs].QUEUE.LENGTH != 0) && playerObjList[indexOfObjs].CURRENT != "0033"){
					return interaction.editReply({ embeds: [await mainEmbed.songQueueEmbed(playerObjList[indexOfObjs])] });
				} else {
					return interaction.editReply('There is nothing queued up. Do /play while something is already playing to queue a song up.');
				}
			 	break;
			case ('loop'):
				playerObjList[indexOfObjs].INTERACTION = interaction;
				if (playerObjList[indexOfObjs].LOOPING === true){
					playerObjList[indexOfObjs].LOOPING = false;
					return interaction.editReply('Stopped looping current song.');
				} else {
					playerObjList[indexOfObjs].LOOPING = true;
					return interaction.editReply('Started looping current song.');
				}
				break;
			case ('stop'):
				playerObjList[indexOfObjs].INTERACTION = interaction;
				playerObjList[indexOfObjs].STOPPING = true;
				playerObjList[indexOfObjs].PLAYER.stop();
				playerObjList[indexOfObjs].QUEUE = [];
				playerObjList[indexOfObjs].CURRENT = "0033";
				playerObjList[indexOfObjs].LOOPING = false;
				interaction.editReply('Cleared queue.');
				break;
			case ('leave'):
				playerObjList[indexOfObjs].QUEUE = [];
				playerObjList[indexOfObjs].PLAYER.stop();
				playerObjList[indexOfObjs].CURRENT = "0033";
				interaction.editReply('Left.')
				playerObjList[indexOfObjs].CONNECTION.destroy();
				break;
			//case ('loopqueue'):
			//	if (playerObjList[indexOfObjs].LOOPINGQUEUE === true){
			//		playerObjList[indexOfObjs].LOOPINGQUEUE = false;
			//		return interaction.editReply('Stopped looping queue.');
			//	} else {
			//		playerObjList[indexOfObjs].LOOPINGQUEUE = true;
			//		return interaction.editReply('Started looping queue.');
			//	}
			//	break;
		}
	} else {
		if (name === 'play'){
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Pause,
				},
			});

			// creates the listener on the player object
			player.addListener("stateChange", (oldOne, newOne) => {
    			if (newOne.status == "idle") {
    			indexOfObjs = playerObjList.findIndex(x => x.GUILDID === connection.joinConfig.guildId);
        		listenerSkipper(playerObjList[indexOfObjs], client);
   				}
			})

			if (current.FILLED === 1){
				if (ytdl.validateURL(current.VIDEOID) == true){				
					player.play(await streamCreator(current.VIDEOID));
					connection.subscribe(player);
				} else {
					return interaction.editReply('Could not find video, try again with a different link or search term.');
				}
			} else {
				return interaction.editReply('Could not find video, try again with a different link or search term.');
			}
			if (res.IFPLAYLIST === true){
				queue = res.PLAYLIST;
			}

			playerObjList.push(new audioPlayerInfo(interaction.guildId, connection, player, queue, current, false, interaction, false, false, 0, stream));
			await embedSelector(current, false);
			return interaction.editReply({ embeds: [embedObject] });
		} else {
			return interaction.editReply('I am not currently in a voice currently channel. Use /play to play something first.');
		}
		return;
	}
}
// a skip function for skipping once a song ends
async function listenerSkipper(audioPlayerInfo, client){
	if (audioPlayerInfo.STOPPING === true){return audioPlayerInfo.STOPPING = false;}
	if (audioPlayerInfo.NEEDSAREPLY === false){
		if (audioPlayerInfo.LOOPING === true){
			audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.CURRENT.VIDEOID));
			await embedSelector(audioPlayerInfo.CURRENT, false);
			return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send({ embeds: [embedObject] });
		} else {
			if (audioPlayerInfo.QUEUE.length != 0){
				audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.QUEUE[0].VIDEOID));
				audioPlayerInfo.CURRENT = audioPlayerInfo.QUEUE[0];
				audioPlayerInfo.QUEUE.shift();
				await embedSelector(audioPlayerInfo.CURRENT, false);
				return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send({ embeds: [embedObject] });
			} else {
				audioPlayerInfo.TIMER = setTimeout(leave, 300000, audioPlayerInfo);
				return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send("There is nothing else left in queue.");
			}
		}			
	} else {
		if (audioPlayerInfo.QUEUE.length != 0){
			audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.QUEUE[0].VIDEOID));
			audioPlayerInfo.CURRENT = audioPlayerInfo.QUEUE[0];
			audioPlayerInfo.QUEUE.shift();
			audioPlayerInfo.NEEDSAREPLY = false;
			await embedSelector(audioPlayerInfo.CURRENT, false);
			return audioPlayerInfo.INTERACTION.editReply({ embeds: [embedObject] });
		} else {
			audioPlayerInfo.NEEDSAREPLY = false;
			audioPlayerInfo.TIMER = setTimeout(leave, 300000, audioPlayerInfo);
			return audioPlayerInfo.INTERACTION.editReply("There is nothing else left in queue.");			
		}
	}
}
// creates the stream that is then played by a player object
async function streamCreator(videoURL){
	stream = createAudioResource(ytdl(videoURL, { 
		filter: "audioonly",
	    fmt: "mp3",
	    highWaterMark: 1 << 62,
	    liveBuffer: 1 << 62,
	    dlChunkSize: 0, //disabling chunking is recommended in discord bot
	    bitrate: 128 }));
	return stream;
}

async function embedSelector(current, embedType){
	embedObject = await mainEmbed.playingQueueingEmbed(current, embedType);
	return embedObject;
}

async function currentVideoInfo(res, sheesh){
	if (sheesh === false){
		current = new currentVideo(
			res.data.items[0].snippet.title, 
			`https://www.youtube.com/watch?v=${res.data.items[0].id}`, 
			res.data.items[0].snippet.channelTitle, 
			`https://www.youtube.com/c/${res.data.items[0].snippet.channelId}`, 
			res.data.items[0].snippet.thumbnails.high.url, 
			res.data.items[0].statistics.likeCount, 
			res.data.items[0].statistics.viewCount, 
			res.data.items[0].contentDetails.duration, 
			res.data.items[0].snippet.publishedAt, 
			1
			);
	} else if (sheesh === true){
		current = new currentVideo(
			0, 
			0, 
			0, 
			0, 
			0, 
			0, 
			0, 
			0, 
			0, 
			0
			);
	}
}

async function leave(audioPlayerInfo){
	audioPlayerInfo.PLAYER.stop();
	audioPlayerInfo.QUEUE = [];
	audioPlayerInfo.CURRENT = "0033";
	audioPlayerInfo.CONNECTION.destroy();
}
// this class holds all information needed for the player, this is primarily for multi-guild usage
class audioPlayerInfo{
	constructor(GUILDID, CONNECTION, PLAYER, QUEUE, CURRENT, LOOPING, INTERACTION, STOPPING, NEEDSAREPLY, TIMER, STREAM){
		this.GUILDID = GUILDID;
		this.CONNECTION = CONNECTION;
		this.PLAYER = PLAYER;
		this.QUEUE = QUEUE;
		this.CURRENT = CURRENT;
		this.LOOPING = LOOPING;
		this.INTERACTION = INTERACTION;
		this.STOPPING = STOPPING;
		this.NEEDSAREPLY = NEEDSAREPLY;
		this.TIMER = TIMER;
		this.STREAM = STREAM;
		//this.LOOPINGQUEUE = LOOPINGQUEUE;
	}
}

class currentVideo{
	constructor(TITLE, VIDEOID, AUTHOR, AUTHORID, IMAGEURL, LIKES, VIEWS, LENGTH, UPLOADDATE, FILLED){
		this.TITLE = TITLE;
		this.VIDEOID = VIDEOID;
		this.AUTHOR = AUTHOR;
		this.AUTHORID = AUTHORID;
		this.IMAGEURL = IMAGEURL;
		this.LIKES = LIKES;
		this.VIEWS = VIEWS;
		this.LENGTH = LENGTH;
		this.UPLOADDATE = UPLOADDATE;
		this.FILLED = FILLED;
	}
}

module.exports = {
	mainPlayer
};