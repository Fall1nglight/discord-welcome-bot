const { Intents } = require('discord.js');

const myIntents = new Intents();

myIntents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES
);

module.exports = {
  myIntents,
};
