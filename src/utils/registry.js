const { readFiles } = require('./utils');

const registerEvents = async (client, givenPath) => {
  const eventFiles = await readFiles(givenPath);

  for (const file of eventFiles) {
    const event = require(file);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
};

const registerCommands = async (client, givenPath) => {
  const commandFiles = await readFiles(givenPath);

  for (const file of commandFiles) {
    const command = require(file);

    if (!command.clientPerms) {
      console.log(`Command '${command.data.name}' has no permission(s).`);
    }

    client.commands.set(command.data.name, command);
  }
};

module.exports = {
  registerEvents,
  registerCommands,
};
