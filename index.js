const { 
  Client, 
  GatewayIntentBits 
} = require("discord.js");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const RADIO_URL = "http://103.246.184.62:1935/noice_genfm/genfm/playlist.m3u8";

client.once("ready", () => {
  console.log(`BOT READY: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!radio") {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu");
    }

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();

    const resource = createAudioResource(RADIO_URL, {
      inlineVolume: true
    });

    resource.volume.setVolume(1);

    player.play(resource);
    connection.subscribe(player);

    message.reply("📻 Oink Radio GenFM diputar!");
  }
});

client.login(process.env.TOKEN);
