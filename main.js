const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const authorization = require("../Config.js");
const token = authorization.token;
const fs = require('node:fs');
const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const clientId = authorization.clientID;
const { NoSubscriberBehavior, StreamType, createAudioPlayer, createAudioResource, entersState, AudioPlayerStatus, VoiceConnectionStatus, joinVoiceChannel, } = require('@discordjs/voice');
const audioHandler = require('./musicHandler.js');
const help = require('./embeds/helpembed.js');
const bugs = require('./bugslist.js');
const database = require('./userLevelManagement/levelsAndExp.js');
const warningHandler = include('./warningManagement/warningHandler');

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
  if (interaction.isButton()) {
    audioHandler.mainPlayer(interaction, connection, interaction.customId, client);
  }
  if (!interaction.isCommand()) return;
  const command = commands.indexOf(commands.find(x => x.name === interaction.commandName)); // finds the interaction command
  var fileReference = require(`./commands/${commandFiles[command]}`); // gets the needed information from the command file using the command variable above
  if (command < 0) return;
  try {
    switch(fileReference.name){
      case "play":
        Join(interaction);
      case "pause":
      case "queue":
      case "resume":
      case "skip":
      case "loop":
      case "stop":
      case "leave":
      case "shuffle":
        audioHandler.mainPlayer(interaction, connection, fileReference.name, client);
        break;
      case "bugs":
        interaction.reply({ embeds: [bugs.exampleEmbed] });
        break;
      case "support":
        interaction.reply('https://www.patreon.com/Kiri836');
        break;
      case "help":
        interaction.reply({ embeds: [help.exampleEmbed] });
        break;
      case "set":
      case "leaderboard":
      case "rank":
        database.userDataDisplayAssignment(interaction);
        break;
      case "warn":
        warningHandler.warn(interaction);
        break;
      case "warnings":
        warningHandler.warnings(interaction);
        break;
      case "removewarning":
        warningHandler.removeWarning(interaction);
        break;
      default:
        return;
    }
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('messageCreate', (message) => {
  database.userMessageDataAssignment(message);
});

client.on('voiceStateUpdate', (oldState, newState) => {
  database.userVoiceDataAssignment(oldState, newState);
});

// sends the commands array to discord so that the commands are actually registered for this application on discords servers
(async () => { try { await rest.put(Routes.applicationCommands(clientId), { body: commands },);} catch (error) {console.error(error);}})();

client.login(token);

module.exports = {
  client
}