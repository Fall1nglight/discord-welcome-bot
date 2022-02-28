const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const axios = require('axios').default;
const randomUseragent = require('random-useragent');

const { CATEGORIES } = require('../../utils/utils');

module.exports = {
  config: {
    location: __filename,
    ownerOnly: false,
    dm: true,
    category: CATEGORIES.utility,
    cooldown: 8000,
  },

  data: new SlashCommandBuilder()
    .setName('random-joke')
    .setDescription('Gets you a random joke'),

  clientPerms: [Permissions.FLAGS.SEND_MESSAGES],

  async execute(interaction) {
    const API_URL = 'https://icanhazdadjoke.com/';

    await interaction.deferReply();

    try {
      const { data: response } = await axios.get(API_URL, {
        headers: {
          Accept: 'application/json',
          'User-agent': randomUseragent.getRandom(),
        },
      });

      await interaction.editReply(response.joke);
    } catch (error) {
      await interaction.editReply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
