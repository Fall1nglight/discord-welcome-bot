const { Client, Collection } = require('discord.js');

const { myIntents } = require('./utils/intents');
const { registerEvents, registerCommands } = require('./utils/registry');
const { token } = require('../config.json');

const client = new Client({ intents: myIntents });
client.commands = new Collection();

// todo
// add role checking to moderation
// decide what to do if the command does not have
// any permissions set

// poll commands

(async () => {
  await registerEvents(client, './events');
  await registerCommands(client, './commands');

  try {
    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
