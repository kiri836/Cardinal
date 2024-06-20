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
const ytdl = require('ytdl-core'); // used for validating the validity of a supplied url
const mainEmbed = require('./embeds/videoEmbed.js'); // embeds are all located in this file
const buttons = require('./ui/buttons.js');
const Events = require ('discord.js');


const authorization = require("../Config.js");
const betterytsr = require('./YoutubeAPIstuff/quickstart.js'); // this uses the youtube api directly instead of using the method ytsr is currently using, this speeds up the searching and makes it easier to modify for future use
const COOKIE = authorization.cookies;

var playerObjList = []; 	// array that contains all playing objects
var url; 					// the search term used to search for videos
var Id; 					// the object that contains a list of videos using the url variable
var stream; 				// the newly created stream that will then be played by the player
var queue = [];				// empty array used to suppliment the QUEUE property of a audioPlayerInfo class object, on creation
var res;					// temporary variable that is used to create a new audioPlayerInfo class object
var embedObject;			// varaible for the embed generated using the basic info
var indexOfObjs;			// variable for the position of the guild specific player in the array
var current;				// variable for holding video data temporarily

async function mainPlayer(interaction, connection, name, client){
	await interaction.deferReply(); 				// without differing the reply, the bot has to reply within 5 seconds, which might not be enough time for certain commands, this sets the limit to 15 minutes giving more than adecuate time for the bot to reply
	// retrieves the string supplied by the user and checks it for a usable url
	if (interaction.type == 2){
			url = interaction.options.getString('song');    
		if (url){
			res = await betterytsr.runSample(url); 		// searches youtube for the url, the url can be a specific video or a public playlist
			if (res === false){
				await currentVideoInfo(res, true);		// fills the current variable with actual data about the video
			} else {
				// checks if the supplied data is a playlist and if so moves the first video in the current variable
				if (res.IFPLAYLIST === false){
					await currentVideoInfo(res.PLAYLIST, false);
				} else if (res.IFPLAYLIST === true){
					current = res.PLAYLIST[0];
					res.PLAYLIST.shift();
				}
				
			}
		}
	}
	if (playerObjList.findIndex(x => x.GUILDID === interaction.guildId) != -1){			// searches if the a guild specific player has been created, if not then it will be created at the else statement below
		indexOfObjs = playerObjList.findIndex(x => x.GUILDID === interaction.guildId);	// gets the position of the guild specific player in the array
		// checks for which command was submitted, and runs the required code for that command
		switch(name){
			case ('play'):
				if (current.FILLED != 0){
					playerObjList[indexOfObjs].CONNECTION = connection;
					if (ytdl.validateURL(current.VIDEOID) == true){
						// checks if the players if the player is currently playing, if it is the video is added to queue, otherwise the player will begin playing the video
						if (playerObjList[indexOfObjs].PLAYER._state.status === 'idle' || playerObjList[indexOfObjs].PLAYER._state.status === 'autopaused'){
							playerObjList[indexOfObjs].PLAYER.play(await streamCreator(current.VIDEOID), false); // the streamCreator function is located at the bottom of this file and creates the stream for the video to be played
							playerObjList[indexOfObjs].CONNECTION.subscribe(playerObjList[indexOfObjs].PLAYER);
							playerObjList[indexOfObjs].CURRENT = current;
							playerObjList[indexOfObjs].INTERACTION = interaction;
							clearTimeout(playerObjList[indexOfObjs].TIMER);
							if (res.IFPLAYLIST === true){
								playerObjList[indexOfObjs].QUEUE = res.PLAYLIST;
							}
							await embedSelector(playerObjList[indexOfObjs].CURRENT, false);
							return interaction.editReply({ embeds: [embedObject], components: [buttons.sppq] });
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
				playerObjList[indexOfObjs].CURRENT = "0033";
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
			case ('shuffle'):
				if (playerObjList[indexOfObjs].QUEUE.length > 1){
					for (let i = playerObjList[indexOfObjs].QUEUE.length -1; i > 0; i--) {
						let j = Math.floor(Math.random() * i)
						let k = playerObjList[indexOfObjs].QUEUE[i]
						playerObjList[indexOfObjs].QUEUE[i] = playerObjList[indexOfObjs].QUEUE[j]
						playerObjList[indexOfObjs].QUEUE[j] = k
					}
					interaction.editReply('Shuffled.')
				} else {
					interaction.editReply('There is nothing to shuffle.')
				}
				
				break;
		}
	// here a guild specific player is created if it was not found before in the array, it is then added to the array after creation
	} else {
		if (name === 'play'){
			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Stop,
				},
			});

			// creates the listener on the player object to detect when the audio source has finished playing
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
			return interaction.editReply({ embeds: [embedObject], components: [buttons.sppq] });
		} else {
			return interaction.editReply('I am not currently in a voice currently channel. Use /play to play something first.');
		}
		return;
	}
}
// moves on to the next video once the one playing ends
async function listenerSkipper(audioPlayerInfo, client){
	if (audioPlayerInfo.STOPPING === true){return audioPlayerInfo.STOPPING = false;} // stops the function from running if the stop command was run
	if (audioPlayerInfo.NEEDSAREPLY === false){ 									// this needs to be checked for because there is a difference between simply sending a message from the bot and replying to a users command, example: the bot attempts to reply to no one with an embed because the bot skipped itself 
		if (audioPlayerInfo.LOOPING === true){ 										// checks if looping, no need to move on to the next song if the bot is set to loop the current one
			audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.CURRENT.VIDEOID));
			await embedSelector(audioPlayerInfo.CURRENT, false);
			/*return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send({ embeds: [embedObject] });*/
		} else {
			if (audioPlayerInfo.QUEUE.length != 0){
				audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.QUEUE[0].VIDEOID));
				audioPlayerInfo.CURRENT = audioPlayerInfo.QUEUE[0];
				audioPlayerInfo.QUEUE.shift();
				await embedSelector(audioPlayerInfo.CURRENT, false);
				return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send({ embeds: [embedObject], components: [buttons.sppq]});
			} else {
				audioPlayerInfo.TIMER = setTimeout(leave, 300000, audioPlayerInfo);
				return client.channels.cache.get(audioPlayerInfo.INTERACTION.channelId).send("There is nothing else left in queue.");
			}
		}			
	} else {
		if (audioPlayerInfo.QUEUE.length != 0){
			console.log("this");
			audioPlayerInfo.PLAYER.play(await streamCreator(audioPlayerInfo.QUEUE[0].VIDEOID));
			audioPlayerInfo.CURRENT = audioPlayerInfo.QUEUE[0];
			audioPlayerInfo.QUEUE.shift();
			audioPlayerInfo.NEEDSAREPLY = false;
			await embedSelector(audioPlayerInfo.CURRENT, false);
			return audioPlayerInfo.INTERACTION.editReply({ embeds: [embedObject], components: [buttons.sppq] });
		} else {
			audioPlayerInfo.NEEDSAREPLY = false;
			audioPlayerInfo.TIMER = setTimeout(leave, 300000, audioPlayerInfo);
			return audioPlayerInfo.INTERACTION.editReply("There is nothing else left in queue.");			
		}
	}
}
// creates the stream that is then played by a player object
async function streamCreator(videoURL){
	try {
		stream = createAudioResource(await ytdl(videoURL, { 
			filter: "audioonly",
		    fmt: "mp3",
		    highWaterMark: 1 << 62,
		    liveBuffer: 1 << 62,
		    dlChunkSize: 0,
		    bitrate: 128,
		    }));
	} catch (error) {
		console.error(error);
	} 
	
	return stream;
}
// embeds are used for the ui of the bot, this only exists to make the code easier to read
async function embedSelector(current, embedType){
	embedObject = await mainEmbed.playingQueueingEmbed(current, embedType);
	return embedObject;
}
// updates the current variable with actual data, this contains all the video info to be displayed on the embed
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
// this class object is used for managing multiple guilds using the bot 
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
	}
}

// this class object is used to hold all of the data for the current video
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