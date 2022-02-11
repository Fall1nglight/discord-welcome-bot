const { Client, Collection } = require('discord.js');

const { myIntents } = require('./utils/intents');
const { registerEvents, registerCommands } = require('./utils/registry');
const { token } = require('../config.json');

const client = new Client({ intents: myIntents });
client.commands = new Collection();

(async () => {
  await registerEvents(client, './events');
  await registerCommands(client, './commands');

  try {
    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
