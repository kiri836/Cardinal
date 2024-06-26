const { EmbedBuilder, userMention } = require('discord.js');

async function leaderBoardEmbedd(user, topLevels, topVoice, topText) {
	var exampleEmbed;
	function msToTime(s) {
	  var ms = s % 1000;
	  s = (s - ms) / 1000;
	  var secs = s % 60;
	  s = (s - secs) / 60;
	  var mins = s % 60;
	  var hrs = (s - mins) / 60;
	  if (hrs == 0){
	  	if (mins == 0){
	  		return secs + ' s';
	  	}
	  	return mins + ' m ' + secs + ' s';
	  }

	  return hrs + ' h ' + mins + ' m ' + secs + ' s';
	}
	exampleEmbed = new EmbedBuilder()
			.setColor('#ffffff')
			.setTimestamp();

	if (user.rank[0] > 7){
		exampleEmbed.addFields(
			{ name: 'Top Levels:', value: `#1 | <@${topLevels[0].user_id}> \xa0-\xa0 lvl: ${topLevels[0].userLevel}\n` 
			                            + `#2 | <@${topLevels[1].user_id}> \xa0-\xa0 lvl: ${topLevels[1].userLevel}\n`
			                            + `#3 | <@${topLevels[2].user_id}> \xa0-\xa0 lvl: ${topLevels[2].userLevel}\n`
			                            + `#4 | <@${topLevels[3].user_id}> \xa0-\xa0 lvl: ${topLevels[3].userLevel}\n`
			                            + `#5 | <@${topLevels[4].user_id}> \xa0-\xa0 lvl: ${topLevels[4].userLevel}\n`
			                            + `#6 | <@${topLevels[5].user_id}> \xa0-\xa0 lvl: ${topLevels[5].userLevel}\n`
			                            + `#7 | <@${topLevels[6].user_id}> \xa0-\xa0 lvl: ${topLevels[6].userLevel}\n`
			                            + `\n....`
			                            + `#${user.rank[0]} | <@${user.userid}> \xa0-\xa0 lvl: ${user.level}\n`}
		);
	} else {
		exampleEmbed.addFields(
				{ name: 'Top Levels:', value: `#1 | <@${topLevels[0].user_id}> \xa0-\xa0 lvl: ${topLevels[0].userLevel}\n`
				                            + `#2 | <@${topLevels[1].user_id}> \xa0-\xa0 lvl: ${topLevels[1].userLevel}\n`
				                            + `#3 | <@${topLevels[2].user_id}> \xa0-\xa0 lvl: ${topLevels[2].userLevel}\n`
				                            + `#4 | <@${topLevels[3].user_id}> \xa0-\xa0 lvl: ${topLevels[3].userLevel}\n`
				                            + `#5 | <@${topLevels[4].user_id}> \xa0-\xa0 lvl: ${topLevels[4].userLevel}\n`
				                            + `#6 | <@${topLevels[5].user_id}> \xa0-\xa0 lvl: ${topLevels[5].userLevel}\n`
				                            + `#7 | <@${topLevels[6].user_id}> \xa0-\xa0 lvl: ${topLevels[6].userLevel}\n`}
		);

	}
	if (user.rank[1] > 7) {
		exampleEmbed.addFields(
			{ name: 'Top Text:', value: `#1 | <@${topText[0].user_id}> \xa0-\xa0 msgs: ${topText[0].messagesSent.toLocaleString()}\n`
			                          + `#2 | <@${topText[1].user_id}> \xa0-\xa0 msgs: ${topText[1].messagesSent.toLocaleString()}\n`
			                          + `#3 | <@${topText[2].user_id}> \xa0-\xa0 msgs: ${topText[2].messagesSent.toLocaleString()}\n`
			                          + `#4 | <@${topText[3].user_id}> \xa0-\xa0 msgs: ${topText[3].messagesSent.toLocaleString()}\n`
			                          + `#5 | <@${topText[4].user_id}> \xa0-\xa0 msgs: ${topText[4].messagesSent.toLocaleString()}\n`
			                          + `#6 | <@${topText[5].user_id}> \xa0-\xa0 msgs: ${topText[5].messagesSent.toLocaleString()}\n`
			                          + `#7 | <@${topText[6].user_id}> \xa0-\xa0 msgs: ${topText[6].messagesSent.toLocaleString()}\n`
			                          + `\n....`
			                          + `#${user.rank[1]} | <@${user.userid}> \xa0-\xa0 msgs: ${user.messagecount.toLocaleString()}\n`}
		);
	}else{
		exampleEmbed.addFields(
			{ name: 'Top Text:', value: `#1 | <@${topText[0].user_id}> \xa0-\xa0 msgs: ${topText[0].messagesSent.toLocaleString()}\n`
				                          + `#2 | <@${topText[1].user_id}> \xa0-\xa0 msgs: ${topText[1].messagesSent.toLocaleString()}\n`
				                          + `#3 | <@${topText[2].user_id}> \xa0-\xa0 msgs: ${topText[2].messagesSent.toLocaleString()}\n`
				                          + `#4 | <@${topText[3].user_id}> \xa0-\xa0 msgs: ${topText[3].messagesSent.toLocaleString()}\n`
				                          + `#5 | <@${topText[4].user_id}> \xa0-\xa0 msgs: ${topText[4].messagesSent.toLocaleString()}\n`
				                          + `#6 | <@${topText[5].user_id}> \xa0-\xa0 msgs: ${topText[5].messagesSent.toLocaleString()}\n`
				                          + `#7 | <@${topText[6].user_id}> \xa0-\xa0 msgs: ${topText[6].messagesSent.toLocaleString()}\n`}
		);
	}
	if (user.rank[2] > 7){
		exampleEmbed.addFields(
			{ name: 'Top Voice:', value: `#1 | <@${topVoice[0].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[0].msInVoice)}\n`
		                               + `#2 | <@${topVoice[1].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[1].msInVoice)}\n`
		                               + `#3 | <@${topVoice[2].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[2].msInVoice)}\n`
		                               + `#4 | <@${topVoice[3].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[3].msInVoice)}\n`
		                               + `#5 | <@${topVoice[4].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[4].msInVoice)}\n`
		                               + `#6 | <@${topVoice[5].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[5].msInVoice)}\n`
		                               + `#7 | <@${topVoice[6].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[6].msInVoice)}\n`
		                               + `\n....`
		                               + `#${user.rank[2]} | <@${user.userid}> \xa0-\xa0 time: ${msToTime(user.msInVoice)}\n`}
		);
	}else{
		exampleEmbed.addFields(
			{ name: 'Top Voice:', value: `#1 | <@${topVoice[0].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[0].msInVoice)}\n`
			                               + `#2 | <@${topVoice[1].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[1].msInVoice)}\n`
			                               + `#3 | <@${topVoice[2].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[2].msInVoice)}\n`
			                               + `#4 | <@${topVoice[3].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[3].msInVoice)}\n`
			                               + `#5 | <@${topVoice[4].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[4].msInVoice)}\n`
			                               + `#6 | <@${topVoice[5].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[5].msInVoice)}\n`
			                               + `#7 | <@${topVoice[6].user_id}> \xa0-\xa0 time: ${msToTime(topVoice[6].msInVoice)}\n`}
		);	
	}
	return exampleEmbed;
}

module.exports = {
	leaderBoardEmbedd
}