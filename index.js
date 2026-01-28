const { Client, GatewayIntentBits } = require("discord.js");
const { Manager } = require("erela.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const manager = new Manager({
  nodes: [{
    host: process.env.LAVALINK_HOST,
    port: Number(process.env.LAVALINK_PORT),
    password: process.env.LAVALINK_PASSWORD,
    secure: process.env.LAVALINK_SECURE === "true"
  }],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  }
});

client.once("ready", () => {
  console.log("Bot ready");
  manager.init(client.user.id);
});

client.on("raw", d => manager.updateVoiceState(d));

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "oinkradio") return;

  const vc = interaction.member.voice.channel;
  if (!vc) return interaction.reply("Masuk voice channel dulu");

  const player = manager.create({
    guild: interaction.guild.id,
    voiceChannel: vc.id,
    textChannel: interaction.channel.id,
    selfDeafen: true
  });

  player.connect();
  player.play(process.env.RADIO_URL);

  interaction.reply("📻 GenFM ON 24 JAM");
});

client.login(process.env.DISCORD_TOKEN);

const { joinVoiceChannel } = require("@discordjs/voice");

client.on("messageCreate", async (message) => {
  if (message.content === "!join") {
    if (!message.member.voice.channel) {
      return message.reply("Masuk voice dulu");
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    message.reply("Bot masuk voice ✅");
  }
});
