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
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const RADIO_URL = 'http://n09.radiojar.com/7csmg90fuqruv.mp3';

const player = createAudioPlayer();

client.once('ready', () => {
  console.log(`BOT READY: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!radio') {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('masuk voice dulu ya 🎧');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    const resource = createAudioResource(RADIO_URL);
    player.play(resource);
    connection.subscribe(player);

    message.reply('📻 Radio ON!');
  }

  if (message.content === '!stop') {
    player.stop();
    message.reply('⛔ Radio OFF');
  }
});

client.login(process.env.DISCORD_TOKEN);
