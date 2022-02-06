const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
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
    const reason = interaction.options.getString('string');

    member.kick(reason || '');

    await interaction.reply(`Kicked ${member}!`);
  },
};
