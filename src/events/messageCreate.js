const { EVENTS } = require('../utils/utils');
const { prefix } = require('../../config.json');

module.exports = {
  name: EVENTS.messageCreate,
  once: false,

  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;

    const { content } = message;
  },
};
