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
    .setName('kick')
    .setDescription('Kicks a member')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('Specify @member')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('string').setDescription('Reason')
    ),

  async execute(interaction) {
    const member = interaction.options.getMember('target');
    const reason =
      interaction.options.getString('string') || 'No reason was given.';

    member.kick(reason);
    await interaction.reply(`Kicked ${member}!`);
  },
};
