const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const authorization = require("../Config.js");
const token = authorization.token;
const fs = require('node:fs');
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const commands = [];
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
const clientId = authorization.clientID;
const { NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  joinVoiceChannel, } = require('@discordjs/voice');
const audioHandler = require('./musiccommands.js');
const help = require('./helpembed.js');
const bugs = require('./bugslist.js');
const database = require('./Database and points/sqldatabase.js');
// const guildId = "954904615357390939";

const rest = new REST({ version: '9' }).setToken(token);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages], partials: [Partials.Channel] });
var connection;


// adds all the separate command files into one data array
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// joins the users voice channel and updates the connection variable with the connection information
async function Join(interaction) {
  const channel = interaction.member.voice.channel;
  connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
  try {
    await Promise.race([
      entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
      entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
    ]);
    // Seems to be reconnecting to a new channel - ignore disconnect
  } catch (error) {
    // Seems to be a real disconnect which SHOULDN'T be recovered from
  }
  });
  connection.on('stateChange', (oldState, newState) => {
    const oldNetworking = Reflect.get(oldState, 'networking');
    const newNetworking = Reflect.get(newState, 'networking');

    const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
      const newUdp = Reflect.get(newNetworkState, 'udp');
      clearInterval(newUdp?.keepAliveInterval);
    }

    oldNetworking?.off('stateChange', networkStateChangeHandler);
    newNetworking?.on('stateChange', networkStateChangeHandler);
  });
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

// interation handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;
  const command = commands.indexOf(commands.find(x => x.name === interaction.commandName)); // finds the interaction command
  var fileReference = require(`./commands/${commandFiles[command]}`); // gets the needed information from the command file using the command variable above
  if (command < 0) return;
  try {
    if (fileReference.name === 'play'){
      Join(interaction);
      audioHandler.mainPlayer(interaction, connection, fileReference.name, client); // handles all the audio logic with the parced variables
    }
    else if (fileReference.name === 'pause' || fileReference.name === 'queue' || fileReference.name === 'resume' || fileReference.name === 'skip' || fileReference.name === 'loop' || fileReference.name === 'stop' || fileReference.name === 'leave' || fileReference.name === 'shuffle') {
      audioHandler.mainPlayer(interaction, connection, fileReference.name, client);
    }
    else if (fileReference.name === 'bugs'){
      interaction.reply({ embeds: [bugs.exampleEmbed] });
    } 
    else if (fileReference.name === 'support') {
      interaction.reply('https://www.patreon.com/Kiri836');
    } 
    else if (fileReference.name === 'help'){
      interaction.reply({ embeds: [help.exampleEmbed] });
    }
    else {
      return;
    }
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', (message) => {
  if(message.author.bot) return;
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
    users.push(new userMessages(userId, 0, 0, 0, 0, 0, 0, Date.now(), 0));
  }
  
});

//client.on(Events.InteractionCreate, interaction => {
//  if (!interaction.isButton()) return;
//  console.log(interaction);
//  audioHandler.mainPlayer(interaction, connection, interaction.customId, client);
//});

// sends the commands array to discord so that the commands are actually registered for this application on discords servers
(async () => { try { await rest.put(Routes.applicationCommands(clientId), { body: commands },);} catch (error) {console.error(error);}})();

client.login(token);

module.exports = {
  client
}