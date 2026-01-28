const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const STREAM_URL = "http://n09.radiojar.com/7csmg90fuqruv.mp3";

client.once("ready", () => {
  console.log(`BOT READY: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!radio") {
    const channel = message.member.voice.channel;
    if (!channel) return message.reply("Masuk voice dulu.");

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    const player = createAudioPlayer();

    const resource = createAudioResource(STREAM_URL, {
      inlineVolume: true
    });

    resource.volume.setVolume(1);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🔊 Radio is playing");
    });

    player.on("error", error => {
      console.error("Audio error:", error);
    });

    message.reply("📻 Radio ON (24 jam)");
  }
});

client.login("TOKEN_BOT_KAMU");
