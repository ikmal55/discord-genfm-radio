const { 
  Client, 
  GatewayIntentBits 
} = require("discord.js");

const { joinVoiceChannel } = require("@discordjs/voice");

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
  console.log("MESSAGE MASUK:", message.content);

  if (message.author.bot) return;

  if (message.content === "!ping") {
    await message.reply("pong 🏓");
  }

  if (message.content === "!join") {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu");
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    await message.reply("Bot masuk voice ✅");
  }
});

client.login(process.env.TOKEN);
