const { registerEvents, registerCommands } = require('./utils/registry');
const { client } = require('./bot');
const { token } = require('../config.json');

// todo
// setup logger
// setup permission system
// setup database
// disable command cooldown when command is executed by
// specific role / user / member

// todo
// welcome message module
// set channel id
// set default
// option to add more

// amikor a bot csatlakozik egy szerverre
// létrehozunk egy kollekciót az adatbázisunkban

(async () => {
  try {
    await registerEvents(client, './events');
    await registerCommands(client, './commands');

    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
