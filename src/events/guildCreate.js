const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.guildCreate,
  once: false,

  /**
   *
   * @param {import('discord.js').Guild} guild
   * @param {import('discord.js').Client} client
   */

  async execute(guild, client) {
    const { id, name, description, createdTimestamp, memberCount, ownerId } =
      guild;

    try {
      const insertedGuild = await client.dbGuilds.insertOne({
        id,
        name,
        description,
        createdTimestamp,
        memberCount,
        ownerId,
        settings: {
          welcomeMessages: [],
        },
      });

      console.log(
        `New guild was successfully inserted to database with the _id: ${insertedGuild.insertedId}`
      );
    } catch (error) {
      console.error(error);
    }
  },
};
