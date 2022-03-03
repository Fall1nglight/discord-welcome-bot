const { MongoClient } = require('mongodb');

const { registerEvents, registerCommands } = require('./utils/registry');
const { client } = require('./bot');
const { token, dbUrl, dbName } = require('../config.json');

const dbClient = new MongoClient(dbUrl);

(async () => {
  try {
    await dbClient.connect();
    console.log('Sucessfully connected to the database..');

    const database = dbClient.db(dbName);
    const guilds = database.collection('guilds');

    client.database = database;
    client.dbGuilds = guilds;

    await registerEvents(client, './events');
    await registerCommands(client, './commands');

    client.login(token);
  } catch (error) {
    console.error(error);
  }
})();
