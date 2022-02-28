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
    .setName('unban')
    .setDescription('Unbans member')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription(`Banned user's id`)
        .setRequired(true)
    ),

  async execute(interaction) {
    const {
      member: { guild },
    } = interaction;

    const id = interaction.options.get('target')?.value;
    guild.members.unban(id);
  },
};
