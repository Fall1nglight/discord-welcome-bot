const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of answers')
        .setMinValue(1)
        .setMaxValue(10)
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async exectute(interaction) {
    await interaction.reply('Please write the answers in different messages');

    const numOfAnswers = interaction.options.getInteger('int') || 1;

    const filter = (m) => interaction.user.id === m.author.id;

    interaction.channel
      .awaitMessages({
        filter,
        time: 60000,
        max: numOfAnswers,
        errors: ['time'],
      })
      .then((messages) => {
        interaction.followUp(`You've entered: ${messages.first().content}`);
      })
      .catch(() => {
        interaction.followUp('You did not enter any input');
      });
  },
};
