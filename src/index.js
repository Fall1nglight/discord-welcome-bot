const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');

const { token } = require('../config.json');
const { registerEvents, registerCommands } = require('./utils/registry');

// todo
// check if the message isn't DM
// check pinged user's role position
// check the user's role position who initiated the interaction
// compare these two
// sort commands by categories
// check if user is bannable
// find a workaround userId interaction option
// testing

const myIntents = new Intents();
myIntents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES
);

const client = new Client({ intents: myIntents });
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.login(token);

(async () => {
  await registerEvents(client);
  await registerCommands(client);

  try {
    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
