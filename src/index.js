require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
  console.error('Missing DISCORD_TOKEN in environment. Create a .env file or pass it via environment variables.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsDirectory = path.join(__dirname, 'commands');
if (fs.existsSync(commandsDirectory)) {
  const commandFiles = fs.readdirSync(commandsDirectory).filter((fileName) => fileName.endsWith('.js'));
  for (const fileName of commandFiles) {
    const commandPath = path.join(commandsDirectory, fileName);
    const commandModule = require(commandPath);
    if (commandModule && commandModule.data && commandModule.execute) {
      client.commands.set(commandModule.data.name, commandModule);
    }
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
  }
});

client.login(discordToken);