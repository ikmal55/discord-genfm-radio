const { Client, GatewayIntentBits } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// ====== CONFIG ======
const RADIO_URL = 'http://n09.radiojar.com/7csmg90fuqruv.mp3';
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
// ====================

let connection;
const player = createAudioPlayer();

function playRadio() {
  const resource = createAudioResource(RADIO_URL, {
    inlineVolume: true
  });

  resource.volume.setVolume(1);
  player.play(resource);

  if (connection) {
    connection.subscribe(player);
  }

  console.log('📻 Radio playing...');
}

function connectVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.log('❌ Guild not found');

  const channel = guild.channels.cache.get(VOICE_CHANNEL_ID);
  if (!channel) return console.log('❌ Voice channel not found');

  connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator
  });

  playRadio();
}

// auto reconnect
player.on(AudioPlayerStatus.Idle, () => {
  console.log('🔄 Restarting radio...');
  playRadio();
});

client.once('ready', () => {
  console.log(`BOT READY: ${client.user.tag}`);
  connectVoice();
});

client.login(process.env.DISCORD_TOKEN);
