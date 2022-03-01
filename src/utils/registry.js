const { Collection } = require('discord.js');
const AsciiTable = require('ascii-table');

const { readFiles, EVENTS, defaultCmdConfKeys } = require('./utils');

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

    // name check
    if (!command.data?.name) {
      Table.addRow('Missing name', '✖ Command name is invalid or missing');
      continue;
    }

    const {
      data: { name: commandName },
    } = command;

    // config check
    const cmdConfKeys = Object.keys(command.config);
    const assignedKeys = [...defaultCmdConfKeys, ...cmdConfKeys];
    const set = new Set(assignedKeys);

    if (set.size !== defaultCmdConfKeys.length) {
      Table.addRow(commandName, '✖ Command config is invalid or missing');
      continue;
    }

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
