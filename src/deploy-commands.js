const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { readFiles } = require('./utils/utils');
const { token, clientId, guildId } = require('../config.json');

const commands = [];
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  const commandFiles = await readFiles('./commands');

  for (const file of commandFiles) {
    const command = require(file);
    commands.push(command.data.toJSON());
  }

  try {
    console.log('Starting refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId, guildId), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
