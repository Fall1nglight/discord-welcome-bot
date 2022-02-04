const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Replies with TEST'),

  async execute(interaction) {
    await interaction.reply('TEST');
  },
};
