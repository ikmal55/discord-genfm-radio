const {
  Client,
  GatewayIntentBits
} = require("discord.js");

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const prism = require("prism-media");

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const RADIO_URL = "http://103.246.184.62:1935/noice_genfm/genfm/playlist.m3u8";
// ==========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  console.log(`BOT READY: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // TEST BOT HIDUP
  if (message.content === "!ping") {
    return message.reply("pong 🏓");
  }

  // PLAY RADIO
  if (message.content === "!radio") {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu ya 🎧");
    }

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    const player = createAudioPlayer();

    const ffmpeg = new prism.FFmpeg({
      args: [
        "-re",
        "-i", RADIO_URL,
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "2"
      ]
    });

    const resource = createAudioResource(ffmpeg);

    player.play(resource);
    connection.subscribe(player);

    message.reply("📻 Oink Radio GenFM ON AIR!");
  }
});

client.login(TOKEN);
