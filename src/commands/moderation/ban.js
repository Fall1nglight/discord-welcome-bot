const { SlashCommandBuilder } = require('@discordjs/builders');

const { CATEGORIES } = require('../../utils/utils');

module.exports = {
  config: {
    location: __filename,
    ownerOnly: false,
    dm: false,
    category: CATEGORIES.utility,
    cooldown: 3000,
  },

  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Specify @member')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('string').setDescription('Reason')
    )
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of days of messages to delete')
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason =
      interaction.options.getString('string') || 'No reason was given.';
    const days = interaction.options.getInteger('int');

    const {
      member: { guild },
    } = interaction;

    // ? check
    guild.members.ban(user, { days, reason });

    await interaction.reply('');
  },
};
