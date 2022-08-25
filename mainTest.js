const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('node:fs');
const { Client } = require('discord.js');
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const clientId = '517202141383884810';
const guildId = '379341801984884737';
const { NoSubscriberBehavior,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  joinVoiceChannel, } = require('@discordjs/voice');
const audioHandler = require('./musiccommands.js');

const bugs = require('./bugslist.js');

const rest = new REST({ version: '9' }).setToken(token);
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
var connection;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

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
  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  
  const command = commands.indexOf(commands.find(x => x.name === interaction.commandName));
  var fileReference = require(`./commands/${commandFiles[command]}`);
  if (command < 0) return;
  try {
    if (fileReference.name === 'play'){
      Join(interaction);
      audioHandler.mainPlayer(interaction, connection, fileReference.name, client);
    }
    else if (fileReference.name === 'pause' || fileReference.name === 'queue' || fileReference.name === 'resume' || fileReference.name === 'skip' || fileReference.name === 'loop' || fileReference.name === 'stop' || fileReference.name === 'leave') {
      audioHandler.mainPlayer(interaction, connection, fileReference.name, client);
    }
    else if (fileReference.name === 'bugs'){
      interaction.reply({ embeds: [bugs.exampleEmbed] });
    } 
    else if (fileReference.name === 'bug') {
      interaction.reply('This command is still in development!');
    } 
    else {
      console.log('an error occured!');
      return;
    }
  } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

(async () => { try { await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands },);} catch (error) {console.error(error);}})();

client.login(token);