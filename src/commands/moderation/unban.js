const { SlashCommandBuilder } = require('@discordjs/builders');

// todo: if (!message.guild) return;

module.exports = {
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
