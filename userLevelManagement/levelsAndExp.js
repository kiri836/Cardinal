const { Discord, Events } = require('discord.js');
const sql = require("sqlite3");
const voiceChannelJoinTime = new Map();
const banner = require("./banners.js");
const leaderboardEmbedd = require("../embeds/leaderboardEmbed.js");
const fs = require('node:fs');
var rowOutput;
var errors;
var decider;
var time;
var messages;
var messagePoints;
var msInVoice;
var level;
var exp;
var lumen;

const users = [];
var perLevelExpRequirements = [];

let i = 0;
while (i < 500){
  perLevelExpRequirements.push(Math.round(((i ** .9) * 100)));
  i++;
}

if (!fs.existsSync('./userLevelManagement/points.db')){
  setTimeout(addPlaceholders, 5000);

}
const db = new sql.Database('./userLevelManagement/points.db', (err) => {
  if (err) {
    // Log the error
    console.error(err.message);
  } else {
    // Create the "points" table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS points (
      user_id TEXT PRIMARY KEY,
      msInVoice INTEGER,
      messagesSent INTEGER,
      messagePoints INTEGER,
      steamPoints INTEGER,
      userLevel INTEGER,
      userExp INTEGER,
      lumen INTEGER,
      totalExp INTEGER
    )`);
  }
});

function addPlaceholders(){
  i = 0;
  while (i < 7){
    let thing = new userStats;
    thing.userid = 'placeholder' + i;
    db.run(`INSERT INTO points (user_id, msInVoice, messagesSent, messagePoints, steamPoints, userLevel, userExp, lumen, totalExp) VALUES('${thing.userid}', 0, 0, 0, 0, 0, 0, 0, 0)`);
    i++;
  }
}
//checks for users joining and leaving VCs
async function userVoiceDataAssignment(oldState, newState){
  if (newState.member.user.bot){ return; }
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const userId = newState.member.user.id;

  if (oldChannel !== newChannel) {
    if (oldChannel) {
      // User left a voice channel
      const joinTime = voiceChannelJoinTime.get(`${oldChannel.id}-${userId}`);
      if (joinTime) {
        const timeInVC = Date.now() - joinTime;
        assignVoicePoints(userId, timeInVC);
        //Do something with the time in VC data, such as save it to a database or log it
      }
      voiceChannelJoinTime.delete(`${oldChannel.id}-${userId}`);
    }

    if (newChannel) {
      // User joined a voice channel
      const joinTime = Date.now();
      voiceChannelJoinTime.set(`${newChannel.id}-${userId}`, joinTime);
    }
  }
}

//checks for new messages from users
async function userMessageDataAssignment(message){
  if(message.author.bot){ return; }
  let userId = message.author.id;
  if (users.findIndex(x => x.userid === userId) != -1){
    index = users.findIndex(x => x.userid === userId);
    timeout = Date.now() - users[index].messageTimeout;
    if (timeout >= 60000){
      assignMessagePoints(userId, 0);
      users[index].messageTimeout = Date.now();
      return;
    } else {
      assignMessagePoints(userId, 1);
      return;
    }
  } else {
    users.push(new userStats(userId, 0, 0, 0, 0, 0, 0, Date.now(), 0));
  }
}

//interaction handling for rank, leaderboard and set
async function userDataDisplayAssignment(interaction){
  let user = new userStats;
  user.rank = [];
  user.userid = interaction.user.id;
  await exists(user.userid);
  if (errors === null && rowOutput === undefined){
    db.run(`INSERT INTO points (user_id, msInVoice, messagesSent, messagePoints, steamPoints, userLevel, userExp, lumen, totalExp) VALUES(${user.userid}, 0, 0, 0, 0, 1, 0, 0, 0)`);
  }
  if (interaction.commandName ==="rank"){
    if (!(interaction.options._hoistedOptions == "")){
      if(interaction.options.getUser('user').bot) {return interaction.reply("You can't check the rank of a bot.")};
      user.userid = interaction.options.getUser('user').id;
    }

    await dataOutput(user);
    await updateEverything(user);

    await getRanking(user);
    let userbanner = await banner.imageCreation(user, interaction);
    return interaction.reply({ files: [userbanner] });
  }

  if (interaction.commandName === "leaderboard"){
    
    await dataOutput(user);
    let topLevels = [];
    let topVoice = [];
    let topText = [];

    await getLeaderboard(topLevels, topVoice, topText);
    interaction.reply({ embeds: [await leaderboardEmbedd.leaderBoardEmbedd(user, topLevels, topVoice, topText)] });
  }

  if (interaction.commandName === "set"){
    let modifiedUser = interaction.options.getUser('user').id;
   if (interaction.user.id == 242375862379347969){
    await exists(modifiedUser);
    if (errors === null && rowOutput === undefined){
      db.run(`INSERT INTO points (user_id, msInVoice, messagesSent, messagePoints, steamPoints, userLevel, userExp, lumen, totalExp) VALUES(${modifiedUser}, 0, 0, 0, 0, 1, 0, 0, 0)`);
      console.log("this");
    }
      if ((interaction.options.getString('time') != undefined && interaction.options.getString('messages') != undefined) && (typeof interaction.options.getString('time') == typeof 50  && typeof interaction.options.getString('messages') == typeof 50)){
        db.run(`UPDATE points SET msInVoice = ${interaction.options.getString('time')}, messagePoints = ${interaction.options.getString('messages')} WHERE user_id = ${modifiedUser}`);
        await dataOutput(user);
        await updateEverything(user);
      } else if (interaction.options.getString('time') != undefined && typeof interaction.options.getString('time') == typeof 50){
        db.run(`UPDATE points SET msInVoice = ${parseInt(interaction.options.getString('time'))} WHERE user_id = ${modifiedUser}`);
        await dataOutput(user);
        await updateEverything(user);
      } else if (interaction.options.getString('messages') != undefined && typeof interaction.options.getString('messages') == typeof 50){
        db.run(`UPDATE points SET messagesSent = ${parseInt(interaction.options.getString('messages'))} WHERE user_id = ${modifiedUser}`);
        await dataOutput(user);
        await updateEverything(user);
      }     
   } else {
    return interaction.reply("You do not have the permissions to use this command.");
   }
  }
}

//checks if a user exists in the database
function exists(userId){
  return new Promise(function(resolve) {
    db.get(`SELECT user_id FROM points WHERE user_id = ${userId}`, [], async (err, row) => { 
      await setTimeout(() => {
        rowOutput = row;
        errors = err;
        resolve();
      }, 10);
    });    
  });
}

//returs the total amount of time a user has spent in VCs
function timeIn(userId){
  return new Promise(function(resolve) {
    db.get(`SELECT msInVoice FROM points WHERE user_id = ${userId}`, [], (err, row) => { 
      time = row.msInVoice;
    });
    
    setTimeout(resolve, 100);
  });
}

//updates the users VC point value
async function assignVoicePoints(userId, timeInVC){  
  await exists(userId);
  let user = new userStats;
  user.userid = userId;
  await dataOutput(user);

  if (errors === null && rowOutput != undefined){
    await timeIn(userId);
    user.exp = user.exp + Math.round((timeInVC/60000) * 3);
    timeInVC = time + timeInVC;
    db.run(`UPDATE points SET msInVoice = ${timeInVC}, userExp = ${user.exp} WHERE user_id = ${userId}`);
  } else if (errors != null && rowOutput === undefined){
    db.run(`INSERT INTO points (user_id, msInVoice, messagesSent, messagePoints, steamPoints, userLevel, userExp, lumen, totalExp) VALUES(${userId}, ${timeInVC}, 0, 0, 0, 1, ${user.exp}, 0, 0)`);
  } else {
    console.log("A problem has occured.");
  }
}

function messageCounter(userId){
  return new Promise(function(resolve) {
    db.get(`SELECT messagesSent, messagePoints, userExp FROM points WHERE user_id = ${userId}`, [], async (err, row) => { 
      await setTimeout(() =>{
        messages = row.messagesSent;
        messagePoints = row.messagePoints;
        exp = row.userExp;
        resolve();
      },);
    });
  });
}

async function assignMessagePoints(userId, set){  
  await exists(userId);
  if (set === 1){
    await messageCounter(userId);
    messages++;
    db.run(`UPDATE points SET messagesSent = ${messages} WHERE user_id = ${userId}`);
    return;
  }
  if (errors === null && rowOutput != undefined){
    await messageCounter(userId);
    messages++;
    let random = getRndInteger();
    messagePoints = messagePoints + random;
    exp = exp + random;
    messagePoints = Number.parseFloat(messagePoints).toFixed(0);
    db.run(`UPDATE points SET messagesSent = ${messages}, messagePoints = ${messagePoints}, userExp = ${exp} WHERE user_id = ${userId}`);
  } else if (errors === null && rowOutput === undefined){
    messages = 1;
    messagePoints = getRndInteger();
    exp = messagePoints;
    messagePoints = Number.parseFloat(messagePoints).toFixed(0);
    db.run(`INSERT INTO points (user_id, msInVoice, messagesSent, messagePoints, steamPoints, userLevel, userExp, lumen, totalExp) VALUES(${userId}, 0, ${messages}, ${messagePoints}, 0, 1, ${exp}, 0, 0)`);
  } else {
  }
}

function getRndInteger() {
  return Math.floor(Math.random() * (7 - 1) ) + 1;
}

//gets all the data about a given user and updates the provided variable with the data
function dataOutput(user){
  return new Promise(function(resolve) {
    db.get(`SELECT msInVoice, messagesSent, messagePoints, userLevel, userExp, lumen, totalExp FROM points WHERE user_id = ${user.userid}`, [], async (err, row) => {
      await setTimeout(() => {
        user.msInVoice = row.msInVoice;
        user.messagecount = row.messagesSent;
        user.messagepoints = row.messagePoints;
        user.level = row.userLevel;
        user.exp = row.userExp;
        user.lumen = row.lumen;
        user.totalExp = row.totalExp;
        resolve();
      },50);
    });
  });
}

function updateEverything(user){
  user.totalExp = Math.round((user.msInVoice/60000) * 3) + user.messagepoints;
  user.levelExpPercent = Math.round(((user.exp / perLevelExpRequirements[user.level]) * 100));
  user.expRequired = perLevelExpRequirements[user.level];
    while (user.levelExpPercent > 100){
      user.level = user.level + 1;
      user.exp = user.exp - perLevelExpRequirements[(user.level - 1)]
      user.expRequired = perLevelExpRequirements[user.level];
      user.levelExpPercent = Math.round(((user.exp / perLevelExpRequirements[user.level]) * 100));
    }
  db.run(`UPDATE points SET messagesSent = ${user.messagecount}, messagePoints = ${user.messagepoints}, userLevel = ${user.level}, userExp = ${user.exp}, totalExp = ${user.totalExp} WHERE user_id = ${user.userid}`);
}
//feels like unnecessary repetion here, should be shortened if possible
function getLeaderboard(topLevels, topVoice, topText){
  return new Promise(function(resolve) {
    db.all(`SELECT user_id, userLevel FROM points ORDER BY userLevel DESC LIMIT 7`, [], async (err, row) => {
      await setTimeout(() => {
        topLevels[0] = row[0];
        topLevels[1] = row[1];
        topLevels[2] = row[2];
        topLevels[3] = row[3];
        topLevels[4] = row[4];
        topLevels[5] = row[5];
        topLevels[6] = row[6];
      });
    });
    db.all(`SELECT user_id, messagesSent FROM points ORDER BY messagesSent DESC LIMIT 7`, [], async (err, row) => {
      await setTimeout(() => {
        topText[0] = row[0];
        topText[1] = row[1];
        topText[2] = row[2];
        topText[3] = row[3];
        topText[4] = row[4];
        topText[5] = row[5];
        topText[6] = row[6];
      }, 50);
    });
    db.all(`SELECT user_id, msInVoice FROM points ORDER BY msInVoice DESC LIMIT 7`, [], async (err, row) => {
      await setTimeout(() => {
        topVoice[0] = row[0];
        topVoice[1] = row[1];
        topVoice[2] = row[2];
        topVoice[3] = row[3];
        topVoice[4] = row[4];
        topVoice[5] = row[5];
        topVoice[6] = row[6];
        resolve();
      }, 100);
    });
  });
}

//SELECT COUNT(*) FROM (SELECT user_id, userLevel FROM points ORDER BY userLevel DESC) WHERE userLevel > (SELECT userLevel FROM points WHERE user_id = ${userid})

//same problem here as above
function getRanking(user){
  return new Promise(function(resolve) {
    db.get(`SELECT COUNT(*) FROM points WHERE totalExp > $exp`, { $exp: user.totalExp }, async (err, row) => {
      await setTimeout(() => {
        user.rank[0] = row['COUNT(*)'] + 1;
      });
    });
    db.get(`SELECT COUNT(*) FROM points WHERE msInVoice > $voice`, { $voice: user.msInVoice }, async (err, row) => {
      await setTimeout(() => {
        user.rank[1] = row['COUNT(*)'] + 1;
      }, 50);
    });
    db.get(`SELECT COUNT(*) FROM points WHERE messagesSent > $messages`, { $messages: user.messagecount }, async (err, row) => {
      await setTimeout(() => {
        user.rank[2] = row['COUNT(*)'] + 1;
        resolve();
      }, 100);
    });
  });
}


//contains the all of the stats of a user
class userStats {
  constructor(userid, msInVoice, messagecount, messagepoints, level, exp, totalExp, lumen, messageTimeout, expRequired, levelExpPercent, rank) {
    this.userid = userid;
    this.msInVoice = msInVoice;
    this.messagecount = messagecount; 
    this.messagepoints = messagepoints;
    this.level = level;
    this.exp = exp;
    this.totalExp = totalExp;
    this.lumen = lumen;
    this.messageTimeout = messageTimeout;
    this.expRequired = expRequired;
    this.levelExpPercent = levelExpPercent;
    this.rank = rank;
  }
}

module.exports = {
  db, userDataDisplayAssignment, userMessageDataAssignment, userVoiceDataAssignment
}