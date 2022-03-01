const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.guildCreate,
  once: false,

  async execute(guild, client) {},
};
