const { AttachmentBuilder } = require('discord.js');
const { createCanvas, Image } = require('@napi-rs/canvas');
const canvas = createCanvas(860, 360);
const ctx = canvas.getContext('2d');
const { request } = require('undici');
const { readFile } = require('fs/promises');
var http = require('http');
var fs = require('fs');


async function imageCreation(user, interaction){
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	var avatarIdentification;
	var message;
	canvas.width = canvas.width;
	if (!(interaction.options._hoistedOptions == "")){
		avatarIdentification = interaction.options.getUser('user');
		message = interaction.options.getUser('user');
	} else {
		avatarIdentification = interaction.user;
		message = interaction.member.user;
	}
	const applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');

		let fontSize = 50;
		ctx.font = `${fontSize}px sans-serif`;
		while (ctx.measureText(text).width > 200){
			fontSize = fontSize - 5;
			ctx.font = `${fontSize}px sans-serif`;
		} 
		return ctx.font;
	};

	const background = await readFile('../bot rewrite/userbanners/banner2.jpg');
	const backgroundImage = new Image();
	backgroundImage.src = background;
	ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = '#ffffff';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	
	const { body } = await request(avatarIdentification.displayAvatarURL({ extension: 'jpg' }));
	const avatar = new Image();
	avatar.src = Buffer.from(await body.arrayBuffer());

	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.roundRect(0, 0, canvas.width, 10);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = '#FF0000';
	ctx.roundRect(0, 0, canvas.width * (user.levelExpPercent / 100), 10);
	ctx.fill();
	ctx.stroke();

	ctx.textBaseline = 'middle';
	ctx.textAlign = "center";

	ctx.font = await applyText(canvas, message.username);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(message.username, 720, 310);

	ctx.font = "23px sans-serif";
	ctx.fillText("Messages", 170, 300);
	ctx.fillText(`${user.messagecount}`, 170, 330);

	function msToTime(s) {
	  var ms = s % 1000;
	  s = (s - ms) / 1000;
	  var secs = s % 60;
	  s = (s - secs) / 60;
	  var mins = s % 60;
	  var hrs = (s - mins) / 60;

	  return hrs + ' hrs ' + mins + ' mins ' + secs + ' secs';
	}

	ctx.font = "23px sans-serif";
	ctx.fillText("Voice Time", 430, 300);
	ctx.fillText(msToTime(user.msInVoice), 430, 330);

	ctx.textBaseline = 'bottom';
	ctx.textAlign = "left";

	ctx.font = "20px sans-serif";
	ctx.fillText(`Level: ${user.level}`, 5, 35);
	
	ctx.textBaseline = 'bottom';
	ctx.textAlign = "right";

	ctx.font = "20px sans-serif";
	ctx.fillText(`${user.exp.toLocaleString("en-US") + " / " + user.expRequired.toLocaleString("en-US") + " exp"}`, 855, 35);

	ctx.textBaseline = 'top';
	ctx.textAlign = "center";

	ctx.font = "20px sans-serif";
	ctx.fillText(`Rank: #${user.rank[0]}`, 430, 15);

	ctx.beginPath();
	ctx.arc(720, 180, 100, 0, Math.PI * 2, true);
	ctx.stroke();
	ctx.clip();
	ctx.drawImage(avatar, 620, 80, 200, 200);

	//fs.writeFileSync(`C:\\Users\\kiril\\Documents\\previous files\\bot rewrite\\userbanners\\${user.userid}.png`, await canvas.encode('png'));

	let image = new AttachmentBuilder(await canvas.encode('png'), `profilecard.png`);
	return image;
}




module.exports = {
	imageCreation
}