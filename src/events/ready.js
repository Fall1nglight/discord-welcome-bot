const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.ready,
  once: true,

  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
