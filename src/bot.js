const { Client, Collection } = require('discord.js');

const { myIntents } = require('./utils/intents');

const client = new Client({ intents: myIntents });
client.commands = new Collection();

module.exports = { client };
