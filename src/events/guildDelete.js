const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.guildDelete,
  once: false,

  /**
   *
   * @param {import('discord.js').Guild} guild
   * @param {import('discord.js').Client} client
   */

  async execute(guild, client) {
    const { id, name } = guild;

    try {
      const result = await client.dbGuilds.deleteOne({ id });

      if (result.deletedCount === 1) {
        console.log(`Sucessfully removed guild, name: ${name} | Id: ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
