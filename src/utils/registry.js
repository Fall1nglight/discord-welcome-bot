const fs = require('fs').promises;

async function registerEvents(client) {
  // read files from /events folder and filter them to only .js files
  const eventFiles = (await fs.readdir('./src/events')).filter((file) =>
    file.endsWith('.js')
  );

  // loop over event files
  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    // set a one-time event listener or a standard one
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

const registerCommands = async (client) => {
  const core = async (dirname) => {
    const commandFiles = await fs.readdir(dirname);

    for (const file of commandFiles) {
      // eslint-disable-next-line no-await-in-loop
      const stat = await fs.stat(`${dirname}/${file}`);

      if (stat.isDirectory()) core(`${dirname}/file`);
    }
  };

  // do recursive call
  // or read all files in directories and so on
  // and then loop over an array

  await core('./src/commands');

  // .isDirector() => recursive call
};

module.exports = {
  registerEvents,
  registerCommands,
};
