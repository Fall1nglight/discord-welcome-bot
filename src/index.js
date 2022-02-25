const { registerEvents, registerCommands } = require('./utils/registry');
const { client } = require('./bot');
const { token } = require('../config.json');

// todo
// rename string and int slashCommand options

(async () => {
  try {
    await registerEvents(client, './events');
    await registerCommands(client, './commands');

    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
