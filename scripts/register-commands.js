require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const discordToken = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // optional for global vs guild

if (!discordToken || !clientId) {
  console.error('Missing required env vars. Ensure DISCORD_TOKEN and CLIENT_ID are set. Optionally set GUILD_ID for guild-scoped registration.');
  process.exit(1);
}

const commands = [];
const commandsDirectory = path.join(__dirname, '..', 'src', 'commands');
if (fs.existsSync(commandsDirectory)) {
  const commandFiles = fs.readdirSync(commandsDirectory).filter((fileName) => fileName.endsWith('.js'));
  for (const fileName of commandFiles) {
    const commandPath = path.join(commandsDirectory, fileName);
    const command = require(commandPath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(discordToken);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands...`);

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Successfully reloaded guild application (/) commands.');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Successfully reloaded global application (/) commands.');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();