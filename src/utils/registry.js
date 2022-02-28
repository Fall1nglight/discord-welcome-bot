const { Collection } = require('discord.js');
const AsciiTable = require('ascii-table');

const { readFiles } = require('./utils');
const { EVENTS } = require('./utils');

const registerEvents = async (client, givenPath) => {
  const Table = new AsciiTable('Events');
  const eventFiles = await readFiles(givenPath);

  for (const file of eventFiles) {
    const event = require(file);
    const { name: eventName } = event;

    if (!EVENTS[eventName]) {
      Table.addRow(
        eventName || 'Missing name',
        '✖ Event name is invalid or missing'
      );
      continue;
    }

    if (event.once) {
      client.once(eventName, (...args) => event.execute(...args, client));
    } else {
      client.on(eventName, (...args) => event.execute(...args, client));
    }

    Table.addRow(eventName, '✔ Successfully loaded');
  }

  console.log(Table.toString());
};

const registerCommands = async (client, givenPath) => {
  const Table = new AsciiTable('Commands');
  const commandFiles = await readFiles(givenPath);

  for (const file of commandFiles) {
    const command = require(file);

    if (!command.data?.name) {
      Table.addRow('Missing name', '✖ Failed to load');
      continue;
    }

    const {
      data: { name: commandName },
    } = command;

    client.commands.set(commandName, command);
    client.cooldowns.set(commandName, new Collection());

    Table.addRow(commandName, '✔ Successfully loaded');
  }

  console.log(Table.toString());
};

module.exports = {
  registerEvents,
  registerCommands,
};
