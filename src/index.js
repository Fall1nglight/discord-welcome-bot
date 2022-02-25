const { registerEvents, registerCommands } = require('./utils/registry');
const { client } = require('./bot');
const { token } = require('../config.json');

// todo
// rename string and int slashCommand options
// design the command.config object
// category
// location
// ownerOnly
// dm
// coolDown
// aliases

// add default cooldown

// design cooldown system
// need client.cooldown collection
// key: command.name, value: collection
// when someone executes a command get the collection by the command name
// an object gets added to the collection
// keys: id -> user.id, executedAt -> current time, expiresAt -> current time + command.config.cooldown
// check expiresAt if it's lower than the current time
// then decide what to do

(async () => {
  try {
    await registerEvents(client, './events');
    await registerCommands(client, './commands');

    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
