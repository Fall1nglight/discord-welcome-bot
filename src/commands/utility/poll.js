const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { pollEmojis } = require('../../utils/emojiCharacters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of answers')
        .setMinValue(2)
        .setMaxValue(10)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('timeout')
        .setDescription('Poll time')
        .setMinValue(15)
        .setMaxValue(300)
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply('Please write the answers in different messages');

    const numOfAnswers = interaction.options.getInteger('int');
    const pollTime = interaction.options.getInteger('timeout') || 10000;
    const currEmojis = pollEmojis.slice(0, numOfAnswers);
    const userFilter = (m) => interaction.user.id === m.author.id;
    const reactionFilter = (reaction) =>
      currEmojis.includes(reaction.emoji.name);

    try {
      const messages = await interaction.channel.awaitMessages({
        filte: userFilter,
        time: 20000,
        max: numOfAnswers,
        errors: ['time'],
      });

      const answers = Array.from(messages.values())
        .map((message, i) => `${pollEmojis[i]} : ${message.content}`)
        .join('\n');

      const pollMessage = await interaction.followUp(answers);
      const collector = pollMessage.createReactionCollector({
        filter: reactionFilter,
        time: pollTime,
      });

      currEmojis.forEach(async (emoji) => {
        await pollMessage.react(emoji);
      });

      collector.on('end', (collected) => {
        const pollResult = collected.filter((reaction) => reaction.count > 1);
      });
    } catch (error) {
      console.log(error);
      await interaction.followUp('You did not enter any input!');
    }
  },
};
