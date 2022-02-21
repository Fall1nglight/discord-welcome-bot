const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collection } = require('discord.js');

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
    // todo
    // optimize code
    // clear user messages
    // avoid using followUp()
    // correct try-catch
    // correct variable naming
    // prompt user the question
    // use embed with emojis
    // set default poll time to 30s
    // ? graph

    const defaultPromptTime = 20000;
    const defaultPollTime = 10000;

    const numOfAnswers = interaction.options.getInteger('int');
    const pollTime =
      interaction.options.getInteger('timeout') || defaultPollTime;
    const currEmojis = pollEmojis.slice(0, numOfAnswers);
    const userFilter = (m) =>
      interaction.user.id === m.author.id && !m.author.bot;
    const reactionFilter = (reaction) =>
      currEmojis.includes(reaction.emoji.name);

    try {
      const firstReply = await interaction.reply(
        `Creating poll..\nNow you have ${
          defaultPollTime / 1000
        } seconds to submit your poll answers.\nPlease write each answer in different messages!`
      );

      const messages = await interaction.channel.awaitMessages({
        filter: userFilter,
        time: defaultPromptTime,
        max: numOfAnswers,
        errors: ['time'],
      });

      const answers = [];
      const test = new Map();
      Array.from(messages.values()).forEach(({ content }, i) => {
        const emoji = pollEmojis[i];

        answers.push(`${emoji} : ${content}`);
        test.set(emoji, content);
      });

      const pollMessage = await interaction.followUp(answers.join('\n'));
      const collector = pollMessage.createReactionCollector({
        filter: reactionFilter,
        time: pollTime,
      });

      currEmojis.forEach(async (emoji) => {
        await pollMessage.react(emoji);
      });

      const finalResult = new Collection();

      // put everything inside this
      collector.on('end', async (collected) => {
        for (const [emoji, reaction] of collected) {
          finalResult.set(emoji, {
            answer: test.get(emoji),
            count: reaction.count,
          });
        }

        const voteCounts = collected.map((reaction) => reaction.count);
        const winnerCount = Math.max(...voteCounts);
        const filteredWinners = finalResult.filter(
          (result) => result.count === winnerCount && result.count > 1
        );

        // console.log({ filteredWinners });

        if (!filteredWinners.size)
          return interaction.followUp('Nobody participated in the poll!');

        if (filteredWinners.size === numOfAnswers)
          return interaction.followUp(
            `Every answer got the same amount of votes ${winnerCount}!`
          );

        if (filteredWinners.size === 1 || filteredWinners.size > 1) {
          const reply = Array.from(filteredWinners.values())
            .map(({ answer, count }) => `${answer} - ${count} votes`)
            .join('\n');

          await interaction.followUp(
            `${
              filteredWinners.size > 1 ? 'Winners' : 'Winner'
            } of the vote\n${reply}`
          );
        }
      });
    } catch (error) {
      console.log({ error });
      await interaction.followUp('You did not enter any input!');
    }
  },
};
